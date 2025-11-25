// src/pages/mypage/MyBookPost.jsx
/** 내가 등록한 책 전체 목록 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react"; 
// API 함수
import { registeredBooks } from "../../api/profile"; 

export default function MyBookPost() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
  const userId = userInfo?.id;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
        setLoading(false);
        return;
    }

    registeredBooks(userId)
      .then((data) => {
        const list = data.data?.books || data.books || (Array.isArray(data) ? data : []);
        // 최신순 정렬
        const sorted = [...list].sort((a, b) => new Date(b.time || b.createdAt) - new Date(a.time || a.createdAt));
        setBooks(sorted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  // 매너평가 버튼
  const handleMannerClick = (e, b) => {
    // 반납상태일때만 활성화
    if (b.status !== "RETURNED") {
        return; 
    }

    // 상대방 ID 계산
    const myId = Number(userId);
    const sellerId = Number(b.sellerId);
    const buyerId = Number(b.buyerId);
    const partnerId = (sellerId === myId) ? buyerId : sellerId;

    if (partnerId === myId) {
        alert("자기 자신은 평가할 수 없습니다.");
        return;
    }

    if(partnerId) {
        navigate(`/manner/${partnerId}?bookId=${b.bookId}`);
    } else {
        alert("평가할 상대방 정보를 찾을 수 없습니다.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. 상단 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-darkbrown"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-extrabold text-darkbrown">나의 서재 (내가 올린 책)</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6 flex items-end gap-2 px-1">
            <h2 className="text-xl font-bold text-gray-800">전체 목록</h2>
            <span className="text-pistachio-dark font-bold mb-1">{books.length}권</span>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 mx-2">
            <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">등록한 거래글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((b) => (
              <div
                key={b.bookId}
                onClick={() => navigate(`/post/${b.bookId}`)} 
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group"
              >
                {/* 책 이미지 영역 */}
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  {b.bookPic && b.bookPic.length > 0 ? (
                    <img
                      src={b.bookPic[0].url || b.bookPic}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <BookOpen className="w-10 h-10 opacity-50" />
                    </div>
                  )}
                  {/* 상태 뱃지 */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm
                        ${b.status === 'AVAILABLE' ? 'bg-pistachio text-darkbrown' : 
                          b.status === 'BORROWING' || b.status === 'TRADING' ? 'bg-blue-100 text-blue-600' :
                          b.status === 'RETURNED' ? 'bg-darkbrown text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                        {b.status === 'AVAILABLE' ? '거래가능' : b.status}
                    </span>
                  </div>
                </div>

                {/* 책 정보 영역 */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-darkbrown text-base line-clamp-1 mb-1">{b.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-3">{b.author}</p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-50">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 mb-3">
                        <span>{new Date(b.time || b.createdAt).toLocaleDateString("ko-KR")}</span>
                        <span>조회수 {b.views || 0}</span>
                    </div>

                    {/* 매너평가 버튼 */}
                    <button
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-colors
                            ${b.status === "RETURNED" 
                                ? "bg-darkbrown text-white hover:bg-black shadow-sm" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                        `}
                        onClick={(e) => handleMannerClick(e, b)}
                    >
                        {b.status === "RETURNED" ? "매너평가 하기" : "거래 진행중"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}