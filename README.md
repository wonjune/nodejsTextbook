# node.js 교과서 (길벗, 조현영)

## 개요

 Node.js 교과서 책 공부

## 내용

 Chap1, 2 는 node.js 의 기본 내용

### Chap3. 노드 기능 알아보기

- helloWorld.js
  - _console.log() 를 이용한 출력_

- var.mjs, func.mjs, index.mjs
  - _모듈화 기초_
  - _ES2015 스타일 적용_
  - _mjs 확장자 사용_
  - _실행시 아래 명령어 사용_

    ```bash
      node --experimental-modules [파일명]
    ```

- globalA.js, globalB.js
  - _global 객체의 message 함수를 이용하여 다른 모듈간 메시지 공유_
  - _프로그램이 복잡해질 경우 유지보수가 어려워지므로 global.message 는 사용하지 않는 것이 좋음_
  - _파일간 메시지 공유는 모듈화를 수행후 명시적으로 불러와서 사용하도록 권장_

- console.js
  - _global 객체 내 console 객체 활용_
  - _개발 중 디버깅, 수행속도 측정, 에러메시지 로깅 등에 사용_

- timer.js
  - _global 객체 내 타이머 함수_
  - _setTimeout(콜백, 밀리초) : 지정시간 이후 콜백 수행_
  - _setInterval(콜백, 밀리초) : 지정시간 마다 콜백 반복_
  - _setImmediate(콜백) : 콜백을 즉시 실행_
  - _clearTimeout(아이디) : 지정된 setTimeout 취소_
  - _clearInterval(아이디) : 지정된 setInterval 취소_
  - _clearImmediate(아이디) : 지정된 setImmediate 취소_

- filename.js
  - ___filename : 현재 파일의 경로와 이름_
  - ___dirname : 현재 파일이 속한 디렉토리 경로_

- nextTick.js
  - _process 객체는 현재 실행중인 노드 프로세스에 대한 정보 보유_
  - _이벤트 루프가 다른 콜백함수보다 항상 먼저 실행하는 함수_
  - _nextTick 이외에도 Promise의 resolve도 다른 콜백보다 우선 수행됨_

- exit.js
  - _process.exit() : 실행중인 노드 프로세스를 종료_
  - _일반적으로 서버에서는 거의 사용하지 않음_

- os.js
  - _os 모듈 : 운영체제에 대한 정보와 컴퓨터 시스템에 대한 정보 제공_

- path.js
  - _path 모듈 : 폴더와 파일에 대한 조작을 위한 기능과 정보 제공_

- url.js
  - _url 모듈 : 인터넷 주소 정보에 대한 처리 기능 제공_
  - _url 모듈을 이용하여 URL 주소를 WHATWG 방식과 node 방식 각각으로 파싱_

- searchParam.js
  - _WHATWG 방식의 url 에서 searchParams 객체부분을 이용한 파라미터 파싱_

- querystring.js
  - _node 방식 url 에서 search(파라미터)부분을 사용하기 쉽게 객체로 변환_

- hash.js
  - _crypto 모듈을 이용한 단방향 암호화_
  - _createHash(알고리즘) : 사용할 해시 알고리즘_
  - _update(문자열) : 변환할 문자열 설정_
  - _digest(인코딩) : 인코딩 지정후 암호화 수행, base64 가 길이가 짧아 선호_

- pbkdf2.js
  - _crypto 모듈의 pbkdf2 기능을 이용하여 단방향 암호화 수행_
  - _기존 문자열에 salt 라고 불리는 문자열을 붙이고 해시 알고리즘을 반복하여 사용_
  - _비밀번호, salt, 암호화반복횟수, 출력바이트, 해시알고리즘_

    ```javascript
      crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password : ', key.toString('base64'))
      });
    ```

- cipher.js
  - _crypto 모듈의 양방향 알고리즘을 이용하여 복호화 가능한 암호화 수행_
  - _crypto.createCipher(알고리즘, 키) : 암호화 알고리즘과 키를 지정_
  - _crypto.getCiphers() : 암호화에 사용되는 알고리즘 리스트_
  - _cipher.update(대상문자열, 인코딩, 출력인코딩) : 암호화 대상 지정하고 암호화 수행, 보통 문자열은 utf8, 출력 암호는 base64를 사용_
  - _cipher.final(출력인코딩) : 출력 결과물 전체를 출력하여 붙임_
  - _decipher.createDecipher(알고리즘, 키) : 복호화 알고리즘과 키를 지정_
  - _decipher.update(대상암호, 인코딩, 출력인코딩) : 복호화 대상 암호와 인코딩 지정_
  - _decipher.final(출력인코딩) : 출력 결과물 전체를 출력하여 붙임_

- util.js
  - _util 모듈 : 자주 사용되는 편의 기능을 모아둔 모듈. API 가 추가되고 삭제되는 경우가 많음_
  - _util.deprecate(함수, 메시지) : 함수가 deprecate 되었음을 알려줌. 인자의 함수가 수행되면 메시지를 출력_
  - _util.promisify(함수) : 콜백 패턴을 프로미스 패턴으로 전환. 인자의 함수를 프로미스로 변경해주고 async/await 패턴까지 사용 가능. 반대로 만들어주는 util.callbackify() 함수도 있으나 자주 사용되지 않음_

- readFile.js
  - _fs 모듈 : 파일시스템을 다루는 모듈_
  - _텍스트 파일 읽어들이기_

    ```javascript
      fs.readFile(대상파일경로, (err, data) => {
          // 콜백함수
          // err : 에러발생시 로그
          // data : 파일에서 읽어들인 데이터의 버퍼,
          //        data.toString()로 텍스트 출력가능
      })
    ```

- writeFile.js
  - _텍스트파일 쓰기_
  
    ```javascript
      fs.writeFile(대상파일경로, 파일에입력할텍스트, (err) => {
          // 콜백함수
          // err : 에러발생시 로그
      });
    ```

- async.js, sync.js, asyncOrder.js
  - 파일읽기는 기본적으로 비동기-논블럭킹 방식으로 처리
  - async.js 파일과 같이 순차적으로 파일을 읽을경우 순서대로 처리되지 않음. 따라서 asyncOrder.js 와 같이 콜백함수 안에 다음 파일을 읽는 로직 삽입하여 처리
  - 동기/비동기, 블로킹/논블록킹
    - 동기/비동기 : 함수가 바로 return 되는지 여부
    - 블로킹/논블록킹 : 백그라운드 작업으로 수행되는지 여부
    - 사실상 동기-블록킹(해당 함수가 수행될때까지 전체 프로세스가 대기), 비동기-논블록킹(해당 함수를 수행시키고 다음 프로세스 수행, 함수는 수행 완료되면 바로 콜백을 리턴) 방식이 대부분
  - readFileSync() : 콜백을 사용하지 않고 동기-블록킹 방식으로 파일을 읽을때 사용. 파일이 크거나 많을 경우 전체 로직이 멈추게되는 문제가 있으므로 사용상의 주의 필요. 되도록이면 비동기 방식의 콜백으로 처리할 것.(사용 예 : sync.js 파일 )
