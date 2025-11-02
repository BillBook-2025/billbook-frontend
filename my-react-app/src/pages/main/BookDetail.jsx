// src/pages/main/BookDetail.jsx
/* ### 책 상세정보 페이지

- 책정보 api
- [대여하기]- 검색하면 나오는 페이지로 리다이렉트
*/
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// API 함수
import { bookDetail } from "../../api/books";

export default function BookDetail() {
  const { bookId } = useParams(); 

  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  // BookDetail 컴포넌트에서 bookId(또는 검색 키워드 등)를 받아서
  // 백에서 인터파크api 받아와서 구현해놨다고 하니까 그걸 받아서 쓰기만하면됨

  useEffect(() => {
    if (!bookId ) return;

    bookDetail(bookId)
      .then((data) => {
        // 서버 API 응답 구조에 맞게 필요한 정보만 추출
        setBook({
          title: data.title,
          author: data.author,
          content: data.content,
          thumbnail: data.bookPic,
          category: data.category,
          time: data.time,
        });
      })
      .catch((err) => {
        console.error("책 정보 로드 실패:", err);
        setBook(null);
      });
  }, [bookId]);

  if (!book) return <p>책 정보를 불러오는 중입니다...</p>;

  // // 책 제목을 검색어로 사용해서 SearchResult 페이지로 이동
  const handleRent = () => {
    navigate(`/searchresult?query=${encodeURIComponent(book.title)}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-sm text-gray-600 mb-1">저자: {book.author}</p>
      <p className="text-sm text-gray-600 mb-1">카테고리: {book.category}</p>
      <p className="text-sm text-gray-600 mb-1">출판일: {book.time}</p>
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={`${book.title} 표지`}
          className="w-40 h-52 object-cover rounded mb-4"
        />
      )}
      <p className="mb-4">{book.content}</p>

      <button
        onClick={handleRent}
        className="px-4 py-2 bg-pistachio text-gray-800 rounded hover:bg-pistachio-dark"
      >
        대여하기
      </button>
    </div>
  );
}
