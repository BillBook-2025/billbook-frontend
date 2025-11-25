// src/pages/mypage/Manner.jsx
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// API 함수
import { changeTemperature } from '../../api/profile';

export default function Manner() {
  const navigate = useNavigate();
  const { userId: partnerId } = useParams(); // 상대방 userId
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId'); // 책 ID 필요하면 사용

  // 매너온도
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback) {
      alert("거래 평가('최고예요' 또는 '별로예요')를 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      await changeTemperature(partnerId, { feedback, bookId });
      alert('매너평가가 완료되었습니다!');
      navigate(-1); // 이전 페이지로 이동
    } catch (err) {
      console.error(err);
      alert('평가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 bg-ivory h-screen">
      <h2 className="text-2xl font-bold text-darkbrown">
        거래 상대방 매너평가
      </h2>
      <p className="text-sm text-darkbrown opacity-75">거래 책 ID: {bookId}</p>

      <div className="space-y-3">
        <p className="font-medium text-darkbrown">거래가 어떠셨나요?</p>
        <div className="flex gap-4">
          <button
            onClick={() => setFeedback('good')}
            className={`flex-1 py-3 rounded-lg text-lg font-semibold transition-all
              ${
                feedback === 'good'
                  ? 'bg-pistachio text-darkbrown ring-2 ring-darkbrown shadow-md'
                  : 'bg-white text-darkbrown border border-darkbrown hover:bg-pistachio hover:bg-opacity-50'
              }`}
          >
            👍 최고예요
          </button>
          <button
            onClick={() => setFeedback('bad')}
            className={`flex-1 py-3 rounded-lg text-lg font-semibold transition-all
              ${
                feedback === 'bad'
                  ? 'bg-darkbrown text-ivory ring-2 ring-pistachio shadow-md'
                  : 'bg-white text-darkbrown border border-darkbrown hover:bg-darkbrown hover:text-ivory'
              }`}
          >
            👎 별로예요
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !feedback} // 피드백이 선택되어야 버튼 활성화
        className="w-full py-2 bg-pistachio text-darkbrown rounded font-semibold transition-colors hover:bg-opacity-80 disabled:bg-pistachio disabled:opacity-50" // 9. 제출 버튼
      >
        {loading ? '평가 중...' : '제출하기'}
      </button>
    </div>
  );
}
