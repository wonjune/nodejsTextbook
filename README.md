# node.js 교과서 (길벗, 조현영)

## 개요

 Node.js 교과서 책 공부

## 내용

 Chap1, 2 는 node.js 의 기본 내용

### Chap3. 노드 기능 알아보기

#### 3.1 REPL 사용하기

스크립트 언어의 특성상 코드 라인단위로 즉시 수행이 가능하며 브라우저 개발자툴의 콘솔탭에서 사용하는 형태임. 노드에서도 커맨드 창에 node 명령을 통해서 REPL(Read Eval Print Loop) 수행

#### 3.2 js파일 실행하기

REPL이 아닌 js 파일을 생성하여 수행

```bash
node [파일명]
```

- helloWorld.js
  - `console.log()` 를 이용한 출력

#### 3.3 모듈로 만들기

- var.mjs, func.mjs, index.mjs
  - 모듈화 기초
  - ES2015 스타일 적용
  - mjs 확장자 사용
  - 실행시 아래 명령어 사용

    ```bash
      node --experimental-modules [파일명]
    ```

#### 3.4 노드 내장 객체 알아보기

##### 3.4.1 global

전역객체(브라우저 상에서는 window 객체). 모든 파일에서 접근이 가능하고 내부 요소들을 global 문구를 생략하고 사용가능(require(), console 등)

- globalA.js, globalB.js
  - global 객체의 message 함수를 이용하여 다른 모듈간 메시지 공유
  - 프로그램이 복잡해질 경우 유지보수가 어려워지므로 global.message 는 사용하지 않는 것이 좋음
  - 파일간 메시지 공유는 모듈화를 수행후 명시적으로 불러와서 사용하도록 권장

##### 3.4.2 console

global 객체 소속이며 주로 커맨드 창에 메시지나 값등을 출력함으로서 로깅/디버깅/수행속도 측정 등의 용도로 사용

- console.js
  - global 객체 내 console 객체 활용_
  - `console.time(레이블)`, `console.timeEnd(레이블)` : 두 메서드 사이 로직의 수행시간을 측정
  - `console.log(내용)` : 내용을 콘솔에 표시 내용부분을 쉼표로 연결하면 붙여서 출력
  - `console.error(내용)` : 내용을 에러로서 콘솔에 표시
  - `console.dir(객체, 옵션)` : 객체를 콘솔에 표시. 옵션의 colors를 true 로 주면 색상으로 구분해줌. depth는 객체 내부를 몇단계까지 보여주는지 설정(default : 2)
  - `console.trace(레이블)` : 에러의 발생위치 추적용 해당 메서드가 수행된 코드의 위치를 같이 표시함

##### 3.4.3 타이머

global 객체 내에 타이머 기능 관련된 함수들이 존재하며 백그라운드로 넘긴 후 지정된 로직에 따라 태스크 큐로 콜백함수를 로딩

- timer.js
  - global 객체 내 타이머 함수
  - `setTimeout(콜백, 밀리초)` : 지정시간 이후 콜백 수행
  - `setInterval(콜백, 밀리초)` : 지정시간 마다 콜백 반복
  - `setImmediate(콜백)` : 콜백을 즉시 실행
  - `clearTimeout(아이디)` : 지정된 setTimeout 취소
  - `clearInterval(아이디)` : 지정된 setInterval 취소
  - `clearImmediate(아이디)` : 지정된 setImmediate 취소

setImmediate(콜백)와 setTimeout(콜백, 0)은 바로 실행한다는 점에서 동일하지만 동시에 실행시 setImmediate() 가 먼저 수행되나 언제나 그런 것은 아님. 정확한 타이밍 관리를 위해서 setTimeout(콜백, 0) 는 사용하지 않는 것이 좋음

##### 3.4.4 __filename, __dirname

노드 내에서 현재 파일의 이름이나 경로 필요시 사용. 경로가 문자열 형태이고 시스템에 따라 경로 표기방식도 다르므로 보통 path 모듈을 함께 사용

- filename.js
  - `___filename` : 현재 파일의 경로와 이름
  - `___dirname` : 현재 파일이 속한 디렉토리 경로

##### 3.4.5 module, exports

exports 객체는 module.exports 객체를 참조하는 형태로 모듈 생성시 대체 사용 가능. exports 객체에 인자를 추가하면 module.exports 에도 같이 추가됨

```javascript
const val = 'value';
module.exports = { val };
```

이 코드와

```javascript
exports.val = 'value';
```

이 코드는 동일한 로직을 수행

##### 3.4.6 process

process 객체는 현재 실행되는 노드 프로세스에 대한 정보 보유

- `process.version` : 노드의 버전
- `process.arch` : 프로세서 아키텍처 정보
- `process.platform` : 운영체제 플랫폼 정보
- `process.pid` : 현재 프로세스 아이디
- `process.uptime()` : 프로세스가 실행된 후 초단위 경과시간
- `process.cwd()` : 현재 프로세스가 실행되는 위치(dir 경로)
- `process.cpuUsage()` : 현재 CPU 사용량(객체 형태)

###### 3.4.6.1 process.env

외부에 노출되면 안되는 중요한 키 정보를 저장시에 process.env 를 사용. 미리 넣어놓은 키정보를 아래와 같이 사용(넣는 방법은 9장)

```javascript
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE;
```

###### 3.4.6.2 process.nextTick(콜백)

`process.nextTick(콜백함수)` : 이벤트 루프가 다른 콜백함수보다 항상 먼저 실행하는 함수

- nextTick.js
  - nextTick 이외에도 Promise의 resolve도 다른 콜백보다 우선 수행됨

###### 3.4.6.3 process.exit(코드)

`process.exit()` : 실행중인 노드 프로세스를 종료. 일반적으로 서버에서는 거의 사용되지 않음. 내부 인자로 0을 주면 정상 종료, 1을 주면 비정상 종료

- exit.js

#### 3.5 노드 내장모듈 사용하기

##### 3.5.1 os

os 모듈 : 운영체제에 대한 정보와 컴퓨터 시스템에 대한 정보 제공

- os.js
  - `os.arch()` : process.arch 와 동일, 시스템 아키택쳐 정보 제공 ex) x64
  - `os.platform()` : process.platform 와 동일, 운영체제 플랫폼 정보 제공 ex) win32
  - `os.type()` : 운영체제의 종류 ex) Windows_NT
  - `os.uptime()` : 운영체제 부팅후 경과시간(초단위) ex) 53354.5342871
  - `os.hostname()` : 컴퓨터 이름
  - `os.release()` : 운영체제의 버전 ex) 10.0.15063
  - `os.homedir()` : 홈 디렉토리 정보 ex) C:\Users\user
  - `os.tmpdir()` : 임시 파일 저장 경로
  - `os.cpus()` : 컴퓨터 코어 정보(객체형태)
  - `os.freemem()` : 사용가능한 메모리 용량 ex)9122930688
  - `os.totalmem()` : 전체 메모리 용량
  - `os.constants` : 각종 에러와 신호에 대한 정보를 저장, 에러코드 검색시 활용 가능

##### 3.5.2 path

path 모듈 : 폴더와 파일에 대한 조작을 위한 기능과 정보 제공. 운영체제별로 경로구분자가 달라서 활용도 높음

- path.js
  - `path.sep` : 경로 구분자
    - Windows : C:\Users\user 와 같이 \ 로 구분
    - POSIX : /home/user 와 같이 / 로 구분(리눅스, 유닉스, 맥 등)
    - 측정 경로구분자를 써야하는 경우, `path.posix.sep` 또는 `path.win32.sep` 형태로 사용
  - `path.delimeter` : 환경변수의 구분자
    - Windows : 세미콜론(;)
    - POSIX : 콜론(:)
  - `path.dirname(경로)` : 파일이 위치한 폴더경로
  - `path.extname(경로)` : 파일의 확장자
  - `path.basename(경로, 확장자)` : 파일의 이름(확장자 포함), 두번째 인자로 파일의 확장자를 넣어주면 파일의 이름만 출력
  - `path.parse(경로)` : 파일의 경로를 root, dir, base, ext, name 으로 구분된 객체로 반환
  - `path.format(객체)` : `path.parse()` 한 객체를 다시 파일경로문자열로 변환
  - `path.normalize(경로)` : / 또는 \ 를 실수로 여러개 쓰거나 섞어쓰는 경우에 정상적인 경로로 변환
  - `path.isAbsolute(경로)` : 파일의 경로가 절대경로이면 true
  - `path.relative(기준경로, 비교경로)` : 기준경로에서 비교경로까지 가는 방법을 반환
  - `path.join(경로, ...)` : 인자들을 하나의 경로로 합쳐서 리턴, 상대경로인 부모(..), 현재경로(.) 까지 처리, 인자에 / 가 있어도 상대경로로 인지
  - `path.resolve(경로, ...)` : `path.join()` 과 비슷하지만 인자에 / 가 있는 경우 절대경로로 인식하여 앞단 인자들의 경로를 무시

#### 3.5.3 url

인터넷 주소를 조작하는 로직이 들어간 모듈. url 처리에는 크게 두가지 방식이 존재

1. WHATWG 방식 : 웹표준 선정 단체인 WHATWG에서 정한 방식
    - 사용방법

      ```javascript
      const url = require('url');
      const URL = url.URL;
      const myURL = new URL(경로);
      ```

2. node 방식 : 기존 노드에서 사용하던 방식
    - 사용방법

      ```javascript
      const url = require('url');
      const myURL = url.parse(경로);
      ```

3. 차이점 : 하단 url.js 파일 참조
    - hostname + port 부분을 WHATWG에서는 host, 노드에서는 href 로 부름
    - pathname + search 부분을 노드에서는 path로 통칭
    - search 부분에서 맨 앞의 ? 를 빼고 노드에서는 query로 부름
    - username + password 부분을 노드에서는 auth로 통칭

- url.js
  - `url.parse(주소)` : 주소 문자열을 분해하여 구분방법별로 노드 객체를 생성
  - `url.format(객체)` ; 주소 객체를 문자열로 조립(노드 객체, WHATWG 객체 모두 가능)

주소가 host 없이 pathname만 오는 경우(/bookList/bookList.apsx) 노드방식에서만 처리할 수 있음

WHATWG 방식의 경우 search 부분(?page=3&limit=10&category=nodejs)을 `searchParams`라는 특수한 객체로 반환하므로 처리하기 쉬움

- searchParam.js
  - `getAll(키)` : 키에 해당하는 모든 값을 배열로 반환
  - `get(키)` : 키에 해당하는 첫번째 값을 반환
  - `has(키)` : 키가 있으면 true
  - `keys()` : 모든 키를 반복 객체(iterator)로 반환
  - `values()` : 모든 값을 반복 객체(iterator)로 반환
  - `append(키, 값)` : 키에 값을 추가
  - `set(키, 값)` : 키에 값을 할당, 같은 키로 값이 있으면 엎어침
  - `delete(키)` : 키와 값을 삭제
  - `toString()` : searchParams 객체를 문자열로 변환

##### 3.5.4 querystring

- querystring.js
  - querystring 모듈 : node 방식 url 에서 search(파라미터)부분을 사용하기 쉽게 객체로 변환(WHATWG 방식의 searchParams 역할을 노드 방식에서 수행)
  - `querystring.parse(쿼리)` : url 의 query 부분을 자바스크립트 객체로 분해
  - `querystring.stringify(객체)` : 분해된 query 객체를 다시 문자열로 조립

##### 3.5.5 crypto

다양한 방식의 암호화 처리 모듈. 계정의 비밀번호 등의 개인정보를 암호화 하는데 사용

###### 3.5.5.1 단방향 암호화

- hash.js
  - crypto 모듈을 이용한 단방향 암호화
  - `createHash(알고리즘)` : 사용할 해시 알고리즘
  - `update(문자열)` : 변환할 문자열 설정
  - `digest(인코딩)` : 인코딩 지정후 암호화 수행, base64 가 길이가 짧아 선호

- pbkdf2.js
  - crypto 모듈의 pbkdf2 기능을 이용하여 단방향 암호화 수행
  - 기존 문자열에 salt 라고 불리는 문자열을 붙이고 해시 알고리즘을 반복하여 사용
  - 비밀번호, salt, 암호화반복횟수, 출력바이트, 해시알고리즘

    ```javascript
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
      console.log('password : ', key.toString('base64'))
    });
    ```

###### 3.5.5.2 양방향 암호화

- cipher.js
  - crypto 모듈의 양방향 알고리즘을 이용하여 복호화 가능한 암호화 수행
  - `crypto.createCipher(알고리즘, 키)` : 암호화 알고리즘과 키를 지정
  - `crypto.getCiphers()` : 암호화에 사용되는 알고리즘 리스트
  - `cipher.update(대상문자열, 인코딩, 출력인코딩)` : 암호화 대상 지정하고 암호화 수행, 보통 문자열은 utf8, 출력 암호는 base64를 사용
  - `cipher.final(출력인코딩)` : 출력 결과물 전체를 출력하여 붙임
  - `decipher.createDecipher(알고리즘, 키)` : 복호화 알고리즘과 키를 지정
  - `decipher.update(대상암호, 인코딩, 출력인코딩)` : 복호화 대상 암호와 인코딩 지정
  - `decipher.final(출력인코딩)` : 출력 결과물 전체를 출력하여 붙임

##### 3.5.6 util

util 모듈 : 자주 사용되는 편의 기능을 모아둔 모듈. API 가 추가되고 삭제되는 경우가 많음

- util.js
  - `util.deprecate(함수, 메시지)` : 함수가 deprecate 되었음을 알려줌. 인자의 함수가 수행되면 메시지를 출력
  - `util.promisify(함수)` : 콜백 패턴을 프로미스 패턴으로 전환. 인자의 함수를 프로미스로 변경해주고 async/await 패턴까지 사용 가능. 반대로 만들어주는 `util.callbackify()` 함수도 있으나 자주 사용되지 않음

#### 3.6 파일 시스템 접근하기

파일 시스템을 이용하기 위해 fs 모듈을 사용

- readFile.js
  - 텍스트 파일 읽어들이기
  - 출력하면 Buffer 라는 객체 타입으로 출력되는데 메모리의 데이터로 이해(3.6.2 참조), `toString()` 을 붙이면 텍스트로 출력

    ```javascript
    fs.readFile(대상파일경로, (err, data) => {
        // 콜백함수
        // err : 에러발생시 로그
        // data : 파일에서 읽어들인 데이터의 버퍼,
        //        data.toString()로 텍스트 출력가능
    })
    ```

- writeFile.js
  - 텍스트파일 쓰기
  
    ```javascript
    fs.writeFile(대상파일경로, 파일에입력할텍스트, (err) => {
        // 콜백함수
        // err : 에러발생시 로그
    });
    ```

##### 3.6.1 동기 메서드와 비동기 메서드

파일읽기는 기본적으로 비동기-논블럭킹 방식으로 처리되며 일부 메서드는 동기방식으로 사용 가능

- 동기/비동기, 블로킹/논블록킹
  - 동기/비동기 : 함수가 바로 return 되는지 여부
  - 블로킹/논블록킹 : 백그라운드 작업으로 수행되는지 여부
  - 사실상 동기-블록킹(해당 함수가 수행될때까지 전체 프로세스가 대기), 비동기-논블록킹(해당 함수를 수행시키고 다음 프로세스 수행, 함수는 수행 완료되면 바로 콜백을 리턴) 방식이 대부분

- async.js
  - fs.readFile() : 비동기 방식으로 파일 읽기. 순차적으로 코드를 작성해도 순서대로 처리되지 않음
  
- sync.js
  - readFileSync() : 콜백을 사용하지 않고 동기-블록킹 방식으로 파일을 읽을때 사용
  - 파일이 크거나 많을 경우 전체 로직이 멈추게되는 문제가 있으므로 사용상의 주의. 되도록이면 비동기 방식의 콜백으로 처리할 것.

- asyncOrder.js
  - readFile() 메서드를 사용하되 콜백함수에 다른 readFile() 을 사용하여 순차처리
  - 길어지면 소위 '콜백지옥'이 될 수 있으므로 Promise 나 async/await로 해결

##### 3.6.2 버퍼와 스트림 이해하기

버퍼링은 데이터를 특정 크기의 덩어리로 모으는 것, 스트리밍은 모은 데이터를 조금씩 내보내는 것

Buffer 클래스로 버퍼를 직접 컨트롤 가능

- buffer.js
  - Buffer 객체의 메서드를 이용하여 버퍼처리
  - `from(문자열)` : 문자열을 버퍼로 변환. length 속성은 버퍼의 크기 설정(byte 단위)
  - `toString(버퍼)` : 버퍼를 문자열로 변환. `base64` 또는 `hex`를 인자로 추가하면 해당 인코딩으로 변환
  - `concat(배열)` : 배열 안에 들어있는 버퍼들을 합병
  - `alloc(바이트)` : 바이트 크기의 빈 버퍼를 생성

대용량의 파일을 처리할 때는 버퍼의 크기로 인한 용량 문제가 있으므로 버퍼의 크기를 줄이고 여러번에 걸쳐서 처리하는 방식을 사용하는데 이것이 스트림

- createReadStream.js
  - `createReadStream(대상파일경로, 옵션)` : 읽기 스트림을 생성, 옵션에 `highWaterMark`로 버퍼의 크기를 바이트단위로 설정(default : 64kb)
  - `on(이벤트명, 콜백)` : `createReadStream()`에서 리턴된 객체의 메서드로 이벤트 발생하면 콜백을 호출. 파일 읽기가 시작되면 'data' 이벤트, 도중에 에러 발생시 'error' 이벤트, 파일을 다 읽으면 'end' 이벤터 발생

- createWriteStream.js
  - `createWriteStream(파일경로, 옵션)` : 쓰기 스트림을 생성
  - `on(이벤트명, 콜백)` : 이벤트 발생서 처리 콜백. 파일 쓰기가 완료되면 'finish'
  - `write(문자열)` : 쓰기 스트림에 문자열을 쓰기
  - `end()` : 쓰기를 끝내고 스트림을 닫음. 'finish' 이벤트가 발생

- pipe.js
  - `읽기스트림.pipe(쓰기스트림)` : 읽기스트림으로 입력되면 쓰기스트림으로 바로 출력

- gzip.js
  - zlib 모듈 : 파일을 압축하는 기능을 제공
  - `zlib.createGzip()` : 입력스트림을 받아서 GZ 압축파일을 생성

    ```javascript
    const readStream = fs.createReadStream(읽을파일경로);
    const writeStream = fs.createWriteStream(출력파일경로);
    const zlibStream = zlib.createGzip();
    readStream.pipe(zlibStream).pipe(writeStream);
    ```

##### 3.6.3 기타 fs 메서드

