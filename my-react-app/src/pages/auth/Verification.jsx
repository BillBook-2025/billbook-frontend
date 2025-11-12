// src/pages/auth/Verification.jsx
{/**사용하지 않는 페이지!!!!!!!!!!! */}

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../../api/auth'; // 회원가입 api 함수

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
      // 아니면 간편로그인?

      // 본인인증 성공했다고 가정하고 회원가입 API 호출
      const result = await signup(userId, password, email, userName);

      alert(result.message || '회원가입 완료');
      navigate('/login');
    } 
    catch (error) {
      // error.message에 서버에서 보내는 메시지가 들어있긔
      const status = error.message.match(/HTTP (\d+):/)?.[1];

        switch (status) {
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
      <h1 className="text-4xl text-pistachio-dark font-bold mb-4">본인인증</h1>

      {/* 실제 본인인증 UI/컴포넌트 자리 */}
      <p className="mb-6 text-darkbrown">본인인증을 진행해주세요.</p>

      <button
        onClick={handleVerificationSuccess}
        disabled={isVerifying}
        className="bg-yellow-200 hover:bg-orange-300 text-darkbrown font-semibold py-3 px-5 rounded-lg shadow-md transition"
      >
        {isVerifying ? '인증 중...' : '본인인증 완료'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
