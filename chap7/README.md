# Chap 7. MySQL

## 7.1 데이터베이스란

데이터베이스 : 관련성을 가지며 중복이 없는 데이터의 집합

DBMS : 데이터베이스를 관리하는 시스템, 여러 종류가 있으나 이번장은 RDBMS(관계형 DBMS)에 대한 내용이며 다음 Chapter에서 NoSQL 시스템을 다룰 예정

## 7.2 MySQL 설치하기

운영체제별 MySQL 설치 방법. 생략

## 7.3 워크벤치 설치하기

운영체제별 워크벤치(데이터 조회 및 관리 프로그램) 설치 방법. 생략

## 7.4 데이터베이스 및 테이블 생성하기

MySQL에서 데이터베이스, 테이블 생성 SQL 문법과 기본 워크벤치 사용법. 생략

## 7.5 CRUD 작업하기

CRUD 란, Create, Read, Update, Delete를 의미하며 데이터베이스에서 가장 많이 사용하는 네가지 작업을 의미

MySQL 워크벤치에서 CRUD 를 수행하는 방법과 SQL 문법 설명. 생략

## 7.6 시퀄라이즈 사용하기

노드에서 MySQL 작업을 쉽게 할수 있도록 도와주는 라이브러리가 바로 Sequelize. ORM(Object-relation Mapping) 도구로 분류되며 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑하며 자바스크립트 문법으로 SQL을 수행하고 DB를 다룰 수 있게 해줌.

- 설치
  - Express-generator 로 새로운 Node.js Express 서버를 생성

  ```bash
  express learn-sequelize --view=pug
  cd learn-sequelize
  npm i
  ```

  - 시퀄라이즈와 mysql2 패키지를 설치

  ```bash
  npm i sequelize mysql2
  ```

  - 시퀄라이즈 커맨드를 사용하기 위한 sequelize-cli 를 전역설치

  ```bash
  npm i -g sequelize-cli
  ```

- 환경 구성
  - sequelize 구성

  ```bash
  sequelize init
  ```

  - 프로젝트 폴더 내에 config, models, migrations, seeders 폴더와 내부파일이 생성. models/index.js 파일을 아래와 같이 수정

  ```javascript
  const path = require('path');
  const Sequelize = require('sequelize');

  const env = process.env.NODE_ENV || 'development';
  const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
  const db = {};

  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  module.exports = db;
  ```

### 7.6.1 MySQL 연결하기

app.js 파일에 아래 구문을 추가하여 Sequelize 연동

```javascript
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var sequelize = require('./models').sequelize;  //추가부분

var app = express();
sequelize.sync();     //추가부분
```

`require('./models')` 는 `require('./models/index')` 와 동일(폴더내 index.js 파일은 require 시 생략 가능). 앞으로 models/index.js 파일을 통해서 다른 모델 파일로 접근하게 되며, 이 파일 안에 각 모델을 require하고 모델간의 관계를 정의. `sync()` 메서드를 통해서 서버 실행시 자동으로 MySQL 연동

### 7.6.2 모델 정의하기

MySQL 내 정의된 테이블은 시퀄라이즈에 생성된 모델과 대응시킬 수 있으며, 시퀄라이즈에 의해 테이블과 모델이 연결

MySQL 내 정의된 USERS, COMMENTS 테이블을 models/user.js, models/comment.js 파일과 연동

- models/user.js 파일
  - id 칼럼은 생략 가능(시퀄라이즈에서 기본키는 자동 연결)
  - `sequelize.define` 메서드로 테이블명과 칼럼별 스팩을 정의
  - MySQL과 테이블/칼럼의 내용이 일치해야 대응

- models/comment.js 파일
  - USERS 테이블과 연동된 commenter 칼럼을 따로 정의하지 않음. 정의해줘도 되지만 시퀄라이즈 내에서 테이블 관계 정의 시 따로 입력하므로 생략 가능

- 자료형 대응 방법(MySQL 자료형 : sequelize 모델 자료형), 필드 정의 시 `type` 속성으로 정의
  - VARCHAR : `DataTypes.STRING`
  - INT : `DataTypes.INTEGER` (Unsigned 옵션이 적용될 경우 `DataTypes.INTEGER.UNSIGNED`, ZeroFill 옵션이 적용된 경우 `DataTypes.INTEGER.UNSIGNED.ZEROFILL`)
  - TINYINT : `DataTypes.BOOLEAN`
  - DATETIME : `DataTypes.DATE`
  - NOT NULL 옵션 : `allowNull` 속성을 `false`로 설정
  - UNIQUE 옵션 : `unique` 속성을 `true`로 설정

- 테이블 옵션 : `define` 메서드의 세 번째 인자로 추가됨
  - `timestamps` : `true` 인 경우 자동으로 createdAt, updatedAt 칼럼을 추가하고 로우가 생성 또는 수정될 때 해당 시간을 자동으로 매핑해서 SQL을 실행. 대응되는 MySQL 테이블에 createdAt, updatedAt 칼럼이 정의되어 있어야 하며 칼럼명이 다르거나 유저가 컨트롤 하고 싶을 때는 `false` 로 설정 (실무에서는 주로 `true`로 사용)
  - `paranoid` : `timestamps` 가 `true` 여야만 `true` 로 설정 가능. deletedAt 이라는 칼럼이 추가되고 데이터 삭제시 MySQL 내에서 실제로 삭제하지 않고 여기에 시간정보만 입력. 로우 조회/수정시 deletedAt 칼럼에 값이 있는 데이터는 사용하지 않음
  - `underscored` : timestamp 칼럼과 시퀄라이즈에서 자동 생성하는 관계 칼럼들의 이름을 스네이크케이스로 생성(created_at, updated_at, deleted_at 등)
  - `tableName` : 시퀄라이즈는 보통 `define` 메서드의 첫 번째 인자를 복수형으로 만들어서 MySQL 테이블명으로 사용하는데, `tableName` 옵션에 값을 주면 해당 값으로 테이블 이름을 생성

models/index.js 파일에 아래 구문을 추가하여 생성한 모델 파일들을 연결. 앞으로는 db 객체를 require 하여 user, comment 모델에 접근

```javascript
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//추가부분 시작
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./commet')(sequelize, Sequelize);
//추가부분 끝

module.exports = db;
```

DB 커넥션 정보를 config/config.json 파일에 설정

```json
//추가부분 시작
{
    "development": {
        "username": "root",                //DB 계정
        "password" : "[root 비밀번호]",     //DB 비밀번호
        "database" : "nodejs",             //DB 내 설정한 database 이름
        "host" : "127.0.0.1",              //DB 서버 주소
        "dialect" : "mysql",
        "operatorsAliases" : false         // 보안에 취햑한 연산자를 사용할지 여부
    }
}
//추가부분 끝
```

위 설정은 `process.env.NODE_ENV` 가 `development` 인 경우에 해당되므로 배포시에는 `production`으로 설정 변경하고 위의 설정도 "production" 항목에 배포용 DB 설정을 입력

### 7.6.3 관계 정의하기

실제 환경에서의 객체의 관계와 마찬가지로 DB 테이블 간에의 관계를 정의할 수 있으며 이는 시퀄라이즈 내에도 정의할 수 있다.

#### 7.6.3.1 1:N

사용자 한 명은 여러 개의 댓글을 작성할 수 있고, 하나의 댓글은 한명의 사용자에게만 종속되는데 이러한 관계를 1:N 관계로 정의

models/index.js 파일 내에 이러한 관계를 정의

```javascript
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

//추가부분 시작
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
//추가부분 끝

module.exports = db;
```

이제 `npm start` 명령으로 서버를 구동할 때마다 각 모델에 정의한 대로 자동으로 MySQL 에 테이블을 생성하는 작업이 수행됨. 생성 쿼리를 보면 `CREATE TABLE IF NOT EXISTS ...` 식으로 수행되므로 이미 테이블이 있는 경우는 생성구문 수행 안함

#### 7.6.3.2 1:1

사용자 한 명당 사용자 정보도 하나만 존재하므로 이런 경우는 1:1 관계로 정의한다. 사용자 모델(User)와 사용자정보 모델(Info)이 있을 경우, models/index.js 파일에 아래와 같이 정의

```javascript
db.User = require('./user')(sequelize, Sequelize);
db.Info = require('./info')(sequelize, Sequelize);

//추가부분 시작
db.User.hasOne(db.Info, { foreignKey: 'user_id', sourceKey: 'id' });
db.Info.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
//추가부분 끝

module.exports = db;
```

1:1 관계이므로 `hasOne()`과 `belongsTo()` 를 반대로 정의도 가능

#### 7.6.3.3 N:M

N:M 관계를 가지는 게시글 모델(Post)과 해시태그 모델(Hashtag)이 있을 때 models/index.js 파일에 아래와 같이 정의

```javascript
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

//추가부분 시작
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//추가부분 끝

module.exports = db;
```

1:1, 1:N 관계와는 달리 N:M 관계는 각 모델의 데이터간의 매칭정보(양쪽 데이터의 Key 간 Join 정보)를 별도로 가지고 있는 데이블과 모델이 필요하며 `through` 속성에 그 모델의 이름이 들어감.

중간에 연결 모델이 있기 때문에 데이터 조회 시에도 여러 단계를 거쳐야하는데 시퀄라이즈에서 이를 지원하는 메서드가 존재. 예를 들어 라우터에서 '노드'라는 해시태그를 가진 게시물 정보를 조회하는 경우 아래와 같이 사용

```javascript
// async/await 방식
async (req, res, next) => {
    //해시태그 테이블에서 title = '노드' 인 데이터 발췌
    const tag = await Hashtag.find({ where: { title: '노드' } });
    //발췌한 해시태그 데이터에 매칭되는 게시물 발췌(get + 모델이름의 복수형 형태의 메서드)
    const posts = await tag.getPosts();
}

//또는 아래와 같이 Promise 방식도 가능
Hashtag.find({ where: { title: '노드' } })
.then(tag => tag.getPosts(3))   //get 메서드에 인자를 주면 해당 테이블의 키 조건이 됨 (이 경우, 게시물id가 3인 조건)
.then(posts => console.log(posts));
```

### 7.6.4 쿼리 알아보기

시퀄라이즈의 방식으로 자바스크립트를 통해 SQL 문 생성하는 방법

- 데이터 로우 생성
  - SQL
  
  ```sql
  INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
  ```

  - 시퀄라이즈 쿼리

  ```javascript
  const { User } = require('../models'); //USERS 테이블과 연동된 User 모델 사용
  User.create({
      name: 'zero',
      age: 24,
      married: false,
      comment: '자기소개1',
  });
  ```

  - 데이터 입력시 MySQL 의 자료형이 아닌 대응하는 시퀄라이즈의 자료형을 사용해야 함

- 데이터 로우 조회
  - SQL

  ```sql
  SELECT * FROM nodejs.users;   /* 1 */
  SELECT * FROM nodejs.users LIMIT 1; /* 2 */
  SELECT name, married FROM nodejs.users; /* 3 */
  SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30; /* 4 */
  SELECT id, name FROM nodejs.users WHERE married = 0 OR age > 30; /* 5 */
  SELECT id, name FROM nodejs.users ORDER BY age DESC; /* 6 */
  SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1; /* 7 */
  ```

  - 시퀄라이즈 쿼리

  ```javascript
  User.findAll({}); /* 1 */
  User.find({}); /* 2 */
  User.findAll({
      attributes: ['name', 'married'],
  }); /* 3 */
  User.findAll({
      attributes: ['name', 'married'],
      where: {
          married: 1,
          age: { [Op.gt]: 30}
      },
  }); /* 4 */
  User.findAll({
      attributes: ['id', 'name'],
      where: {
          [Op.or]: [{ married: 0 }, { age: { [Op.gt]: 30 } }]
      },
  }); /* 5 */
  User.findAll({
      attributes: ['id', 'name'],
      order: [['age', 'DESC']],
  }); /* 6 */
  User.findAll({
      attributes: ['id', 'name'],
      order: [['age', 'DESC']],
      limit: 1,
      offset: 1,
  }); /* 7 */
  ```

  - 1 : 여러 데이터 조회는 `findAll` 사용
  - 2 : 1개 로우만 조회하는 경우 `find` 사용
  - 3 : 특정 칼럼만 SELECT 하는 경우 `attribute` 속성에 배열로 나열
  - 4 : WHERE 조건은 `where` 속성의 객체 내에 칼럼명을 키로 하여 추가. 연산자의 경우 `Sequelize` 모듈 내부의 `Op` 객체를 불러와 사용. `{ [Op.gt]: 30 }` 과 같은 형태는 ES2015 문법(2.1.3 장 참조)
  - 주요 연산자 : `Op.gt`(초과), `Op.gte`(이상), `Op.lt`(미만), `Op.lte`(이하), `Op.ne`(같지 않음), `Op.or`(또는), `Op.in`(배열 요소 중 하나), `Op.notIn`(배열 요소와 모두 다름)
  - 5 : `Op.or` 연산의 경우 연관된 조건들을 배열로 나열
  - 6: ORDER BY 의 경우 `order` 속성에 배열로 나열 `DESC` 는 내림차순, `ASC`는 오름차순
  - 7 : 조회 로우의 수를 제한 하는 경우 `limit` 속성 사용. LIMIT 1 인 경우에는 앞에서 사용한 `find` 대신 `limit` 사용도 가능. OFFSET의 경우 `offset` 속성 사용

- 데이터 로우 수정
  - SQL
  
  ```sql
  UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
  ```

  - 시퀄라이즈 쿼리

  ```javascript
  User.update({
      comment: '바꿀 내용',
  }, {
      where: { id: 2 },
  });
  ```

- 데이터 로우 삭제
  - SQL

  ```sql
  DELETE FROM nodejs.users WHERE id = 2;
  ```

  - 시퀄라이즈 쿼리

  ```javascript
  User.destroy({
      where: { id: 2 },
  });
  ```

### 7.6.5 쿼리 수행하기

지금까지 생성한 learn-sequelize 내 express 서버와 앞절에서 배운 CRUD 로직, USERS, COMMENTS 테이블들을 이용하여 간단한 유저 등록/조회 및 유저별 댓글 조회/입력/수정/삭제 기능이 담긴 웹페이지를 만들어보자.

- views/sequelize.pug : 유저와 댓글을 리스트로 조회하고 입력칸과 수정,삭제 버튼을 담은 pug 생성

- public/sequelize.js : views/sequelize.pug 에 정의된 기능들이 수행될 클라이언트 자바스크립트 정의. 각 로직은 AJAX 통신으로 서버와 소통

- app.js : user 관련로직(유저목록 조회, 유저 등록)을 처리할 라우터와 comment 관련로직(유저별 댓글조회, 댓글 등록, 댓글 수정, 댓글 삭제)을 처리할 라우터를 등록

- routes/index.js : 유저 전체목록 조회 기능 추가

- routes/users.js : 유저 조회, 유저 등록 기능 추가

- routes/comments.js : 유저별 댓글 조회, 댓글 등록, 댓글 수정, 댓글 삭제 기능 추가
