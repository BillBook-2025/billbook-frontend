// src/pages/Start.jsx
import { useNavigate } from 'react-router-dom';

export default function Start() {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    // 테일윈드로 디자인 바로 같이 적용
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4 text-pistachio-dark">
          반가워요!
        </h1>
        <p className="whitespace-pre-line text-gray-600 text-sm max-w-xs mx-auto">
          더 넓어질 당신의 세상을 함께하는,{'\n'}빌북입니다.
        </p>
      </div>
      <button
        onClick={handleStartClick}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        시작하기
      </button>
    </div>
  );
}
