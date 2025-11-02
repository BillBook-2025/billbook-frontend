// src/pages/mypage/Manner.jsx
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// API 함수
import { changeTemperature } from "../../api/profile";

export default function Manner() {
  const navigate = useNavigate();
  const { userId: partnerId } = useParams(); // 상대방 userId
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("bookId"); // 책 ID 필요하면 사용

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numericScore = Number(score);
    if (numericScore < 1 || numericScore > 100 || isNaN(numericScore)) {
      alert("1~100 사이 숫자를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await changeTemperature(partnerId, { score: numericScore });
      alert("매너평가가 완료되었습니다!");
      navigate(-1); // 이전 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("평가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">거래 상대방 매너평가</h2>
      <p>책 ID: {bookId}</p>
      <div>
        <label className="block mb-1 font-medium">매너 온도 (1~100)</label>
        <input
          type="number"
          min="1"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded bg-pistachio text-darkbrown font-medium hover:bg-pistachio-dark"
        disabled={loading}
      >
        {loading ? "평가 중..." : "평가 제출"}
      </button>
    </div>
  );
}
