# Chap 5. 패키지 매니저

## 5.1 npm 알아보기

npm(Node Package Manager)는 노드의 패키지 매니저로서 세계의 노드 개발자들이 개발해놓은 다양한 프로그램, 모듈들을 모아놓고 다른 개발자들이 쉽게 사용할 수 있도록 제공. 세계 최대 규모를 자랑하며 비슷한 서비스로는 페이스북 진영의 yarn이 있다. React 류의 프레임웍은 여기서 받을 수 있고, npm 에 올라간 모듈이 여기에도 있는 경우가 많아서 npm이 느릴 경우 대체제로 사용 가능

npm에 업로드된 노드 모듈을 '패키지'라고 부르고 패키지가 다른 패키지를 사용하는 경우도 많은데 이를 '의존 관계'라고 부른다.

## 5.2 pakage.json으로 패키지 관리하기

- package.json : 서비스 개발에 필요한 다른 패키지들의 목록과 버전 정보를 가지고 있는 파일. npm 명령어로 프로젝트 생성 시 자동으로 만들어짐

  ```bash
  npm init
  ```

  콘솔에서 이 명령어를 수행하고 프로젝트 관련한 기본 정보를 입력하면 프로젝트의 기본 파일들이 생성된다. 프로젝트의 기본 정보는 아래와 같다.

- package name : 패키지 명. package.json 파일의 name 속성에 저장
- version : 패키지의 버전. 버전 부여 기준은 5.3 참조
- entry point : 자바스크립트 실행파일 진입점. 진입 파일은 보통 마지막으로 `module.exports` 문을 사용
- test command : 코드 테스트 시 입력할 명령어. package.json의 scripts 속성의 test 속성으로 저장
- git repository : 코드를 저장한 git 저장소 주소. package.json의 repository 속성에 저장
- keywords : npm 홈페이지(<https://npmjs.com>)에서 패키지를 검색하는 키워드. package.json의 keywords 속성
- lincense : 패키지 라이선스

init이 수행완료되면 package.json 파일이 생성된다.

script 부분은 npm 명령어로 수행할 수 있는데. 콘솔에서 `npm run [스크립트명령어]` 를 수행하면 해당 스크립트가 자동 실행된다. 대표적으로 많이 사용되는 `start` 와 `test` 는 콘솔에서 `npm [start/test]` 만 입력해도 수행

이제 기본설정이 끝났으므로 모듈을 설치할 수 있다. 설치방법은 아래의 방법들이 있다.

- npm 명령어로 직접 설치

  ```bash
  npm install(또는 i) [(옵션)] [패키지명 (패키지명 ...)]
  ```

  설치한 패키지는 package.json 파일의 `dependencies` 속성에 이름과 버전이 저장되고 node_module 이라는 폴더 안에 패키지와 의존관계 모듈들이 저장, package-lock.json 파일도 생성되고 설치한 모듈과 해당 모듈의 의존관계 모듈의 정보가 저장

- package.json 파일의 `dependencies` 에 모듈명/버전을 입력하고 설치

  기존에 설치했다가 node_module 폴더만 지웠거나 git에서 다운로드 받아서 package.json 파일만 있는 경우, `npm install(또는 i)` 명령어만 수행하면 자동으로 package.json 의 `dependencies` 에 등록된 모듈과 버전으로 다운로드 받아서 node_module 폴더에 설치

개발 시에만 사용되는 패키지의 경우 `npm install(또는 i) --save-dev(또는 -D) [패키지명]` 으로 설치하면 package.json의 `devDependencies` 속성으로 별도로 저장되며 실제 배포시에는 제외되어 배포됨

전역설치 : 패키지를 프로젝트 내에 설치하는 것이 아니라 npm 설치 폴더로 설치하며 시스템 내 모든 위치에서 콘솔의 커맨드로 실행이 가능. `npm install(또는 i) --global(또는 -g) [패키지명]` 으로 설치. package.json 에 등록되지 않기 때문에 전역 패키지인데 패키지 배포시 필요한 경우는 일반 설치 후에 `npx` 명령으로 전역으로 등록해야 함

rimraf : 윈도에서 맥이나 유닉스의 `rm -rf` 명령을 수행하게 해주는 패키지. 전역 설치후에 어디서든 사용하자! 설치 : `npm i -g rimraf` 수행 : `rimraf [폴더명]`

## 5.3 패키지 버전 이해하기

- SemVer : Semantic Versioning(유의적 버전)

  `[Major 버전값].[Minor 버전값].[Patch 버전값]` 형태

  - Major 버전 : 0이면 초기 개발 중, 1부터 정식 버전이란 의미. 하위 호환이 안될 정도로 패키지 내용이 수정된 경우에 올리며, 이전 버전을 사용하던 의존관계인 패키지는 오류가 발생할 가능성이 있다는 의미이므로 업데이트 시 검증을 철저히 하거나 업데이트에서 제외해야 함
  - Minor 버전 : 하위 호환이 되는 기능 업데이트 또는 신규 기능 추가 시 올리며 의존 관계인 패키지들도 package.json 에 업데이트된 버전으로 반영해도 문제가 없음을 보장
  - Patch 버전 : 기존의 기능에 문제가 있어서 수정 시에 올리며, 당연히 업데이트 시 문제가 없음을 보장

  package.json 파일에서 의존관계의 버전값을 표시할때 앞에 붙이는 기호에 따라 업데이트된 버전의 설치 여부가 정해짐

  - `^` 기호 : Minor 버전 업데이트까지 반영하여 설치. `1.x.x` 로도 표현 가능 (ex. `npm i express@^1.1.1` 또는 `npm i express@1.x.x`)
  - `~` 기호 : Patch 버전 업데이트까지 반영하여 설치. `1.1.x` 로도 표현 가능 (ex. `npm i express@~1.1.1` 또는 `npm i express@1.1.x`)
  -`>`, `<`, `>=`, `<=`, `=` 기호 : 초과, 미만, 이상, 이하를 의미 (ex. `npm i express@>1.1.1`)
  - `@latest` : 항상 최신버전을 설치. `@x`로도 표현 가능 (ex. `npm i express@latest` 또는 `npm i express@x`)

## 5.4 기타 npm 명령어

- `npm outdated` : 현재 프로젝트의 의존 패키지들의 버전 정보와 업데이트 가능 버전의 리스트 표시
- `npm update ([패키지명])` : 해당 패키지의 업데이트 가능한 버전(`npm outdated` 에서 Wanted 항목에 조회된 버전)으로 업데이트. [패키지명] 없이 명령할 경우 리스팅된 모든 패키지에 대해 Wanted로 업데이트
- `npm uninstall [패키지명]` : 해당 패키지를 package.json, node_module폴더에서 제거(`npm rm [패키지명]` 명령도 동일)
-`npm search [검색어]` : npm의 패키지를 검색 (npm 홈페이지에서도 검색 가능)
- `npm info [패키지명]` : 패키지의 세부 정보 조회
- `npm adduser` : 현재 프로젝트에 npm 계정을 등록. 배포 시 필요
- `npm whoami` : 로그인한 사용자 조회
- `npm logout` : `npm adduser` 로 로그인한 계정을 로그아웃
- `npm version [버전 또는 major, minor, patch 등]` : package.json의 version값을 업그레이드, `npm version` 만 입력하면 현재 프로젝트와 패키지들의 버전 조회
- `npm deprecate [패키지명][버전]` : 해당 패키지를 설치할 때 경고 메시지 출력. 자신의 패키지에만 가능
- `npm publish` : 자신이 만든 패키지 배포
- `npm unpublish` : 자신이 배포함 패키지를 제거. 배포한지 24시간 이내에만 가능(그 이상 지나면 다른 패키지에서 의존성이 생겨있을 수 있기 때문)
- 이외의 명령어는 npm 공식문서(<https://docs.npmjs.com/>) 참조

## 5.5 패키지 배포하기

npm 웹 사이트(<https://www.npmjs.com/>)에서 계정을 생성

- index.js
  - package.json 파일의 main 부분의 파일명과 동일해야 함
  - `module.exports` 함수가 구현되어 있어야 함

콘솔에서 `npm info [패키지명]` 을 수행하고 E404 오류가 나면 현재 해당 패키지명이 사용되지 않고 있다는 의미이므로 배포 가능

`npm publish` 명령으로 배포를 수행하고 `npm info [패키지명]` 명령으로 확인

`npm unpublish [패키지명] --force` 명령으로 배포제거

배포 시에 개인정보가 코드에 들어있지 않은지 확인할 것, 실제 사용하지도 않을 패키지명을 선점하지 말 것, 기존에 있는 패키지와 비슷한 이름의 패키지를 배포하거나 다른 패키지를 수정해서 새로 배포하는 경우는 원작자와 협의할 것
