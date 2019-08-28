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

위의 코드에서 전역 컨텏드트인 `main()` 함수가 호출 스택으로 들어가고 이 후,  `setTimeout(run, 3000);` 이 호출 스택으로 들어간 뒤, 늦게 들어간 `setTimeout(run, 3000);`이 먼저 수행되면 타이머와 함께 `run()` 함수를 백그라운드로 보내고 스택에서 제거됨. 이 후 `run()` 함수가 백그라운드에서 3초를 기다리는 동안 호출 스택의 `main()` 함수가 수행되어 '시작','끝' 문구가 출력. 3초가 지난 뒤 백그라운드에서는 `run()` 함수를 태스크 큐로 보냄. 이벤트 루프는 정해진 규칙에 따라 태스크큐에 있는 콜백함수들을 호출 스택으로 다시 보내는데, 이에 따라 태스크 큐에 들어간 `run()` 함수가 호출 스택으로 올라가 실행되어 '3초 후 실행' 문구가 출력

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

##### 2.1.6 프로미스

##### 2.1.7 async/await

#### 2.2 프런트엔드 자바스크립트

##### 2.2.1 AJAX

##### 2.2.2 FormData

##### 2.2.3 encodeURIComponent, decodeURIComponent

##### 2.2.4 data attribute와 dataset
