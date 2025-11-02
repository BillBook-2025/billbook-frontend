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
import { registerBook, fetchBookInfo } from "../../api/books";
import { XCircle } from 'lucide-react';

export default function PostUpload() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 책 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // 이름 기준으로 검색, API에서 이름 정확도 순으로 정렬
      const books = await fetchBookInfo({ keyword: searchQuery });
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
     // 새로 추가된 파일만
    const newImages = [...images, ...files];
    setImages(newImages);

    // 새로 추가된 파일에 대한 미리보기 URL 생성
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // 이미지 삭제
  const handleRemoveImage = (indexToRemove) => {
    // images state에서 제거
    setImages(images.filter((_, index) => index !== indexToRemove));

    // imagePreviews state에서 제거
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(newPreviews);
    
    // 메모리 누수 방지를 위해 사용이 끝난 URL 해제
    // 이 작업은 컴포넌트가 unmount될 때 useEffect에서 처리하는 것이 더 안정적일 수 있으나,
    // CommunityUpload.jsx의 로직을 그대로 따릅니다.
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
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
    setError("");

    const formData = new FormData();

    // *** 1. API 문서(BookPostRequestDto)에 맞는 JSON 객체 생성 ***
    const bookData = {
      // selectedBook 객체에서 가져올 정보
      title: selectedBook.title,
      author: selectedBook.author,
      publisher: selectedBook.publisher, // selectedBook에 이 정보가 있어야 합니다.
      category: selectedBook.category,   // selectedBook에 이 정보가 있어야 합니다.
      isbn: selectedBook.id,           // book.id가 isbn이라고 가정합니다.

      // state에서 가져올 정보
      content: description, // ❌ 'description'이 아니라 'content'
      
      // ⚠️ 'location' (문자열)을 API의 'locate' (객체)로 변환해야 합니다.
      // 지금은 'location' 문자열을 'address'에만 넣습니다.
      locate: {
        address: location || "미지정", 
        latitude: 0.0, // 카카오맵 API 연동 전 임시값
        longitude: 0.0, // 카카오맵 API 연동 전 임시값
        regionLevel1: "",
        regionLevel2: "",
        regionLevel3: ""
      },

      // DTO에 있지만 현재 폼에서 입력받지 않는 값
      bookpoint: 1000 // 예제 DTO의 기본값 1000 사용
    };

    // *** 2. JSON을 Blob으로 변환 ***
    const jsonData = JSON.stringify(bookData);
    const jsonBlob = new Blob([jsonData], {
      type: 'application/json' 
    });

    // *** 3. ❌ 'data'가 아닌 'book' 키로 FormData에 추가 ***
    formData.append('book', jsonBlob); 

    // *** 4. 이미지 파일 추가 ('images' 키) ***
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      // [PostUpload.jsx:91]
      await registerBook(formData); 
      navigate("/home"); 
    } catch (err) {
      console.error(err);
      // [PostUpload.jsx:94]
      setError("등록 중 오류가 발생했습니다."); 
    } finally {
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
            {searchResults.map((book, index) => (
              <li
                key={book.id || index}
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
        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md">
            {imagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={previewUrl}
                  alt={`preview ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
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