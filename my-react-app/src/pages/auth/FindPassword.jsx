// src/pages/FindPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FindPassword() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFindPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId.trim() || !email.trim()) {
      setError('아이디와 이메일을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/find/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email }),
      });

      if (response.ok) {
        const data = await response.json();
        // data.password가 기존 비밀번호라고 가정
        navigate('/foundPassword', { state: { password: data.password } });
      } 
      else {
        const errorData = await response.json();
        switch (response.status) {
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
            setError(errorData.message || '알 수 없는 오류가 발생했습니다.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('네트워크 오류가 발생했습니다.');
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
          찾기
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

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
