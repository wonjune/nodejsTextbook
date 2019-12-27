# Chap 8. 몽고디비

## 8.1 NoSQL vs SQL

- NoSQL

Not Only SQL의 약자. 고정된 테이블이 없으며 테이블에 상응하는 컬렉션이라는 개념이 있으나 컬럼을 따로 정의하지 않음. SQL의 로우에 해당하는 개념인 다큐먼트는 어떤 형식으로도 정의할 수 있음

JOIN 도 지원하지 않고 트랜젝션도 지원하지 않으므로 데이터 관리에 주의가 필요함

반면 확장성과 가용성이 좋아서 데이터를 형식에 구애받지 않고 빠르게 저장할 수 있으며 여러 서버에 분산하여 관리하기도 쉬움. SQL과는 용도가 어느정도 분리가 될 수 있으므로 양쪽 DB를 같이 사용하기도 함(정합성과 일관성이 중요한 데이터는 SQL에, 빅데이터/메시징/세션 등의 비형식적인 대량 데이터의 경우 NoSQL에 저장)

|SQL(MySQL)|NoSQL(몽고디비)|
|----|----|
|규칙에 맞는 데이터 입력|자유로운 데이터 입력|
|테이블 간 JOIN 지원|컬렉션 간 JOIN 미지원|
|트랜젝션 지원|트랜젝션 미지원|
|안정성, 일관성|확장성, 가용성|
|용어(테이블, 로우, 컬럼)|용어(컬렉션, 다큐먼트, 필드)|

## 8.2 몽고디비 설치하기

운영체제별 몽고디비 설치방법, 생략

## 8.3 컴퍼스 설치하기

컴퍼스 : 몽고디비 관리 도구. 몽고디비의 데이터를 시각적으로 관리할 수 있게 해줌

운영체제별 설치방법 설명, 생략

## 8.4 데이터베이스 및 컬렉션 생성하기

몽고디비 프롬프트 접속 후

- DB 생성

```console
> use nodejs
switched to db nodejs
```

- DB 목록 확인

```console
> show dbs
admin 0.000GB
local 0.000GB
```

데이터가 한개 이상 들어가 있는 DB만 조회됨

- 현재 사용중인 DB 확인

```console
> db
nodejs
```

- 컬렉션 생성

컬렉션은 별도로 생성할 필요가 없음(NoSQL이므로) 다큐먼트를 넣는 순간 자동으로 생성. 하지만 컬렉션을 직접 생성할 수 있음

```console
> db.createCollection('users')
{ "ok" : 1 }
> db.createCollection('comments')
{ "ok" : 1 }
```

- 컬렉션 목록 조회

```console
> show collections
comments
users
```

## 8.5 CRUD 작업하기

### 8.5.1 Create(생성)

- 자료형

  기본적으로 자바스크립트 자료형을 따르며 추가적인 자료형이 존재. Date나 정규표현식 같은 자바스크립트 객체를 자료형으로 사용

  추가적은 자료형은 Binary Data, ObjectId, Int, Long, Decimal, Timestamp, JavaScript 등. 보통은 ObjectId, Binary Data, Timestamp 외에는 잘 사용하지 않음. ObjectId는 교유한 값을 가지며 기본키 용도로 쓰임

생성은 `db.컬렉션명.save(다큐먼트)` 명령으로 생성

```console
$ mongo
> use nodejs
switched to db nodejs
> db.users.save({ name: 'zero', age: 24, married: false, comment: '안녕하세요. 간단히 몽고디비 사용 방법에 대해서 알아봅시다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1 })
> db.users.save({ name: 'nero', age: 32, married: true, comment: '안녕하세요. zero 친구 nero 입니다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1 })
```

조회는 아래와 같이 수행

```console
> db.users.find({ name: 'zero' }, { _id: 1 })
{ "_id" : ObjectId("5a1687007af03c3700826f70") }
```

comments 컬렉션에 users의 ObjectId 를 가지고 코멘트 다큐먼트를 입력

```console
> db.comments.save({ commenter: OjbectId('5a1687007af03c3700826f70'), comment: '안녕하세요. zero의 댓글입니다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1 })
```

### 8.5.2 Read(조회)

```console
$ mongo
> db.users.find({});
{ "_id" : ObjectId('5a1687007af03c3700826f70'), "name" : "zero", "age" : 24, "married" : false, "comment" : "안녕하세요. 간단히 몽고디비 사용 방법을 알아봅시다.", "createdAt" : ISODate("2017-11-24T00:00:00Z") }
{ "_id" : ObjectId('5a1687007af03c3700826f71'), "name" : "nero", "age" : 32, "married" : true, "comment" : "안녕하세요. zero 친구 nero 입니다.", "createdAt" : ISODate("2017-11-24T01:00:00Z") }
> db.comments.find({})
{ "_id" : ObjectId('5a1687007af03c3700826f73'), "commenter" : ObjectId('5a1687007af03c3700826f70'), "comment" : "안녕하세요. zero의 댓글입니다.", "createdAt" : ISODate("2017-11-24T00:00:00Z") }
```

`find({})`는 컬렉션 내의 모든 다큐먼트를 조회하라는 의미

특정필드만 조회하고 싶은 경우

```console
$ mongo
>db.users.find({}, { _id: 0, name: 1, married: 1 });
{"name" : "zero", "married" : false }
{"name" : "nero", "married" : true }
```

1 또는 true 로만 입력된 필드만 조회하며 _id 는 기본적으로 가져오게 되어 있으므로 0 또는 false 를 줘서 안나오게 해야 함

조건을 넣고 싶은 경우 첫번째 인자에 입력

```console
>db.users.find({ age: { $gt: 30 }, marreid: true}, { _id: 0, name: 1, age: 1 });
{ "name" : "nero", "age" : 32 }
```

- 연산자
  - `$gt` : 초과
  - `$gte` : 이상
  - `$lt` : 미만
  - `$lte` : 이하
  - `$ne` : 같지 않음
  - `$or` : 또는
  - `$in` : 배열 요소 중 하나

`$or`을 사용하는 예제

```console
> db.users.find({ $or: [{ age: { $gt: 30 } }, { married: false }] }, { _id: 0, name: 1, age: 1 });
{ "name" : "zero", "age" : 24 }
{ "name" : "nero", "age" : 32 }
```

정렬을 하고 싶은 경우 `sort` 메서드를 사용. -1 은 내림차순, 1 은 오름차순.

```console
> db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1});
{ "name" : "nero", "age" : 32 }
{ "name" : "zero", "age" : 24 }
```

조회되는 다큐먼트 개수를 정하는 경우 `limit` 메서드 사용

```console
> db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1 }).limit(1);
{ "name" : "nero", "age" : 32 }
```

개수를 설정하면서 몇 개를 건너뛸지 설정 가능. `skip` 메서드 사용

```console
> db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1 }).limit(1).skip(1);
{ "name" : "zero", "age" : 24 }
```

### 8.5.3 Update(수정)

```console
$ mongo
> db.users.update({ name: 'nero' }, { $set: { comment: '안녕하세요. 이 필드를 바꿔보겠습니다!' } });
WriteResult({ "nMatched" : 1, "nInserted" : 0, "nModified" : 1 })
```

`$set` 연산자는 수정 대상 필드를 지정하는 역할을 하며, 만일 사용하지 않을 경우 다큐먼트가 통째로 두번째 인자로 주어진 객체로 수정됨

### 8.5.4 Delete(삭제)

```console
$ mongo
> db.users.remove({ name: 'nero' });
WriteResult({ 'nRemoved': 1 })
```

## 8.6 몽구스 사용하기

MySQL의 시퀄라이즈에 대응되는 ODM(Object Document Mapping)이며, 몽고DB 자체가 자바스크립트를 사용하므로 굳이 사용하지 않아도 되지만 몽구스는 스키마를 정의해서 사용할 수 있고, `populate` 라는 메서드로 JOIN 기능을 보완하는 역할을 수행하므로 몽고DB를 편하게 사용할 수 있게 해줌. 몽고DB에 데이터를 입력/수정/삭제하기 전에 노드 서버단에서 데이터를 한 번 가공해주는 역할. 또한 ES2015 프로미스 문법과 가독성 높은 쿼리 빌더를 지원

Express-generator로 learn-mongoose 프로젝트를 생성

```console
express learn-mongoose --view=pug
```

learn-mongoose 폴더에서 npm 패키지를 설지

```console
cd learn-mongoose && npm i
```

몽구스를 설치

```console
npm i mongoose
```

### 8.6.1 몽고디비 연결하기

몽고디비는 주소를 사용해서 연결하며 주소의 형식은 `mongodb://[username:password@]host[:port][database][?options]`. 예를 들어 host는 로컬이고 port는 27017, 계정이 있는 database가 admin이면 `mongodb://이름:비밀번호@localhost:27017/admin`

schemas 폴더를 루트 디렉토리에 생성하고 내부에 index.js 파일을 생성한 후 아래 내용을 입력

```javascript
const mongoose = require('mongoose');

module.exports = () => {
    //몽구스와 몽고디비를 연결, 실제 사용하는 데이터베이스는 nodejs 이므로 별도로 지정
    const connect = () => {

        //개발환경이 아닐때 쿼리내용을 콘솔에 표시
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

        mongoose.connect('mongodb://username:password@localhost:27017/admin', {
            dbName: 'nodejs',
        }, (error) => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        });
    };

    connect();

    //에러등을 처리하기 위한 이벤트리스너 등록
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.error('몽고디비 연결이 끊겼습니다. 재연결을 시도합니다.');
        connect();
    });

    //이후 추가될 User 스키마와 Comment 스키마를 연결
    require('./user');
    require('./comment');
};
```

schemas/index.js 를 app.js 와 연결하여 노드 실행 시 `mongoose.connect` 부분이 실행되도록 app.js에 아래 코드를 추가

```javascript
...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var connect = require('./schemas'); //추가

var app = express();
connect();  //추가
...
```

### 8.6.2 스키마 정의하기

schemas 폴더에 user.js 파일 생성

```javascript
const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    married: {
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//몽구스의 model 메서드로 스키마와 몽고디비 컬렉션을 연결
//첫번째 인자의 앞글자를 소문자로 바꾸고 뒤에 s 를 붙여 복수형으로 컬렉션을 생성함. 직접 만들길 원하는 경우 세번째 인자로 컬렉션명을 지정
module.exports = mongoose.model('User', userSchema);
```

스키마의 자료형과 몽고DB의 자료형이 살짝 다름(스키마는 String, Number, Date, Buffer, Mixed, ObjectId, Array)

Schemas 폴더에 comment.js 파일 생성

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User',    //User 스키마의 사용자 ObjectId가 입력된다는 뜻. JOIN 시 필요
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);
```

### 8.6.3 쿼리 수행하기

views 폴더 안에 mongoose.pug 파일을 생성. 파일 내용이 기므로 코드 참조.

publics 폴더 안에 mongoose.js 파일을 생성. 파일 내용이 기므로 코드 참조.

routes 폴더 안에 index.js 파일에 아래 내용 추가. GET 으로 /로 접속 했을 때, User.find({}) 메서드(몽고디비의 `db.users.find({})` 와 동일)로 모든 사용자를 조회한 후, mongoose.pug 를 렌더링할 때 users 변수로 넘기는 로직이 추가됨

```javascript
var express = require('express');
var User = require('../schemas/user');  // 추가

var router = express.Router();

router.get('/', function (req, res, next) {
    //추가 시작
    User.find({})
    .then((users) => {
        res.render('mongoose', { users });
    })
    .catch((err) => {
        console.error(err);
        next(err);
    });
    //추가 끝
});

module.exports = router;
```

추가된 문법을 async/await 문법으로 변경하면 아래와 같이 표현할 수 있다

```javascript
router.get('/', async (req, res, next) => {
    try{
        const users = await User.find({});
        res.render('mongoose', { users });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
```

routes 폴더에 user.js 파일에 아래 내용을 추가. GET 으로 /users 로 요청했을 때는 사용자 리스트를 조회하여 JSON 형식으로 반환, POST 로 /users 요청했을 때는 입력할 데이터를 user 객체로 생성한 후 `save`메서드로 저장.(user 객체와 스키마가 부합하지 않는 경우 몽구스에서 에러 처리)

```javascript
var express = require('express');
var User = require('../schemas/user'); //추가

var router = express.Router();

//추가 시작
//user 조회
router.get('/', function (req, res, next) {
    User.find({})
    .then((users) => {
        res.json(users);
    })
    .catch({err} => {
        console.error(err);
        next(err);
    });
});

//user 등록
router.post('/', function (req, res, next) {
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        married: req. body.married,
    });

    user.save()
    .then((result) => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch((err) => {
        console.error(err);
        next(err);
    });
});;
//추가 끝

module.exports = router;
```

routes/comments.js 파일을 추가(내용은 코드파일 참조). 댓글에 대한 CRUD를 처리

- GET /comments/:id 호출 : `find` 메서드에 `populate` 메서드를 붙여 관련있는 컬렉현의 다큐먼트를 불러온다. Comment 스키마의 commenter 필드의 ref 가 User로 되어 있으므로 알아서 users 컬렉션에서 사용자 다큐먼트를 찾아와 합치고 commenter 필드가 사용자 다큐먼트로 치환.
  
  ```javascript
  ...
  router.get('/:id', function (req, res, next) {
      Comment.find({ commenter: req.params.id }).populate('commenter')
      .then((comments) => {
          console.log(comments);
          res.json(comments);
      })
      ...
  });
  ...
  ```

- POST /comments 호출 : 댓글 다큐먼트를 등록한다. `save`한 뒤에 `populate` 메서드를 수행해서 User 스키마와 합체. path 옵션은 어떤 필드를 합칠지 설정하는 값

  ```javascript
  ...
  comment.save()
  .then((result) => {
      return Comment.populate(result, { path: 'commenter' });
  })
  ...
  ```

- PATCH /comments/:id 호출 : 댓글 다큐먼트를 수정한다. `update`메서드를 사용하며 첫번째 인자에 조건, 두번째 인자에 수정할 내용을 넣는데 몽고디비와는 다르게 $set 연산자를 사용하지 않아도 기입한 필드만 수정하므로 안전함

  ```javascript
  router.patch('/:id', function (req, res, next) {
      Comment.update({ _id: req.params.id }, { comment: req.body.comment })
      .then((result) => {
          res.json(result);
      })
      ...
  });
  ...
  ```

- DELETE /comments/:id 호출 : 댓글 다큐먼트를 삭제한다. `remove`메서드를 사용하며 첫번째 인자로 조건이 들어감
  
  ```javascript
  router.delete('/:id', function (req, res, next) {
      Comment.remove({ _id: req.params.id })
      .then((result) => {
          res.json(result);
      })
      ...
  });
  ...
  ```

마지막으로 app.js 파일을 수정하여 라우터를 서버에 연결하고 express.static의 순서도 조정

```javascript
...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments'); // 추가
...
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter); // 추가
...
```

몽고디비를 실행한 후 서버를 구동

```console
mongod --auth
npm start
```
