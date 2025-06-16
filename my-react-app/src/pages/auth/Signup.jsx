// src/pages/Signup.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({userId, password, email}),
      });
/*
      // 같은 아이디가 있는 경우 오류! 재입력요청
      if(userId = ) {
        const errorData = await response.json();
        setError(errorData.message || '이미 존재하는 아이디');
        return;
      }
      // 같은 이메일이 있는 경우 오류!
      if(email = ) {
        const errorData = await response.json();
        setError(errorData.message || '이미 존재하는 이메일');
        return;
      }
*/
      // 그냥 실패했을때
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '회원가입 실패');
        return;
      }

      // 회원가입 성공하면 로그인 화면으로 이동
      navigate('/login');
    }
    // 오류난경우
    catch (error) {
      setError('네트워크 오류 발생');
      console.error(error);
    }
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">회원가입</h1>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4 mb-8 max-w-xs mx-auto w-fill">
          <input
          type="text"
          placeholder="ID:"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
          <input
          type="password"
          placeholder="PW:"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email:"
          value={userId}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
          <button
          type="submit"
          className='bg-white hover:bg-pistachio font-bold'>
            회원가입
          </button>

        </form>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center gap-8">
        <button
          onClick={() => navigate('/login')}
          className="underline text-black font-semibold hover:text-yellow-500"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
}
