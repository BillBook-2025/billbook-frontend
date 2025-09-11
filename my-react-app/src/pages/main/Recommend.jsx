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
        setBooks(res || []); // API에서 반환된 배열이 없으면 빈 배열
      } 
      catch (err) {
        console.error("추천 도서 불러오기 실패:", err);
        setBooks([]);
      }
    }

    getRecommended();
  }, []);

  if (books.length === 0) return <p className="p-4 text-center text-gray-500">추천 도서가 없습니다.</p>;

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
            <img
              src={book.book_pic}
              alt={book.title}
              className="w-16 h-20 object-cover rounded"
            />

            {/* 오른쪽: 제목 + 저자 */}
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
