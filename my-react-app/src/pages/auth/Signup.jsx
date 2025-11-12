// src/pages/auth/Signup.jsx

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../../api/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 입력받은 값을 본인인증페이지로 넘겨
    if (
      !userId.trim() ||
      !password.trim() ||
      !email.trim() ||
      !userName.trim()
    ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 이메일 형식 체크!!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const res = await signup(userId, password, email, userName);

      alert(res?.message || '회원가입이 완료되었습니다.');
      navigate('/login');
    } 
    catch (err) {
      const status = err.message.match(/HTTP (\d+):/)?.[1];

      switch (status) {
        case '400':
          setError('잘못된 요청입니다. 입력값을 다시 확인해주세요.');
          break;
        case '401':
          setError('본인인증이 완료되지 않았습니다.');
          break;
        case '409':
          let serverMsg = '이미 존재하는 아이디입니다.'; 
          setError(serverMsg);
          break;
        default:
          setError('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">회원가입</h1>

      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 mb-8 max-w-xs mx-auto w-full"
      >
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <input
          type="text"
          placeholder="이름 입력"
          value={userName}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-200 hover:bg-orange-300 text-darkbrown font-semibold py-3 px-5 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? '처리 중...' : '완료'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-center gap-8">
        <button
          onClick={() => navigate('/login')}
          className="underline hover:text-yellow-500"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
