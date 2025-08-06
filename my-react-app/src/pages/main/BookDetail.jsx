// src/pages/main/BookDetail.jsx
/* ### 책 상세정보 페이지

- 책정보 api
- [대여하기]- 검색하면 나오는 페이지로 리다이렉트
*/
import { useNavigate } from "react-router-dom";

export default function BookDetail({ book }) {
  const navigate = useNavigate();

  const handleRent = () => {
    navigate(`/searchresult?query=${encodeURIComponent(book.title)}`);
  };

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <button onClick={handleRent}>대여하기</button>
    </div>
  );
}