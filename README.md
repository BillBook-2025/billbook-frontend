# BillBook Frontend

---

## 📚 [노션 바로가기](https://www.notion.so/the-books-1d471c958f918010babede90e64da0dd?pvs=4)

## 📘 [API 명세서](./docs/api.md)

## 🏷️ [커밋 메시지 유의사항](./docs/type.md)

---

## 초기 세팅 관련 참고사항

- https://velog.io/@my_suwan/프론트엔드-개인프로젝트-및-협업시-초기세팅

### gitignore 파일 생성하기

- https://www.toptal.com/developers/gitignore/

---

### 폴더 구조 예시

```
my-app/
├─ docs/                 # 읽기 전용 문서 저장되는 폴더
├─ public/               # 정적 파일 (favicon 등)
├─ src/
│  ├─ assets/            # 이미지, CSS
│  ├─ components/        # 공통 컴포넌트
│  ├─ pages/             # 라우팅되는 페이지 컴포넌트
│  ├─ hooks/             # 커스텀 훅
│  ├─ utils/             # 유틸 함수
│  ├─ App.jsx
│  └─ main.jsx
├─ .gitignore
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md

```

---

# Create React App으로 시작하기

이 프로젝트는 [Create React App](https://github.com/facebook/create-react-app)을 사용해 초기화되었습니다.

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어들을 실행할 수 있습니다:

### `npm start`

앱을 개발 모드로 실행합니다.  
[http://localhost:3000](http://localhost:3000) 에서 브라우저로 확인할 수 있습니다.

코드를 수정하면 페이지가 자동으로 새로고침됩니다.  
콘솔에서 린트 오류도 확인할 수 있습니다.

### `npm test`

테스트 러너를 대화형 감시 모드로 실행합니다.  
자세한 내용은 [테스트 실행 문서](https://facebook.github.io/create-react-app/docs/running-tests)를 참고하세요.

### `npm run build`

앱을 프로덕션용으로 `build` 폴더에 빌드합니다.  
React가 프로덕션 모드로 번들링되며, 최적화를 통해 성능이 향상됩니다.

빌드는 압축되고, 파일 이름에는 해시가 포함됩니다.  
앱을 배포할 준비가 완료됩니다!

자세한 내용은 [배포 문서](https://facebook.github.io/create-react-app/docs/deployment)를 참고하세요.

### `npm run eject`

⚠️ **주의: `eject`는 한 번 실행하면 되돌릴 수 없습니다!**

빌드 도구 및 설정에 만족하지 않을 경우 `eject`를 실행하여 모든 설정 파일을 프로젝트로 꺼낼 수 있습니다.  
webpack, Babel, ESLint 등 모든 의존성이 프로젝트 안으로 복사되며, 모든 설정을 직접 제어할 수 있습니다.

단, `eject`는 선택 사항이며 대부분의 경우 필요하지 않습니다.

## 더 알아보기

- [Create React App 공식 문서](https://facebook.github.io/create-react-app/docs/getting-started)
- [React 공식 문서](https://reactjs.org/)

## 기타 문서

- [코드 분할(Code Splitting)](https://facebook.github.io/create-react-app/docs/code-splitting)
- [번들 크기 분석](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [PWA 만들기](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [고급 설정](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [배포](https://facebook.github.io/create-react-app/docs/deployment)
- [`npm run build` 축소 실패 문제 해결](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
