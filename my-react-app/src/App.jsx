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

// React의 useState 훅을 가져와서 컴포넌트 상태 관리에 사용
import { useState } from 'react'

// React Router DOM에서 라우팅 관련 컴포넌트들 import
import { Routes, Route, Link } from 'react-router-dom'

// 로고 이미지 파일 임포트
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// 앱 스타일시트 임포트
import './App.css'

// === 페이지 역할을 하는 컴포넌트들 ===

// "/" 경로에 매핑될 홈 페이지 컴포넌트
function Home() {
  return <h1>홈 페이지</h1>
}

// "/about" 경로에 매핑될 소개 페이지 컴포넌트
function About() {
  return <h1>소개 페이지</h1>
}

// 메인 앱 컴포넌트
function App() {
  // count 상태 변수와 setCount 함수 선언 (초기값 0)
  const [count, setCount] = useState(0)

  return (
    <>
      {/* 네비게이션 바 - Link 컴포넌트를 써서 페이지 새로고침 없이 라우팅 */}
      <nav>
        {/* Link to 속성은 이동할 경로 지정 */}
        <Link to="/">홈</Link> | <Link to="/about">소개</Link>
      </nav>

      {/* Routes는 여러 Route를 감싸는 컨테이너 */}
      <Routes>
        {/* path가 "/" 일 때 Home 컴포넌트 렌더링 */}
        <Route path="/" element={<Home />} />
        {/* path가 "/about" 일 때 About 컴포넌트 렌더링 */}
        <Route path="/about" element={<About />} />
      </Routes>

      {/* 외부 사이트 링크 및 로고 표시 (새 탭 열기) */}
      <div>
        {/* target="_blank"는 새 탭 열기, rel="noreferrer"는 보안 목적 */}
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* 페이지 제목 */}
      <h1>Vite + React</h1>

      {/* 버튼과 카운트 상태 표시 영역 */}
      <div className="card">
        {/* 버튼 클릭 시 count 상태를 1씩 증가시키는 함수 호출 */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count} {/* 현재 카운트 상태 출력 */}
        </button>

        {/* 간단한 설명 텍스트 */}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* 추가 안내 텍스트 */}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

// 이 컴포넌트를 외부에서 불러 쓸 수 있게 export
export default App
