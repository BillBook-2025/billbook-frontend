// src/pages/auth/ResetPassword.jsx

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { changePassword } from '../../api/auth' // 비밀번호 찾기 함수

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, email } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // userId, email 없으면 findPassword 페이지로 이동
    if (!userId || !email) {
      navigate('/findPassword');
    }
  }, [userId, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('비밀번호와 비밀번호 확인을 모두 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(password, confirmPassword);
      alert('비밀번호가 변경되었습니다.');
      
      navigate('/login');
    } 
    catch (err) {
      const status = err.message.match(/HTTP (\d+):/)?.[1];
      switch (status) {
        case '400':
          setError('입력값을 확인해주세요.');
          break;
        case '401':
          setError('인증에 실패했습니다.');
          navigate('/login');
          break;
        default:
          setError('알 수 없는 오류가 발생했습니다.');
          navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || !email) return null;

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">비밀번호 재설정</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs w-full">
        <input
          type="password"
          placeholder="새 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-pistachio p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-white hover:bg-pistachio font-bold py-3 rounded"
        >
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}