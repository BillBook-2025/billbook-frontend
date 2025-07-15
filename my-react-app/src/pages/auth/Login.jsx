// src/pages/auth/Login.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({userId, password}),
      });

      // 로그인 실패했을때
      if (!response.ok) {
        const errorData = await response.json();
        
         switch (response.status) {
          case 400:
            setError('입력값을 확인해주세요.');
            break;
          case 409:
            setError(errorData.message || '아이디 또는 비밀번호가 틀렸습니다.');
            break;
          default:
            setError(errorData.message || '로그인 실패');
        }

        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // 로그인 성공 시 사용자 정보 저장 (예: 로컬스토리지)
      localStorage.setItem('userInfo', JSON.stringify(data));

      // 로그인 성공하면 홈화면으로 이동
      navigate('/home');
    }
    // 오류난경우
    catch (error) {
      setError('네트워크 오류 발생');
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">로그인</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-8 max-w-xs mx-auto w-fill">
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
          <button
          type="submit"
          className='bg-white hover:bg-pistachio font-bold'>
            {isLoading ? '로그인 중...' : '로그인'}
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
