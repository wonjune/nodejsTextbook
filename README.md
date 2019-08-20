# node.js 교과서 (길벗, 조현영)

## 개요 
 Node.js 교과서 책 공부

## 내용
 Chap1, 2 는 node.js 의 기본 내용

### Chap3
 - helloWorld.js
    - _console.log() 를 이용한 출력_

 - var.mjs, func.mjs, index.mjs
    - _모듈화 기초_
    - _ES2015 스타일 적용_
    - _mjs 확장자 사용_
    - _실행시 아래 명령어 사용_
```
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
```
crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {console.log('password : ', key.toString('base64'))});
```
    - _비밀번호, salt, 암호화반복횟수, 출력바이트, 해시알고리즘_

