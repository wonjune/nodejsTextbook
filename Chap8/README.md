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
> db.users.find({ $or: [{ age: { $gt: 30 }, married: true }] }, { _id: 0, name: 1, age: 1 });
{ "name" : "zero", "age" : 24 }
{ "name" : "nero", "age" : 32 }
```

정렬을 하고 싶은 경우 `sort` 메서드를 사용. -1 은 내림차순, 1 은 오름차순.

```console
> db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1});
{ "name" : "nero", "age" : 32 }
{ "name" : "zero", "age" : 24 }
```

## 8.6 몽구스 사용하기
