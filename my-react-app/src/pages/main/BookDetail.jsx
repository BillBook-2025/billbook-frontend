// src/pages/main/BookDetail.jsx
/* ### 책 상세정보 페이지

- 책정보 api
- [대여하기]- 검색하면 나오는 페이지로 리다이렉트
*/
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BookDetail() {
  const { bookId } = useParams(); // URL param으로 책 ID 받는다고 가정
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  // BookDetail 컴포넌트에서 bookId(또는 검색 키워드 등)를 받아서
  // 백에서 인터파크api 받아와서 구현해놨다고 하니까 그걸 받아서 쓰기만하면됨

  useEffect(() => {
    if (!bookId) return;

    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
      .then((res) => res.json())
      .then((data) => {
        // 구글 북스 API 응답 구조에 맞게 필요한 정보만 추출
        const volumeInfo = data.volumeInfo || {};
        setBook({
          title: volumeInfo.title,
          authors: volumeInfo.authors?.join(", "),
          description: volumeInfo.description,
          thumbnail: volumeInfo.imageLinks?.thumbnail,
          categories: volumeInfo.categories?.join(", "),
          publishedDate: volumeInfo.publishedDate,
          // 필요시 더 추가
        });
      })
      .catch((err) => {
        console.error("책 정보 로드 실패:", err);
        setBook(null);
      });
  }, [bookId]);

  if (!book) return <p>책 정보를 불러오는 중입니다...</p>;

  const handleRent = () => {
    navigate(`/searchresult?query=${encodeURIComponent(book.title)}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-sm text-gray-600 mb-1">저자: {book.authors}</p>
      <p className="text-sm text-gray-600 mb-1">카테고리: {book.categories}</p>
      <p className="text-sm text-gray-600 mb-1">출판일: {book.publishedDate}</p>
      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={`${book.title} 표지`}
          className="w-40 h-52 object-cover rounded mb-4"
        />
      )}
      <p className="mb-4">{book.description}</p>

      <button
        onClick={handleRent}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        대여하기
      </button>
    </div>
  );
}
