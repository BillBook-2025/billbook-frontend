/* 이 파일은 리액트 시작 스크립트 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // 추가
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* 여기로 감싸기 */}
      <App />
    </BrowserRouter>
  </StrictMode>
);