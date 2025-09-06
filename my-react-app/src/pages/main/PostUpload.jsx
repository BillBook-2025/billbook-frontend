// src/pages/main/PostUpload.jsx
/**### 거래글 업로드

- [사진 등록]
- 제목은 자동으로 책 제목과 동일하게 설정
- 책 선택 ? (이름 검색으로 리스트중에 정해서 선택하면. 그 책 정보가 api를통해 자동으로 들어오게)
- [상세 설명]
- [지역 설정하기] - 카카오맵 api 를 프런트에서 가져와서 백으로 위치를 넘겨주기
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { registerBook, searchBook } from "../../api/books";

export default function PostUpload() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // 토큰 가져오기

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 책 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // 이름 기준으로 검색, API에서 이름 정확도 순으로 정렬
      const books = await searchBook({ keyword: searchQuery }, token);
      setSearchResults(books);
    } 
    catch (err) {
      console.error("책 검색 실패", err);
    }
  };

  // 책 선택
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    // 제목-저자 표시
    setSearchQuery(`${book.title} - ${book.author}`);
    setSearchResults([]);
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // 게시글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedBook) {
      setError("책을 선택해주세요.");
      return;
    }

    if (!description.trim()) {
      setError("상세 설명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("bookId", selectedBook.id);
      formData.append("title", selectedBook.title);
      formData.append("description", description);
      formData.append("location", location);

      images.forEach((img) => formData.append("images", img));

      await registerBook(
        { bookId: selectedBook.id, title: selectedBook.title, description, location },
        images,
        token
      );
      alert("게시글 등록 완료");
      navigate("/home");
    } 
    catch (err) {
      console.error("게시글 등록 실패", err);
      setError("등록 중 오류가 발생했습니다.");
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">거래글 업로드</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="책 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-pistachio text-black rounded"
          type="button"
        >
          검색
        </button>

        {/* 검색 결과 리스트 */}
        {searchResults.length > 0 && (
          <ul className="border mt-2 max-h-40 overflow-auto">
            {searchResults.map((book) => (
              <li
                key={book.id}
                onClick={() => handleSelectBook(book)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{book.title}</span>
                <span className="text-gray-500 text-sm">{book.author}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={selectedBook?.title || ""}
          placeholder="책 제목"
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
        <textarea
          placeholder="상세 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="위치 입력"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input type="file" multiple onChange={handleImageChange} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-semibold"
        >
          {isSubmitting ? "등록 중..." : "게시글 등록"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}