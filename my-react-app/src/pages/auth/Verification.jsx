// src/pages/auth/Verification.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Verification() {
  const location = useLocation();
  const navigate = useNavigate();

  // 회원가입 페이지에서 넘어온 아이디, 비번, 이메일, 이름 받기
  const { userId, password, email, userName } = location.state || {};

  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 예시로 본인인증 성공 버튼 클릭 시 처리
  const handleVerificationSuccess = async () => {
    setError('');
    setIsVerifying(true);

    try {
      // 여기에 본인인증 api라던가... 본인인증 과정 넣기

      // 본인인증 성공했다고 가정하고 회원가입 API 호출
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, email, userName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '회원가입 실패');

        switch (response.status) {
          case 400:
            setError('입력값을 확인해주세요.');
            break;
          case 401:
            setError('본인인증이 필요합니다.');
            break;
          case 409:
            setError('이미 존재하는 아이디입니다.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다.');
        }

        setIsVerifying(false);
        return;
      }

      // 회원가입 성공하면 로그인 페이지로 이동
      const result = await response.json();
      alert(result.message || '회원가입 완료');
      navigate('/login');

      
    } 
    catch (e) {
      console.error(e);
      setError('네트워크 오류 발생');
      setIsVerifying(false);
    }
  };

  // 만약 location.state가 없으면 (직접 접속 등) 경고
  if (!userId || !password || !email || !userName) {
    return (
      <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <p className="text-red-500 text-lg font-bold">
          회원가입 정보가 없습니다. 다시 회원가입 페이지로 이동해주세요.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="mt-4 underline text-black font-semibold hover:text-yellow-500"
        >
          회원가입 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">본인인증</h1>

      {/* 실제 본인인증 UI/컴포넌트 자리 */}
      <p className="mb-6">본인인증을 진행해주세요.</p>

      <button
        onClick={handleVerificationSuccess}
        disabled={isVerifying}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        {isVerifying ? '인증 중...' : '본인인증 완료'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
