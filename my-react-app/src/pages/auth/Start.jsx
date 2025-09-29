// src/pages/auth/Start.jsx
import { useNavigate } from 'react-router-dom';

export default function Start() {
  const navigate = useNavigate();
  // 버튼 누르면 로그인 페이지로 이동
  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-5xl font-bold mb-4 text-pistachio-dark">
          반가워요!
        </h1>
        <p className="whitespace-pre-line text-darkbrown max-w-xs mx-auto">
          더 넓어질 당신의 세상을 함께하는,{'\n'}빌북입니다.{'\n'}
        </p>
      </div>
      <button
        onClick={handleStartClick}
        className="bg-yellow-200 hover:bg-orange-300 text-darkbrown font-semibold py-3 px-5 rounded-lg shadow-md transition"
      >
        시작하기
      </button>
    </div>
  );
}
