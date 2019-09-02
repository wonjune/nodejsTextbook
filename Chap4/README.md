# Chap 4. http 모듈로 웹 서버 만들기

## 4.1 요청과 응답 이해하기

서버의 동작은 클라이언트의 요청(request)을 받은 후 처리한 뒤 응답(response)를 보내는 형태이며, 따라서 서버는 요청을 받고 응답을 보내는 부분(이벤트 리스너)가 필요

- createServer.js, server1.js
  - ```http.createServer((req, res) => { 요청(req)에 대한 처리와 응답(res)설정 }).listen(포트번호, 연결 후 콜백);```
  - `res.write(응답내용)` : 클라이언트에 내려보낼 응답값 설정. 문자열로 HTML을 입력해도 되고 .html 파일을 넣어도 됨
  - `res.end(응답내용)` : 응답내용을 마지막으로 넣고 응답(response)을 클라이언트로 보냄

- server1-0.js
  - `server.on(이벤트명, 콜백함수)` : 기존 `listen(포트번호)` 메서드 실행 후, 발생되는 서버 이벤트에 수행될 콜백 정의. 이벤트명은 'listening', 'error' 등 지정

- server2.html, server2.js
  - fs 모듈의 `readFile()`메서드로 HTML 파일을 읽고 콜백함수에서 버퍼(data)를 res에 담아 보냄

## 4.2 쿠키와 세션 이해하기

서버에서 클라이언트를 인식하기 위해서는 쿠키와 세션이 필요하다. 쿠키는 단순한 키=값 쌍으로서 서버에서 resonse에 쿠키를 담아 보내주면 브라우저는 저장했다가 서버로 요청을 보낼 때마다 그 쿠키를 동봉해서 보내줌. 쿠키는 요청과 응답의 헤더(header)에 저장

- server3.js
  - `name=zerocho; year=1994` 와 같은 문자열 형태로 오는 쿠키를 `{ name: 'zerocho', year: 1994 }`와 같은 객체형태로 변환하는 별도 함수를 구현
  - `req.headers.cookie` : 클라이언트에서 보내주는 쿠키가 담긴 위치
  - `res.writeHead(응답상태코드, 헤더에넣을내용)` : 응답의 헤더 설정. 두번째 인자에 `{ 'Set-Cookie': "mycookie=test" }` 형태로 쿠키를 설정

- HTTP 상태코드
  - `res.writeHead()` 에 첫번째 인자로 넣었던 상태코드. 서버에서 브라우저의 요청에 대한 응답이 어떤지를 알려주는 코드
  - 2XX : 성공을 의미. 200(성공), 201(작성됨) 등이 있음
  - 3XX : 리다이렉션(다른 주소의 페이지로 넘기는 경우)을 의미. 301(영구 이동), 302(임시 이동) 등
  - 4XX : 요청 요류를 의미. 401(권한 없음), 403(금지됨), 404(찾을 수 없음) 등
  - 5XX : 서버 오류를 의미. 보통은 직접 보내지 않고 서버에서 알아서 보냄. 500(내부 서버 오류), 502(불량 게이트웨이), 503(서비스를 사용할 수 없음) 등

- server4.html, server4.js
  - 쿠키가 없을 경우 로그인화면(server4.html)을 출력하고 로그인 클릭 시(/login) 쿠키에 로그인 명(name)을 설정하고 Root 경로로 리다이렉트. 루트에서는 쿠키를 확인하고 로그인 환영 메시지 출력
  - 로그인 시 id name의 입력값 추출은 아래코드를 이용하여 url의 query 부분을 추출

    ```javascript
    const { query } = url.parse(req.url);
    const{ name } = querystring.parse(query);
    ```

- 쿠키 설정 시 각종 옵션
  - `쿠키명=쿠키값` : 기본 쿠키 설정
  - `Expires=날짜` : 만료기한을 설정. 기본값은 클라이언트 종료시까지
  - `Max-age=초` : 만료기간을 초단위으로 설정. Expires 보다 우선
  - `Domain=도메인명` : 쿠키가 전송될 도메인을 지정. 기본값은 현재 도메인
  - `Path=URL` : 쿠키가 전송될 Url을 지정. 기본값은 '/'이고 모든 url에서 쿠키 전송가능
  - `Secure` : HTTPS일 경우에만 쿠키전송
  - `HttpOnly` : 설정 시 자바스크립트에서 쿠키 접근 차단. 쿠키조작 방지를 위해 설정을 권장

server4.js 처럼 구성하는 경우 개인 계정정보가 쿠키에 그대로 노출되므로 보안 상 매우 위험하므로 세션을 이용해야 한다. 세션은 개인 정보는 서버에서 가지고 있고 쿠키로는 세션ID값만 알려주는 방식. 아래 server5.js 참조

- server5.js
  - 별도의 `session` 객체를 정의해 놓고 로그인 시 `const randomInt = +new Date();` 구문으로 유니크한 아이디를 생성하여 쿠키에 `session=${randomInt}`로 설정. 유저의 name과 계정정보는 `session` 객체 내에 `randomInt`를 키로 별도 객체 생성하여 저장
  - 브라우저에서 보낸 쿠키의 session 값이 `session` 객체에 존재하고 `expires` 값이 유효하면 로그인 인정

실제 서비스되는 웹사이트는 세션정보를 별도 DB로 저장하며, 이 방식도 세션ID가 쿠키에 노출되므로 보안상 안전하지 않음. 따라서 검증된 세션 코드를 사용해야하며 이는 5장, 6장에서 배울 예정

## 4.3 REST API와 라우팅

REST API는 REpresentational State Transfer의 약자로 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법. url 뒤에 /user, /post 등의 명사형태의 문구를 주소에 붙이고 여기에 추가로 "HTTP 요청 메서드"를 사용하여 자원 요청을 정의

- HTTP 요청 메서드
  - GET : 서버의 자원을 요청. 요청 본문(body)에 데이터를 넣지 않음. 데이터를 보낼때는 query스트링을 이용
  - POST : 서버에 자원을 새로 등록 요청. 요청 본문(body)에 등록할 데이터를 첨부
  - PUT : 서버의 자원을 요청에 있는 자원으로 치환 요청. 요청 본문(body)에 치환할 데이터를 첨부
  - PATCH : 서버의 자원의 일부만 수정 요청. 요청 본문(body)에 수정할 데이터를 첨부
  - DELETE : 서버의 자원을 삭제 요청

주소와 메서드만으로 요청의 내용을 명확히 할 수 있으며 HTTP 프로토콜을 사용하면 클라이언트 종류에 상관없이 서버와 소통이 가능. REST API를 따르는 서버를 "RESTful" 하다고 함

- restFront.css, restFront.html, restFront.js, about.html, restServer.js
  - REST API 구조

    | HTTP 메서드 | 주소 | 역할 |
    |---|:---:|---:|
    | 'GET' | / | restFront.html 파일 제공 |
    | 'GET' | /about | about.html 파일 제공 |
    | 'GET' | /users | 사용자 목록 제공 |
    | 'GET' | 기타 | 기타 정적 파일 제공 |
    | 'POST' | /users | 사용자 등록 |
    | 'PUT' | /users/사용자id | 해당 id의 사용자 수정 |
    | 'DELETE' | /users/사용자id | 해당 id의 사용자 삭제 |

  - 클라이언트 사이드(restFront.css, restFront.js, restFront.html)
    1. 페이지 접속 시 GET '/' 경로로 접속하여 restFront.html 화면 출력
    2. 페이지 로딩 후 GET '/users' 로 사용자 목록을 로딩 (restFront.js의 `getUser()` 메서드에서 AJAX 호출)
    3. 사용자 목록에는 '수정', '삭제' 버튼을 출력하고 각각 PUT '/users/사용자id', DELETE '/users/사용자id' 로 요청보내도록 설정
    4. form 을 제출 시에 POST /users 로 데이터를 전송
  - 서버 사이드(about.html, restServer.js)
    1. about.html 은 노드로 여러 HTML 페이지를 제공하는 것을 보여주기 위해 추가
    2. restServer.js 에서 REST API의 주소(req.url)와 메서드(req.method)에 따라 로직 처리
    3. 화면 로딩은 `rs.readFile()` 을 이용하여 해당 html 을 res에 담아 응답
    4. AJAX 요청에 대한 응답은 `res.end(JSON.stringify(객체))`로 응답
    5. POST, PUT으로 들어온 요청은 `req.on('data', 콜백)` 메서드로 버퍼에서 데이터를 받아 별도 변수에 쌓은 후 `req.on('end', 콜백)` 메서드에서 등록/수정 처리를 하고 res에 결과를 담아 응답
    6. 정상처리시 `res.writeHead()` 메서드에 200, 201을 담고 잘못된 url은 404로 응답
  - 데이터는 메모리상의 변수로만 저장되므로 서버 종료전까지만 유지되며 실제로 서비스를 위해서는 DB에 저장이 되어야 함 (7, 8장 내용 참조)

서버를 직접 구성하면 기능이 많아질 수록 코드도 길어지고 관리하기도 어려워지므로 실무에서는 별도 서버 모듈을 이용하여 구성하는 것이 일반적이며 대표적인 것이 Express 모듈이다. 5장에서 Express 모듈과 이를 설치하기 위한 npm에 대해 설명

## 4.4 http와 http2

중요한 요청(로그인, 결재 등) 시 SSL 암호화를 이용하여 GET, POST 요청의 데이터를 암호화하여 내용 유출을 막고자 하면 https 모듈을 사용

- server1-1.js
  - server1.js 의 내용을 https 로 변경하여 적용
  - 암호화 적용은 인증기관이 필요하므로 인증서를 인증기관에서 구입해야 하며 발급받은 인증서 정보를 `https.createServer()` 시에 첫번째 인자에 등록하여야 함

http/2 는 최신 HTTP 프로토콜로 기존의 http/1.1 보다 요청/응답방식이 개선되어 효율적이고 속도가 향상됨

- server1-2.js
  - https 모듈과 거의 유사하게 http2 모듈을 적용하면 HTTP/2를 적용할 수 있으며 server1-1.js 파일에서 `https` 를 `http2`로, `https.createServer()`메서드를 `http2.createSecureServer()` 메서드로 변경하면 됨

## 4.5 cluster

cluster 모듈은 싱글 스레드인 CPU 코어를 모두 사용할수 있게 해주며, 요청을 분산하여 안정성과 성능을 증가. 세션을 공유하지 못하는 등의 단점이 있으나 Redis 등의 서버를 도입하여 해결 가능

- cluster.js
  - 마스터 프로세스와 워크 프로세스의 역할을 구분(`cluster.isMaster`로 구분)
  - 마스터는 워커를 생산(`cluster.fork()` 메서드)
  - `cluster.on('exit', 콜백)` 메서드에서 워커 종료시의 처리 로직 설정
  - 워커 프로세스인 경우 `http.createServer()` 메서드로 서버를 생성하고 대기
  - `setTimeout(() => { process.exit(1); }, 1000)` 메서드로 1초마다 워커를 강제 종료시켜도 마스터가 워커를 계속 생산하므로 서버가 유지됨
  
실무에서는 cluster를 사용하여 직접 클러스터링을 하는 것보다 pm2 등의 모듈을 이용하여 구성하는 경우가 많다. 15.1.5절에서 설명 예정
