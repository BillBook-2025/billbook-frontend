// src/pages/mypage/MyBookPost.jsx
/**내가 등록한 책 전체 목록
 * 
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { registeredBooks } from "../../api/profile"; 

export default function MyBookPost() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const userId = userInfo?.userId;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) return;

    registeredBooks(userId, token)
      .then((data) => {
        // 등록일자 기준 정렬(최신순)
        const sorted = [...data].sort((a, b) => new Date(b.time)-new Date(a.time));
        setBooks(sorted);
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  const handleMannerClick = (b) => {
    if (b.status === "RETURNED") {
      // 거래 상대방이 있으면 manner 페이지로 이동
      const otherUserId = b.buyerId || b.sellerId;
      navigate(`/manner/${otherUserId}?bookId=${b.bookId}`);
    } else {
      alert("거래가 완료되지 않은 책 입니다.");
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">내 거래글 전체</h2>

      {books.length === 0 ? (
        <p className="text-gray-500">등록한 거래글이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((b) => (
            <li
              key={b.bookId}
              className="border rounded-lg bg-white shadow hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/books/${b.bookId}`)}
            >
              {/* 책 이미지 */}
              {b.bookPic && b.bookPic.length > 0 ? (
                <img
                  src={b.bookPic}
                  alt={b.title}
                  className="w-full h-40 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-pistachio text-darkbrown text-xl rounded-t">
                  {b.title.slice(0, 1)}
                </div>
              )}

              {/* 책 정보 */}
              <div className="p-3">
                <h3 className="font-semibold text-darkbrown truncate">{b.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{b.author}</p>
                <p className="text-sm text-gray-500 mt-2">
                  등록일: {new Date(b.time).toLocaleDateString("ko-KR")}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  상태: {b.status}
                </p>
                {/* 매너평가 버튼 */}
                <button
                  className={`mt-2 w-full py-1 rounded bg-pistachio text-darkbrown font-medium
                    ${b.status !== "RETURNED" ? "opacity-50 cursor-not-allowed" : "hover:bg-pistachio-dark"}
                  `}
                  onClick={(e) => {
                    e.stopPropagation(); // li 클릭 방지
                    if (b.status !== "RETURNED") {
                      alert("거래가 완료되지 않은 책 입니다.");
                    } else {
                      // buyerId 또는 sellerId 기준으로 상대방 평가
                      const partnerId = b.sellerId === userId ? b.buyerId : b.sellerId;
                      // 거래 상대방 아이디를 partnerId로 지정해서 매너평가 페이지로 전달함
                      navigate(`/manner/${partnerId}?bookId=${b.bookId}`);
                   }
                  }}
                >
                  매너평가
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
