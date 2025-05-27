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

### 사용하는 확장 파일

- **Vite**  
  빠르고 가벼운 모듈 번들러이자 개발 서버로, React 프로젝트의 빌드와 개발 환경을 지원합니다.

- **ESLint**  
  코드 스타일과 문법 오류를 검사해주는 정적 분석 도구로, 코드 품질을 유지하는 데 도움을 줍니다.

- **Prettier**  
  일관된 코드 포맷팅을 자동으로 적용해주는 도구로, 협업 시 코드 스타일 통일에 유용합니다.

- **react-router-dom**  
  React 애플리케이션에서 클라이언트 사이드 라우팅을 구현할 때 사용하는 라이브러리입니다.

- **Tailwind CSS**  
  유틸리티 클래스 기반의 CSS 프레임워크로, 빠르고 효율적인 스타일링을 가능하게 합니다.

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

# Vite + React 프로젝트 시작하기

이 프로젝트는 [Vite](https://vitejs.dev/)와 React를 사용해 초기화되었습니다.

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어들을 실행할 수 있습니다:

### `npm run dev`

개발 모드에서 앱을 실행합니다.  
[http://localhost:5173](http://localhost:5173) (기본 포트) 또는 터미널에 표시된 주소에서 앱을 확인할 수 있습니다.

코드를 수정하면 페이지가 자동으로 새로고침됩니다.

### `npm run build`

앱을 프로덕션용으로 빌드합니다.  
최적화된 정적 파일이 `dist` 폴더에 생성됩니다.

### `npm run preview`

빌드된 프로덕션 결과물을 로컬에서 미리 보기 위해 실행합니다.

### `npm test`

(테스트 설정 시) 테스트 러너를 실행합니다.  
자세한 내용은 프로젝트에 따라 다르므로, 별도 설정 문서를 참고하세요.

## 주요 문서

- [Vite 공식 문서](https://vitejs.dev/guide/)
- [React 공식 문서](https://reactjs.org/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs/installation) (Tailwind를 사용할 경우)
- [PostCSS 공식 문서](https://postcss.org/)

## 참고

- 개발 서버 포트가 충돌할 경우 Vite가 자동으로 다른 포트를 할당합니다.
- `vite.config.js`에서 포트, 프록시 등 개발 서버 설정을 변경할 수 있습니다.
