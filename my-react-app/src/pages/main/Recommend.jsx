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
        } else if (res && Array.isArray(res.data)) {
          setBooks(res.data);
        } else {
          console.warn("API 응답이 배열 형식이 아닙니다:", res);
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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">추천 도서</h1>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book.bookId}
            onClick={() => navigate(`/book/${book.bookId}`)}
            className="flex gap-4 items-center cursor-pointer border rounded p-3 hover:bg-gray-100"
          >
            {/* 왼쪽: 책 이미지 */}
            <div className="w-20 h-28 flex-shrink-0 bg-gray-200 rounded overflow-hidden border">
              <img
                src={
                  book.bookPic && book.bookPic.length > 0 
                    ? book.bookPic[0].url 
                    : '/default-book.png'
                }
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = '/default-book.png'}
              />
            </div>

            {/* 텍스트 정보 */}
            <div className="flex flex-col flex-1 gap-1">
              <h3 className="font-bold text-lg leading-tight text-gray-900">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">
                {book.author} | {book.publisher}
              </p>
              
              {/* 추가 정보 (상태, 가격 등) */}
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded font-bold 
                  ${book.cond === 'GOOD' ? 'bg-green-100 text-green-700' : 
                    book.cond === 'FAIR' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {book.cond === 'GOOD' ? '좋음' : book.condition === 'FAIR' ? '보통' : '나쁨'}
                </span>
                {/* 지역 정보가 있다면 표시 */}
                {book.locate && (
                  <span className="text-xs text-gray-400">
                     {book.locate.regionLevel2} {book.locate.regionLevel3}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
