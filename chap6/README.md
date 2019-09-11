# Chap 6. 익스프레스 웹 서버 만들기

4장까지의 내용으로 웹 서버를 만들 경우 코드의 구조와 확장성이 떨어진다. npm 에서 서버 제직시의 불편함을 해소하고 편의 기능을 추가한 웹 서버 프레임워크들 중 가장 인기가 많은 것이 익스프레스이다. 코드를 분리하여 관리할 수 있도록 했고 여러 편의 기능을 가진 패키지를 사용하여 쉽게 웹 서버를 구축할 수 있다.

## 6.1 Expres-generator로 빠르게 설치하기

Express-generator : 익스프레스 프레임워크에 필요한 package.json 과 기존 폴더구조를 잡아주는 패키지. express-generator 라는 콘솔 명령어를 사용해야 하므로 전역 설치가 필요

```bash
npm i -g express-generator
```

설치가 완료되면 익스프레스 프로젝트(여기서는 learn-express)를 생성할 경로로 이동 후 아래 명령어를 수행하면 package.json 과 폴더 구조를 생성

```bash
express learn-express --view=pug
```

`--view=pug` 라는 옵션은 템플릿 엔진으로 Pug(구 Jade) 를 쓰겠다는 의미 EJS 를 쓰겠다면 `--view=ejs` 로 입력하면 됨

생성된 프로젝트 경로로 들어가서 관련 패키지를 설치

```bash
cd learn-express && npm i
```

생성된 폴더 구조를 보면,

- ./app.js 파일 : 핵심 서버 역할 수행. 서버 내 미들웨어와 라우팅 구문
- ./bin/www 파일 : 서버를 실행하는 스크립트
- ./public/ 폴더 : 외부(클라이언트)에서 접근 가능한 파일들(이미지, js파일, css파일) 위치
- ./routes/ 폴더 : 주소별 라우터들 위치. 서버의 로직 대부분이 여기서 코딩
- ./views/ 폴더 : 템플릿 파일들 위치. 서버의 화면 부분은 여기서 코딩
- ./models/ 폴더(예정) : 데이터베이스 관련 부분 위치. 데이터베이스 공부 후 생성 예정

MVC 구조에 따라 각 로직을 routes, views, models 폴더에 위치할 예정

서버의 실행 : package.json 파일의 scripts 에 start 속성으로 `node ./bin/www` 구문이 존재하여 콘솔에서 `npm start` 구문으로 서버 실행

실행 후 초기화면은 `https://localhost:3000` 주소로 확인 가능

## 6.2 익스프레스 구조 이해하기

각자의 역할에 따라 코드가 여러 파일로 분산되어 있으므로 관리가 용이

- ./bin/www 파일
  - http 모듈에 express 모듈을 연결하고 포트를 지정하는 역할
  - 파일에 확장자가 없고 `#!/usr/bin/env node` 라는 주석이 첫줄에 있는데 이는 www 파일을 콘솔 명령어로 수행시 활용되는 부분(콘솔 명령어를 만드는 방법은 14장 참조)
  - debug 모듈은 콘솔에 로그를 남기는 역할

  ```javascript
  var debug = require('debug')('learn-express:server');
  ```

  - 포트번호는 press.env.PORT 에 값이 있으면 해당 포트번호를, 없으면 3000으로 지정. `app.set(key, value)` 명령으로 express 서버에 값을 세팅하고 `app.get(key)` 로 다시 가져올 수 있다.(하단 app.js 파일 설명 참조)

  ```javascript
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
  ```

  - `http.createServer()` 메서드에 express 서버 모듈을 콜백으로 세팅하고 포트번호 지정

  ```javascript
  var server = http.createServer(app);
  server.listen(port);
  ```

- ./app.js 파일
  - express 패키지를 호출하여 app 변수 객체를 생성

  ```javascript
  var app = express();
  ```

  - view 파일 경로(./views/)와 템플릿 엔진(Pug)을 지정

  ```javascript
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug);
  ```

  - `app.use()` 메서드로 정의되는 부분들은 미들웨어를 정의하는 부분 (하단 6.3 참조)
  - 최하단에 `module.exports = app;` 구문으로 app를 export 하여 www 파일에서 사용하도록 설정

## 6.3 미들웨어

익스프레스의 핵심이자 수작업으로 생성한 http 서버와 가장 큰 차이점이라고 할 수 있으며, 요청과 응답을 중간에서 조작 또는 처리를 하여 새로운 기능을 부여하거나 개발을 용이하게 하는 역할을 수행. app.js 파일을 보면 여러개의 `app.use()` 메서드 구문들을 볼 수 있는데 이것들 하나하나가 미들웨어라고 이해하면 된다.

```javascript
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
```

서버로 요청이 들어오면 상단의 `app.use()` 구문부터 순차적으로 거치면서 각 기능에 맞게 처리가 된 후 마지막으로 라우터에서 클라이언트로 응답을 송신

### 6.3.1 커스텀 미들웨어 만들기

app.js 파일에 아래 부분을 추가함으로서 미들웨어를 생성

```javascript
app.use(function(req, res, next) {
    console.log('미들웨어 수행');
    next();
});
```

반드시 미들웨어 안에 `next();` 구문을 추가해야만 다음 미들웨어로 요청이 전달됨. 현재 적용되어 있는 `logger()`, `express.json()` 등의 미들웨어도 내부적으로는 `next();`를 호출

`next()` 또는 응답을 리턴(`res.send()`)하는 식으로 처리하지 않으면 클라이언트에서 무한 바람개비가 돌게 된다.

`next()` 함수의 인자로 route 주소를 넣으면 다음 라우터로 이동하고 그 외 다른 값을 넣으면 뒤의 미들웨어를 건너뛰고 바로 에러 핸들러로 이동. 에러 핸들러는 일반적으로 가장 아래에 위치하여 에러를 받아 처리

```javascript
//404 처리 미들웨어
app.use(function(req, res, next) {
    next(createError(404));
});

//에러 핸들러 - 내용은 6.5장에서 설명 예정
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
```

`app.use(function(req, res, next) { ... }, fuction(req, res, next) { ... }, ... );` 형태로 하나의 `app.use()` 안에 여러 미들웨어를 넣을 수도 있다.

### 6.3.2 morgan

서버 콘솔에서 출력되는 `GET / 200 51.267 ms - 1539` 형태의 로그를 출력하게 해주는 모듈. 사용 방법은 아래와 같다.

```javascript
var logger = require('morgan');

app.use(logger('dev'));
```

- `logger()` 함수의 인자
  - `dev` : 개발 시 사용. 출력문구형태 : HTTP요청(GET) 주소(/) HTTP상태코드(200) 응답속도(51.267 ms) - 응답바이트(1539)
  - `short` : 개발 시 사용. 출력문구형태 : ::1 - GET / HTTP/1.1 200 1539 - 51.267 ms
  - `common` : 배포 시 사용. 출력문구형태 : ::1 - - [06/Sep/2019:08:26:44 +0000] "GET / HTTP/1.1" 200 1539
  - `combined` : 배포시 사용. 출력문구형태 : ::1 - - [06/Sep/2019:08:28:26 +0000] "GET / HTTP/1.1" 200 1539 "<http://localhost:3000/>" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"

콘솔이 아닌 파일이나 DB 상에 로그를 남길 수도 있으나 이런경우 winston 이라는 모듈을 더 사용.(15.1.6절 참조)

### 6.3.3 body-parser

요청의 본문을 해석하는 역할. form 데이터나 AJAX 요청의 데이터를 처리.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

익스프레스 4.16의 과거 버전에서는 별도 모듈로 존재했었기 때문에 `var bodyParser = require('body-parser');` 구문으로 설치 후에 `app.use(bodyParser.json());` 형태로 사용해야 했으나 현재는 익스프레스에 일부 기능이 내장되어 그대로 사용 가능.

`json()` 구문은 JSON 형태의 데이터를 받을 때 사용

`urlencoded()`는 폼 전송과 같은 주소 형식으로 보내는 데이터를 처리. `{ extended: false }` 옵션에서 false로 줄 경우 노드의 querystring 모듈로 쿼리스트링을 해석하고 true면 qs 모듈을 사용하는데 qs 는 내장 모듈이 아닌 npm 패키지이므로 사용하려면 설치해야 함

body-parser는 데이터를 처리 후 `req.body` 부분에 객체 형태로 담아주므로 이후 라우터에서 꺼내 쓰면 되며, 내부적으로 버퍼링을 하므로 스트림처리를 걱정할 필요 없음

Raw, text 형식의 본문을 해석하는 경우는 body-parser를 설치하여 아래와 같이 추가

```javascript
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

multipart/form-data 같은 폼을 통해 전송되는 데이터는 body-parser가 해석하지 못하므로 다른 모듈을 사용해야 함(9.4절 참조)

### 6.3.4 cookie-parser

요청에 동봉된 쿠키를 해석하는 역할을 수행

```javascript
var cookieParser = require('cookie-parser');

app.use(cookieParser());
```

해석된 쿠키들은 `req.cookies`에 객체 형태로 담김

`app.use(cookieParser('secret code'))` 형태로 문자열을 인자로 넣으면 해당 문자열로 서명된 쿠키가 되어 클라이언트에서 수정하는 행동을 막을 수 있음

### 6.3.5 static

정적인 파일들을 제공하는 역할을 수행하며 익스프레스에 내장된 미들웨어

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

함수의 인자로 정적 파일이 담긴 폴더경로(/public/)를 지정. url 주소 경로와 실제 내부 서버경로를 다르게 만들면 보안상 도움이 되므로 반드시 추가 경로(public과 같은)를 지정할 것

아래와 같이 인자를 추가하면 url에 추가 query 주소를 할당해서 접근하게 할 수 있음

```javascript
//"http://localhost:3000/img/abc.png" 요청 -> /public/abc.png 제공
app.use('/img', express.static(path.join(__dirname, 'public')));
```

미들웨어 순서상 앞쪽으로 배치해야 불필요한 미들웨어 작업을 막을 수 있다. 보통 morgan(로거) 바로 뒤에 위치

### 6.3.6 express-session

세션 관리 역할 담당. express-generator 로 설치되지 않으므로 모듈을 직접 설치해야함(콘솔에서 `npm i express-session`)

```javascript
var session = require('express-session');

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
```

인자값 상세

- `resave` : 요청이 왔을때 세션에 수정사항이 없어도 세션 다시 저장 여부
- `saveUninitialized` : 세션에 저장할 내역이 없더라도 세션 저장 여부, 방문자 추적시 사용
- `secret` : 필수 항목. cookie-parser의 비밀키와 같은 역할. 세션 관리 시 클라이언트에 쿠키(세션 쿠키)를 보내는데 이 쿠키를 안전하게 전송하기 위해 추가되는 서명. cookie-parser의 서명과 동일하게 해야 함.
- `cookie` : 일반적인 쿠키옵션을 모두 지정 가능. `secure`는 https 옵션으로 `true`로 설정하면 https 프로토콜에서만 사용이 가능하므로 개발 환경에서는 해제하고 운영에서 적용하는 것이 좋음. 추가로 `store` 옵션이 있을 수 있는데 세션을 어디에 저장할지 지정할 수 있으며 default 는 메모리 저장이나 서비스 개발시에는 DB(보통 Redis)에 저장하도록 하는 것이 좋다.

세션값은 `req.session` 객체에 저장되며 한번에 삭제 시에는 `req.session.destroy()` 메서드로 가능

현재 세션ID 는 `req.sessionID` 에 저장

1.5 이전 버전에선 내부적으로 cookie-parser를 사용하고 있어서 위치가 뒤로가야 했으나 현재는 사용하지 않고 있어서 문제가 없음. 그래도 되도록이면 cookie-parser 뒤로 위치하는 것이 좋음

### 6.3.7 connect-flash

크게 필요한 미들웨어는 아니나 적용하면 유용하게 사용. 클라이언트로 일회성 메시지를 보내는 역할을 하며 한번 사용된 메시지는 자동으로 삭제되므로 편하며 주로 일회성 팝업 메시지를 보낼때 사용

`npm i connect-flash` 명령으로 별도 설치

적용 시에는 아래와 같이...

```javascript
var flash = require('connect-flash');

app.use(flash());
```

req 객체에 `req.flash(키, 값)` 메서드로 값을 추가하고 `req.flash(키)` 메서드로 값을 호출. 일회성 메시지이므로 한번 호출한 값은 다시 호출해도 보여지지 않음. /routes/users.js 파일 참조

## 6.4 Router 객체로 라우팅 분리하기

익스프레스는 파일단위로 라우팅을 지원하므로 관리용이성이 좋아짐

- app.js

  ```javascript
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  ```

  `app.use(경로, 라우터파일);` 형태로 라우터를 연결하며 라우터도 일종의 미들웨어라고 볼 수 있음

  `app.get(경로, 라우터)`, `app.post(경로, 라우터)`와 같이 특정 HTTP 메서드(get, post, put, patch, delete)에 대해서만 라우팅되도록 하는 것도 가능

- 라우터 파일

  ```javascript
  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  module.exports = router;
  ```

  `express.Router();` 로 라우터 객체를 생성하여 `module.exports = router;` 로 라우터를 모듈화하여 app.js 나 다른 라우터에서 사용하도록 처리

  `router.get(경로, 처리함수);` 또한 app.js 에서와 같이 특정 HTTP 메서드에 대해 상응하는 형태며, 처리함수(미들웨어) 또한 연속으로 넣어주고 `next()` 메서드를 활용하면 파이핑되어 수행. 만일 앞단의 미들웨어에서 뒤에 있는 미들웨어를 건너뛰고 싶다면 `next('route')`를 수행

  라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 함. res 객체의 메서드를 사용. 하나의 요청에 대해 응답은 반드시 하나만 보내야 하며 두번 이상 보내면 에러 발생
  - `res.send(버퍼 또는 문자열 또는 HTML 또는 JSON)` : 만능
  - `res.sendFile(파일 경로)`
  - `res.json(JSON 데이터)`
  - `res.redirect(주소)`
  - `res.render('템플릿 파일 경로', { 변수 })`
  - `res.status(404).send('Not Found`)` : HTTP 상태코드와 응답을 함께 전송

  라우터 주소에 특수 패턴을 적용할 수 있는데,

  ```javascript
  router.get('/users/:id', function(req, res) {
    console.log(req.params, req.query);
  });
  ```

  위의 `'/users/:id'` 형태로 경로를 지정할 경우 `req.params` 객체 안에 id 값으로 `:id` 의 값이 매핑된다. 경로가 /users/123 인 경우 `req.params.id` 로 '123' 값을 조회할 수 있다.

  `/users/123?limit=5&skip=10` 형태로 주소가 오는 경우, `req.params` 에는, `{ id: '123' }`, `req.query` 에는 `{ limit: '5', skip: '10' }` 값이 존재

  `next(createError(404))` 형태로 에러를 넘기면 에러 핸들러로 넘어감

## 6.5 템플릿 엔진 사용하기

HTML은 정적인 언어이므로 반복된 데이터 등을 표현할 때 자바스크립트가 필요하며, 템플릿 엔진은 자바스크립트를 이용하여 HTML을 렌더링 할 수 있게 해준다. 대표적인 템플릿 엔진으로 Pug와 EJS 가 있다.

### 6.5.1 Pug(Jade)

우선 app.js 에 아래와 같이 설정

```javascript
app.set('views', path.join(__dirname, 'views')); //템플릿 파일들의 위치를 지정(/views/)
app.set('view engine', 'Pug'); // 사용할 템플릿 엔진 지정
```

#### 6.5.1.1 HTML 표현

HTML과 다르게 화살괄호(<, >)와 닫기태그를 사용하지 않으며, 동일한 길이의 스페이스 또는 텝으로 부모자식관계를 규정.

`doctype html` 은 `<!DOCTYPE html>`을 의미

```Pug
doctype html
html
  head
    title= title           //res.rendor() 메서드에서 보내준 파라미터 객체내의 title 변수값 출력
    link(rel='stylesheet', href='/stylesheets/style.css') //속성은 괄호안에 입력
    style.                 //태그 내에 css, javascript 코드 입력 시 태그 뒤에 점
      h1 {
        font-size: 30px;
      }
    script.
      var message = 'Pug';
      alert(message);
  body
    #login-button          //div 태그는 생략 가능, #은 id 속성
    .post-image            //.은 class 속성
    span#highlight
    p.hidden.full
    p Welcome to Express  //텍스트는 태그 뒤에 한칸 띄우고 입력
    button(type='submit') 전송
    p
      | 안녕하세요.        //텍스트 여러 줄 입력은 파이프(|) 활용
      | 여러줄을 입력합니다.
      br
      | 태그도 중간에 넣을 수 있습니다.
```

HTML로 표현하면 아래와 같다

```html
<!DOCTYPE html>
<html>
  <head>
    <title>익스프레스</title>
    <link rel='stylesheet' href='/stylesheets/style.css'>
    <style>
      h1 {
        font-size: 30px;
      }
    </style>
    <script>
      var message = 'Pug';
      alert(message);
    </script>  
  </head>
  <body>
    <div id="login-button"></div>
    <div class="post-image"></div>
    <span id="highlight"></span>
    <p class="hidden full"></p>
    <p>Welcome to Express</P>
    <button type="submit">전송</button>
    <p>안녕하세요. 여러줄을 입력합니다.<br />태그도 중간에 넣을 수 있습니다.</p>
  </body>
</html>
```

#### 6.5.1.2 변수

자바스크립트 변수를 템플릿에 렌더링 시 전달 가능. 라우터에서 아래와 같이 입력

```javascript
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

여기서 `{ title: 'Express' }` 부분이 자바스크립트 변수값을 전달한 것으로 템플릿에서 아래와 같이 활용 가능

```Pug
h1= title                               //변수를 텍스트로 사용시 테그뒤에 =
p Welcome to #{title}                   //변수가 텍스트에 포함 시 #{변수}
button(class=title, type='submit') 전송 //속성에 변수 사용
input(placeholder=title + ' 연습')
- var node = 'node.js'                  // - 뒤에 변수 직접 선언
- var js = 'Javascript'
p #{node}와 #{js}
p= '<strong>이스케이프&</strong>'
p!= '<strong>이스케이프 하지 않음</strong>'
```

변환하면...

```html
<h1>Express</h1>
<p>Welcome to Express</p>
<button class="Express" type="submit">전송</button>
<input placeholder="Express 연습" />
<p>Node.js와 Javascript</p>
<p>&lt;strong&gt;이스케이프&amp;&lt;/strong&gt;</p>
<p><strong>이스케이프 하지 않음</strong></p>
```

`{ title: 'Express' }` 값은 `res.locals` 객체에 담겨있으며 템플릿 엔진 뿐만 아니라 다른 미들웨어에서도 이 객체에서 해당 변수에 접근하거나 다른 변수를 추가 가능

#### 6.5.1.3 반복문

변수가 반복 가능한 경우 반복문 사용 `each` 문을 사용하며 `index`로 인덱스도 발췌. `each` 대신 `for` 사용 가능

```pug
ul
  each fruit in ['사과', '배', '오렌지', '바나나', '복숭아']
    li= fruit
ul
  each fruit, index in  ['사과', '배', '오렌지', '바나나', '복숭아']
    li= (index + 1) + '번째 ' + fruit
```

변환하면...

```html
<ul>
  <li>사과</li>
  <li>배</li>
  <li>오렌지</li>
  <li>바나나</li>
  <li>복숭아</li>
</ul>
<ul>
  <li>1번째 사과</li>
  <li>2번째 배</li>
  <li>3번째 오렌지</li>
  <li>4번째 바나나</li>
  <li>5번째 복숭아</li>
</ul>
```

#### 6.5.1.4 조건문

`if`, `else if`, `else`, `case`, `when`, `default` 문으로 분기 처리

```pug
if isLoggedIn
  div 로그인 되었습니다.
else
  div 로그인이 필요합니다.
case fruit
  when 'apple'
    p 사과입니다.
  when 'banana'
    p 바나나입니다.
  default
    p 사과도 바나나도 아닙니다.
```

변환하면...

```html
<div>로그인 되었습니다.</div>
<p>사과입니다.</p>
```

#### 6.5.1.5 include

#### 6.5.1.6 extends 와 block

### 6.5.2 EJS

#### 6.5.2.1 변수

#### 6.5.2.2 반복문

#### 6.5.2.3 조건문

#### 6.5.2.4 include

### 6.5.3 에러 처리 미들웨어
