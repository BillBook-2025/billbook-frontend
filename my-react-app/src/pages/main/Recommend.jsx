// src/pages/main/Recommend.jsx
/**### 추천도서

- 주간 인기 도서
- 추천 도서
- [도서] - 책 정보 보여주는 페이지
- (거래 글 리스트: 검색해서 나온 결과랑 똑같게 나타남)
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { fetchRecommendedBooks } from "../../api/ml";
// 아이콘
import { ChevronRight, Book } from "lucide-react";

export default function Recommend() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getRecommended() {
      try {
        const res = await fetchRecommendedBooks();
        console.log("추천 도서 API 응답 확인:", res);

        if (Array.isArray(res)) { 
          setBooks(res);
        } else if (res && Array.isArray(res.results)) { 
          setBooks(res.results);
        } else if (res && Array.isArray(res.data)) { 
          setBooks(res.data);
        } else {
          console.warn("API 응답이 예상한 배열/객체 형식이 아닙니다:", res);
          setBooks([]);
        }
      } 
      catch (err) {
        console.error("추천 도서 불러오기 실패:", err);
        setBooks([]);
      }
    }
    getRecommended();
  }, []);

 if (!Array.isArray(books) || books.length === 0) {
    return <p className="p-4 text-center text-gray-500">추천 도서가 없습니다.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-darkbrown border-l-4 border-pistachio pl-3">
          추천 도서
        </h1>
        <span className="text-sm text-gray-500 font-medium">총 {books.length}권</span>
      </div>

      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book.bookId}
            // 클릭 이벤트 (상세 페이지 이동 등)
            className="group relative flex gap-5 items-start p-4 bg-white rounded-2xl border border-pistachio/50 shadow-md cursor-pointer overflow-hidden transition-transform active:scale-95"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pistachio/20 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>

            {/* 책 이미지 */}
            <div className="w-24 h-36 flex-shrink-0 bg-gray-100 rounded-lg shadow-sm overflow-hidden relative z-10 border border-gray-100">
              {book.bookPic && book.bookPic.length > 0 ? (
                <img
                  src={book.bookPic[0].url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-book.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                  <Book size={32} strokeWidth={1.5} />
                </div>
              )}
            </div>

            {/* 텍스트 정보 */}
            <div className="flex flex-col flex-1 py-1 z-10 h-36 justify-between">
              <div>
                <h3 className="font-bold text-lg text-darkbrown leading-snug line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {book.publisher || '출판사 미상'}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-pistachio-dark text-xs mr-2">저자</span>
                  {book.author}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* 데이터가 없을 경우 */}
      {books.length === 0 && (
         <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-pistachio/30">
            <p>추천 도서가 없습니다.</p>
         </div>
      )}
    </div>
  );
}