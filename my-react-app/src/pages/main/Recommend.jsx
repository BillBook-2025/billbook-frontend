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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">추천 도서</h1>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book.bookId}
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
