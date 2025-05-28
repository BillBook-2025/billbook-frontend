/*
!!!!!!!!!밑의 코드는 일단 예시임
!! 이 파일은 리액트 앱의 메인 컴포넌트 입니다

react-router-dom은 React 애플리케이션에서 **클라이언트 사이드 라우팅(Client-side Routing)**을 쉽게 구현할 수 있도록 도와주는 라이브러리예요.

주요 기능과 장점
페이지 이동(라우팅)을 URL 기반으로 관리할 수 있어요.

새로고침 없이도 다양한 ‘페이지’처럼 보이는 컴포넌트 전환이 가능해요.

<BrowserRouter>, <Routes>, <Route> 같은 컴포넌트로 쉽게 라우팅 구조를 만들 수 있어요.

URL 파라미터, 쿼리, 중첩 라우트 등 다양한 라우팅 기능을 지원해요.

SPA(Single Page Application)에서 사용자 경험을 부드럽게 만들어줘요.

URL 주소에 따라 어떤 컴포넌트를 보여줄지 클라이언트(브라우저)에서 결정해줍니다.

| 기능              | 설명                              | 예시                                     |
| --------------- | ---------------------------------- | --------------------------------------- |
| `BrowserRouter` | 앱 라우터 환경 설정                  | `<BrowserRouter>...</BrowserRouter>`     |
| `Routes`        | 경로 그룹                           | `<Routes> <Route ... /> </Routes>`      |
| `Route`         | 경로와 컴포넌트 연결                  | `<Route path="/" element={<Home />} />` |
| `Link`          | 페이지 전환용 링크 (새로고침 없이 이동) | `<Link to="/about">소개</Link>`          |
| `useParams`     | 동적 라우트 경로 파라미터 읽기         | `const { id } = useParams();`           |

*/

import Router from './routes/Router'

function App() {
  return <Router />
}

export default App
