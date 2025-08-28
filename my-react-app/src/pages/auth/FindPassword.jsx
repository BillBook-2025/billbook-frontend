// src/pages/auth/FindPassword.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { changePassword } from '../../api/auth' // 비밀번호 변경 함수

export default function FindPassword() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleFindPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !email.trim()) {
      setError('아이디와 이메일을 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 체크!!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      // await findPassword(userId, email);
      // 여기서 바로 changePassword 호출은 안되고, 실제 백엔드가 userId+email 확인 후 토큰 발급 -> 비밀번호 변경 절차를 거쳐야 함
      // 성공 시 ResetPassword 페이지로 이동하면서 userId, email 전달
      navigate('/resetPassword', { state: { userId, email } });
    }
    catch (error) {
      const status = error.message.match(/HTTP (\d+):/)?.[1];

      switch (status) {
          case 400:
            setError('입력값을 확인해주세요.');
            break;
          case 401:
            setError('인증에 실패했습니다.');
            break;
          case 404:
            setError('해당 이메일을 가진 계정을 찾을 수 없습니다.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다.');
        }
    }
  };

  return (
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">비밀번호 찾기</h1>

      <form onSubmit={handleFindPassword} className="flex flex-col gap-4 max-w-xs mx-auto w-fill">
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-white hover:bg-pistachio font-bold">
          비밀번호 재설정
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <button
          onClick={() => navigate('/login')}
          className="underline text-black font-semibold hover:text-yellow-500"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
