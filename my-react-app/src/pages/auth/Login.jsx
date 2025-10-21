// src/pages/auth/Login.jsx

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { login } from '../../api/auth'; // 회원가입 api 함수

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // 로딩 중 여부 설정하는거,,, 중복요청 방지용으로! 없어도됨!!
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(userId, password); // 로그인함수갖다씀

      // 로그인 성공 시 사용자 정보 저장 (로컬스토리지)
      localStorage.setItem('userInfo', JSON.stringify(data));

      // 로그인 성공하면 홈화면으로 이동
      navigate('/home');
    }
    catch (error) {
      const status = error.message.match(/HTTP (\d+):/)?.[1];

      switch (status) {
          case 400:
            setError('입력값을 확인해주세요.');
            break;
          case 409: // 인증 실패
            setError('아이디 또는 비밀번호가 틀렸습니다.');
            break;
          default:
            setError('로그인 실패');
        }
    }
     finally { setIsLoading(false); }
    
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">로그인</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-8 max-w-xs mx-auto w-fill">
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
          <button
          type="submit"
          className="bg-yellow-200 hover:bg-orange-300 text-darkbrown font-semibold py-3 px-5 rounded-lg shadow-md transition">
            {isLoading ? '로그인 중...' : '로그인 하기'}
          </button>

        </form>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center gap-8">
        <button
          onClick={() => navigate('/signup')}
          className="underline text-black font-semibold hover:text-yellow-500"
        >
          회원가입
        </button>
        <button
          onClick={() => navigate('/findPassword')}
          className="underline text-black font-semibold hover:text-yellow-500"
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}
