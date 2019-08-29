# node.js 교과서 (길벗, 조현영)

## 개요

 Node.js 교과서 책 공부
 HTTP 서버 실습

## 내용

Chap1, 2 는 node.js 의 기본 내용으로 별도 실습은 없음

### Chap 1. 노드 시작하기

#### 1.1 핵심 개념 이해하기

노드 공식 사이드(<https://nodejs.org/ko/>) 내 정의

> Node.js 는 크롬 V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임입니다. Node.js 는 이벤트 기반, 논블로킹 I/O 모델을 사용해 가볍고 효율적입니다. Node.js의 패키지 생태계인 npm은 세계에서 가장 큰 오픈 소스 라이브러리 생태계이기도 합니다.

##### 1.1.1 서버

서버란 네트워크를 통해 클라이언트에게 정보나 서비스를 제공하는 프로그램 또는 컴퓨터. 기본적으로 클라이언트의 입력(요청)에 대해 결과(응답)을 주는 형태로 운영

##### 1.1.2 자바스크립트 런타임

런타임은 특정 언어로 만든 프로그램들을 실행할 수 있는 환경을 의미하며 node.js 는 자바스크립트 언어로 만든 프로그램을 실행해주는 환경이 됨. 기존에 브라우저에서만 사용되던 자바스크립트는 구글의 V8 엔진을 통해 node.js 를 통해 다양한 환경과 목적을 위해 사용되게 됨

##### 1.1.3 이벤트 기반

이벤트 기반(event-driven)이란 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식. 이벤트 리스너(event listener)에 콜백함수(callback)을 등록하는 형태. 여러 이벤트가 동시에 발생하는 경우에 어떤 순서로 콜백 함수를 호출할지 판단하는 이벤트 루프가 존재하며 이로 인하여 순서대로 배치된 코드도 배치된 순서에 따라 실행되지 않을 수 있다.

```javascript
function run() {
  console.log('3초후 실행');
}
console.log('시작');
setTimeout(run, 3000);
console.log('끝');
```

위 코드의 실행 결과는,

시작  
끝  
3초 후 실행  

Node 런타임이 구동될때 내부 프로세스 로직

- 호출 스택 : 수행된 컨텍스트(함수가 호출됬을때 생성되는 환경)가 쌓이는 곳. 함수 수행이 완료되면 호출 스택에서 지워지며 스택이므로 쌓인 순서와 반대로 실행됨
- 이벤트 루프 : 이벤트 발생 시 호출할 콜백 함수들을 관리하고 호출된 콜백 함수의 실행 순서를 결정하는 역할. 노드가 종료될 때까지 루프를 반복
- 태스크 큐 : 이벤트 발생 후 호출되어야 할 콜백 함수들이 기다리는 공간
- 백그라운드 : 타이머나 I/O 작업 콜백 또는 이벤트 리스너들이 대기하는 공간

위의 코드에서 전역 컨텍스트인 `main()` 함수가 호출 스택으로 들어가고 이 후,  `setTimeout(run, 3000);` 이 호출 스택으로 들어간 뒤, 늦게 들어간 `setTimeout(run, 3000);`이 먼저 수행되면 타이머와 함께 `run()` 함수를 백그라운드로 보내고 스택에서 제거됨. 이 후 `run()` 함수가 백그라운드에서 3초를 기다리는 동안 호출 스택의 `main()` 함수가 수행되어 '시작','끝' 문구가 출력. 3초가 지난 뒤 백그라운드에서는 `run()` 함수를 태스크 큐로 보냄. 이벤트 루프는 정해진 규칙에 따라 태스크큐에 있는 콜백함수들을 호출 스택으로 다시 보내는데, 이에 따라 태스크 큐에 들어간 `run()` 함수가 호출 스택으로 올라가 실행되어 '3초 후 실행' 문구가 출력

백그라운드의 함수는 태스크 큐를 거쳤다가 호출 스택으로 가야 실행되므로 큐에 들어간 함수들이 많은 경우 `setTimeout()` 함수에서 지정한 시간에 정확하게 맞춰 실행되지 않을 수 있음

##### 1.1.4 논블로킹 I/O

논블로킹이란 이전 작업이 완료될때까지 후단 작업이 기다리지 않는다는 의미. 작업이 많아도 순서대로 처리되지 않고 빨리 끝난 순서대로 콜백이 실행되는 것이 그 예. 그러나 node는 싱글스레드이므로 프로세스 외 I/O 등의 작업이 있는 경우에만 시간적 이득이 발생할수 있음

##### 1.1.5 싱글 스레드

스레드는 간단하게 작업을 처리하는 주체를 의미하며 node.js 의 경우는 싱글스레드이므로 하나의 스레드가 작업들을 순차적으로 처리함. 이로 인하여 자칫 특정 작업에 스레드가 물려 블로킹이 발생하면 다른 작업을 처리하지 못하므로 논블로킹 처리가 중요해짐.

멀티 스레드가 싱글 스레드보다 더 효율적으로 보일 수 있으나, 작업이 많을 때 스레드를 늘리고 적을 때 줄여야 하는 비용도 있으므로 비효율적이 될 수 있다. 노드에도 스레드를 여러개 만들어 처리하는 방법이 있음(멀티 프로세스)

#### 1.2 서버로서의 노드

노드를 서버로서 사용할 때의 장단점

- 장점
  - 싱글 스레드로서 멀티 스레드 방식보다 컴퓨터 자원을 적게 소모
  - I/O 작업이 많은 서버로서 적합(채팅/SNS/API서버 등)
  - 프로그래밍이 멀티 스레드 방식보다 상대적으로 쉬움
  - 웹 서버가 내장되어 있어 구현이 쉽고 입문자가 쉽게 접근할 수 있음
  - 언어로 자바스크립트를 사용하므로 프론트엔드와 백엔드를 동일한 언어로 개발/관리되어 생산성이 좋으며 JSON을 이용해 통신을 하므로 개발이 용이
- 단점
  - CPU 코어를 하나밖에 사용하지 못함
  - CPU 작업이 많은 서버로서 부적합(이미지/비디오/대규모 데이터 처리)
  - 스레드가 에러로 인하여 멈추지 않도록 지속적으로 관리 필요
  - 시스템 규모가 커지면 결국 별도 웹서버를 만들어 연결해야 함
  - 자바스크립트 언어 특성 상 다른 언어보다 속도가 느리므로 극단적으로 성능이 중요한 서버에는 부적합

#### 1.3 서버 외의 노드

노드는 기본적으로 자바스크립트 런타임이므로 서버 외의 활용도도 높음

- 웹 프레임워크 : Angular, React, Vue. Meteor 등
- 데스크톱 개발도구 : Electron

#### 1.4 개발 환경 설정하기

노드, 리눅스, npm, VS Code 에 대한 설치 가이드(별도 기술하지 않음)

### Chap 2. 알아두어야 할 자바스크립트

#### 2.1 ES2015+

##### 2.1.1 const, let

- `const` : 상수
- `let` : 변수

```javascript
if (true) {
  var x = 3;
}
console.log(x); // 3

if (true) {
  const y = 3;
}
console.log(y); // Uncaught ReferenceError: y is not defined
```

var 가 const, let 으로 바뀌면서 스코프가 확실하게 정의됨

##### 2.1.2 템플릿 문자열

큰따옴표나 작은따옴표가 아닌 백틱(`)으로 문자열을 감싸면 문자열 안에 변수를 삽입 가능

```javascript
const num1 = 1;
const num2 = 2;
const result = 3;
const string1 = num1 + ' 더하기 ' + num2 + ' 는 \'' + result + '\'';
const string2 = `${num1} 더하기 ${num2} 는 '${result}'`;
console.log(string1); // 1 더하기 2 는 '3'
console.log(string2); // 1 더하기 2 는 '3'
```

##### 2.1.3 객체 리터럴

기존 코드

```javascript
var sayNode = function() {
  console.log('Node');
};
var es = 'ES';
var oldObject = {
  sayJS: function() {
    console.log('JS');
  },
  sayNode: sayNode,
};
oldObject[es + 6] = 'Fantastic';

oldObject.sayNode(); //Node
oldObject.sayJS(); // JS
console.log(oldObject.ES6); // Fantastic
```

ES2015+ 코드

```javascript
const newObject = {
  sayJS() {
    console.log('JS');
  },
  sayNode,
  [es + 6]: 'Fantastic',
};

newObject.sayNode(); //Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

변화점은

- `sayJS()` : 객체의 메서드에 함수를 연결할때 콜론(:)과 `function` 을 사용하지 않아도 됨
- `sayNode` : 속성명과 변수명이 동일한 경우는 하나만 입력하면 가능
- `ES6` : 객체의 속성명을 동적으로 생성 가능. 이전 코드에서는 속성명을 동적으로 생성하는 경우 객체 정의 후, 바깥에서 따로 코딩해야 했으나, ES2015 이후는 내부에서 `[es + 6]` 를 바로 사용하여 생성 가능

##### 2.1.4 화살표 함수

기존의 `function` 키워드에 추가로 화살표 형태로 함수 정의 가능

```javascript
// add1, add2, add3, add4 모두 동일 기능
function add1(x, y) {
  return x + y;
}

const add2 = (x, y) => {
  return x + y;
}

const add3 = (x, y) => x + y;

const add4 = (x, y) => (x + y);

// not1, not2 동일 기능
function not1(x) {
  return !x;
}

const not2 = (x) => !x;
```

화살표 함수에서는 상위 스코프의 `this`를 그대로 사용할 수 있음

```javascript
var relationship1 = {
  name: 'zero',
  friends: ['nero','hero','xero'],
  logFriends: function() {
    var that = this; // relationship1을 that으로 받음
    this.friends.forEach(functions(friend){
      console.log(that.name, friend); // that에서 name('zero')을 꺼냄
    });
  },
};

const relationship2 = {
  name: 'zero',
  friends: ['nero','hero','xero'],
  logFriends() {
    this.friends.forEach(friend => {
      console.log(this.name, friend); // this가 그대로 relationship2 를 가지고 있음
    });
  },
};
```

##### 2.1.5 비구조화 할당

객체와 배열로부터 속성이나 요소를 쉽게 꺼낼 수 있음

- 객체

  ```javascript
  const candyMachine = {
    status: {
      name: 'node',
      count: 5,
    },
    getCandy() {
      this.status.count--;
      return this.status,count;
    }
  };

  const { getCandy, status: { count }} = candyMachine;
  ```

- 배열

  ```javascript
  const array = ['nodejs', {}, 10, true];
  const [node, obj, , bool] = array;
  ```

##### 2.1.6 프로미스

비동기 방식의 프로그래밍 구조에서 콜백지옥(Callback Hell)을 극복하기 위한 방법 중 하나.

1. `Promise` 객체를 생성하고 생성문 내에 수행할 로직을 `resolve`, `reject` 를 매개변수로 갖는 콜백함수형태로 입력. 로직이 정상 수행되면 `resolve(메시지)` 메서드를 실행하고 비정상 수행되면 `reject(메시지)` 메서드를 수행하도록 처리

2. 생성된 `promise` 객체에 `then()` 메서드를 붙여서 이 후에 연결되어 수행될 로직을 입력

3. 추가로 연달아 수행될 로직들은 2번의 `then()` 메서드 뒤에 또다른 `then()` 메서드를 붙여서 연결

4. 비정상 수행되는 경우는 `catch()` 메서드를 붙여서 처리

```javascript
const condition = true;
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve('성공');
  } else {
    reject('실패');
  }
});

promise.then((message) => {
  console.log(message); // 성공(resolve)인 경우 실행
  return new Promise((resolve, reject) => {
    resolve(message);
  })
})
.then((message2) => {
  console.log(message2); // 첫번째 then() 구문에서 resolve 호출 시 수행
  return new Promise((resolve, reject) => {
    resolve(message2);
  })
})
.then((message3) => {
  console.log(message3); // 두번째 then() 구문에서 resolve 호출 시 수행
})
.catch((message) => {
  console.error(message); // 실패(reject)인 경우 실행
});
```

콜백 메서드가 프로미스 방식을 지원하는 경우는 별도 `Promise` 객체 정의 없이 `then()`, `catch()` 메서드를 붙여서 프로미스 방식이 구현됨.

프로미스 방식을 지원하지 않는 메서드의 경우 `util.promisify()` 메서드를 이용하여 프로미스 적용된 새로운 메서드로 변환하여 적용 가능(3.5.6 절 참조)

`Promise.all()` : 내부 인자로 여러 프로미스들을 배열로 넣으면 해당 프로미스들이 모두 resolve 되야 실행되는 함수를 `then()`으로 뒤에 붙일 수 있다.

##### 2.1.7 async/await

노드 7.6 버전, ES2017 부터 지원되는 기능으로 프로미스 적용된 코드를 더 간단하게 구현하게 해줌.

- 기존 Promise 코드

  ```javascript
  function findAndSaveUser(Users) {
    Users.findOne({})
    .then((user) => {
      user.name = 'zero';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ genter: 'm' });
    })
    .then((user) => {
      // 생략
    })
    .catch(err => {
      console.error(err);
    });
  }
  ```

- async/await 적용

  ```javascript
  async function findAndSaveUser(Users) {
    try{
      let user = await Users.findOne({});
      user.name = 'zero';
      user = await user.save();
      user = await Users.findOne({ gender: 'm' });
      //생략
    } catch (error) {
      console.error(error);
    }
  }
  ```

- 적용 방법

  1. 함수선언부 앞에 `async` 를 붙임 (해당 함수는 Promise 가 적용되어 있어야 함)

  2. 내부 프로미스 로직 앞에 `await` 를 붙임

  3. 이제 프로미스가 resolve 될때까지 기다린 후 다음 로직이 수행되게 됨

`Promise.all()` 의 경우 적용 방법

```javascript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise);
  }
})();
```

Chap3/의 fsDelete.js, fsDeleteSync.js, fsDeleteSync2.js, fsDeleteSync3.js 에 Promise 와 async/await 를 적용하여 동일 로직을 구현해본 예제가 있으니 참조

#### 2.2 프런트엔드 자바스크립트

##### 2.2.1 AJAX

AJAX(Asynchronous Javascript And XML)는 비동기적 웹 서비스 개발 기법으로 XML 또는 JSON 을 이용하여 페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술. JQuery나 axios 등의 기술을 사용하지만 자바스크립트에서 기본으로 제공하는 기능도 적용 가능

```HTML
<script>
  var xhr = new XMLHttpRequest();
  var data = {
    name: 'zerocho',
    birth: 1994,
  };
  xhr.onreadystatechange = function() { // 요청에 대한 콜백
    if (xhr.readyState === xhr.DONE) { // 요청이 완료되면
      if (xhr.status === 200 || xhr.status === 201) { // 응답 코드가 200, 201 이면
        console.log(xhr.responseText);
      } else {
        console.error(xhr.responseText);
      }
    }
  };

  xhr.open('POST', 'https://www.zerocho.com/api/post/json'); // 메서드와 주소 설정
  xhr.setRequestHeader('Content-Type', 'application/json'); // 콘텐트 타입을 json 으로 설정
  xhr.send(JSON.stringify(data)); // 객체를 JSON 형식으로 만들고 동봉하여 요청 전송
</script>
```

##### 2.2.2 FormData

HTML form 태그의 데이터를 동적으로 제어하는 기능. 주로 AJAX와 함께 사용

```HTML
<script>
  var formData = new FormData();
  formData.append('name', 'zerocho');
  formData.append('item', 'orange');
  formData.append('item', 'melon');
  formData.has('itme'); // true
  formData.has('money'); // false
  formData.get('item'); // orange
  formData.getAll('item'); // ['orange', 'melon']
  formData.append('test', ['hi', 'zero']);
  formData.get('test'); // hi. zero
  formData.delete('test');
  formData.get('test'); // null
  formData.set('item', 'apple');
  formData.getAll('item'); //['apple'];

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 || xhr.status === 201) {
        console.log(xhr.responseText);
      } else {
        console.error(xhr.responseText);
      }
    }
  };
  xhr.open('POST', 'https://www.zerocho.com/api/post/formdata');
  xhr.send(formData);
</script>
```

##### 2.2.3 encodeURIComponent, decodeURIComponent

AJAX 요청을 보낼때 주소에 한글이 있는 경우 window 객체의 메서드인 `encodeURIComponent()` 메서드를 사용하여 처리

```javascript
// AJAX 구문(생략)
xhr.open('GET', 'https://www.zerocho.com/api/search/' + encodeURIComponent('노드'));
xhr.send();
```

이렇게 보내면 주소내의 '노드'라는 한글 부분이 '%EB%85%B8%EB%93%9C' 라는 문자열로 치환되어 보내지는데 받는쪽에서는 `decodeURIComponent()` 메서드로 다시 한글로 변환

```javascript
decodeURIComponent('%EB%85%B8%EB%93%9C'); // 노드
```

##### 2.2.4 data attribute와 dataset

HTML5에서 서버에서 프론트엔드로 내려보낸 데이터를 저장하는 방법으로 data attribute를 사용.

```HTML
<ul>
  <li data-id="1" data-user-job="programmer">Zero</li>
  <li data-id="2" data-user-job="designer">Nero</li>
  <li data-id="3" data-user-job="programmer">Hero</li>
  <li data-id="4" data-user-job="ceo">Kero</li>
</ul>
<script>
  console.log(document.querySelector('li').dataset); // {id: '1', userJob: 'programmer'}
</script>
```

HTML 태그의 속성으로 `data-` 로 시작하는 형태의 attribute 를 지정하며, 이들은 `dataset` 속성을 이용하여 자바스크립트로 쉽게 접근할 수 있다. 자바스크립트 객체로 변환시 `data` 접두어는 빠지고 camel code형식으로 변환되어 `data-user-job` 은 `userJob` 으로 이름이 변경된다.

반대로 `dataset` 에 값을 넣으면 HTML 태그에 반영된다.
