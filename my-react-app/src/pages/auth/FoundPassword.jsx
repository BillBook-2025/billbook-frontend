// src/pages/auth/FoundPassword.jsx
import { useLocation, useNavigate } from 'react-router-dom';

export default function FoundPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const { password } = location.state || {};

  if (!password) {
    // 비밀번호 없으면 비밀번호 찾기 페이지로 돌아가기
    navigate('/findPassword');
    return null;
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">비밀번호 찾기 완료</h1>
      <p className="text-lg mb-4">
        회원님의 비밀번호는 <span className="font-mono text-xl">{password}</span> 입니다.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="bg-white hover:bg-pistachio font-bold py-3 px-6 rounded"
      >
        로그인하기
      </button>
    </div>
  );
}
