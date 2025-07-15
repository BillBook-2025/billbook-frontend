// src/pages/auth/Signup.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // 입력받은 값을 본인인증페이지로 넘겨서 인증 진행 후 회원가입 성공하도록
    if (!userId || !password || !email || !userName) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    navigate('/verification', {
      state: { userId, password, email, userName }
    });
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Name:"
          value={userName}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
          <button
          type="submit"
          className='bg-white hover:bg-pistachio font-bold'>
            본인인증 진행하기
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
