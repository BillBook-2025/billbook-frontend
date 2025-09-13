// src/pages/main/PostEdit.jsx
/**
 * 이미 올린 게시글 수정하는 페이지... 인데 
 사실상 업로드페이지PostUpload.jsx랑 똑같아서 
 (다른점은, 수정화면은 이미 입력해둔 게시글 정보가 있는 상태로 수정할수있는거고. 업로드는 그냥 빈칸에서 채워서 업로드...) 
 이걸 합쳐야할지??
 
- [사진 등록]
- 제목은 자동으로 책 제목과 동일하게 설정
- 책 선택 ? (이름 검색으로 리스트중에 정해서 선택하면. 그 책 정보가 api를통해 자동으로 들어오게)
- [상세 설명]
- [지역 설정하기]
 */
// PostUpload 랑 거의 동일한데 기존 게시글 데이터 불러오는거만 추가하면됨

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// API 함수
import {  bookDetail, modifyBook, searchBook } from '../../api/books';

export default function PostEdit({}) {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [bookSearch, setBookSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await bookDetail(bookId, token);
        setSelectedBook(post);
        setContent(post.content);
        setLocation(post.location);
        setBookSearch(post.title);
      } catch (err) {
        setError('게시글 로드 실패');
      }
    }
    fetchPost();
  }, [bookId, token]);

  // 책 검색
  const handleSearch = async () => {
    if (!bookSearch.trim()) return;
    try {
      const results = await searchBook({ keyword: bookSearch }, token);
      setSearchResults(results);
    } catch (err) {
      setError('책 검색 실패');
    }
  };

  // 책 선택한 후 정보 반영
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setBookSearch(`${book.title} - ${book.author}`);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return setError('책을 선택해주세요');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('bookId', selectedBook.id);
      formData.append('content', content);
      formData.append('location', location);
      images.forEach((img) => formData.append('images', img));

      await modifyBook( bookId,
        { bookId: selectedBook.id, content, location },
        [],       // 삭제할 이미지 없으면 빈 배열
        images,   // 새로 업로드할 이미지
        token
      );

      alert('게시글 수정 완료');
      navigate(`/post/${bookId}`);
    } catch (err) {
      setError('수정 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>

      {/* 책 검색 */}
      <input
        type="text"
        placeholder="책 검색"
        value={bookSearch}
        onChange={(e) => setBookSearch(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button type="button" onClick={handleSearch}>
        검색
      </button>

      {searchResults.length > 0 && (
        <ul className="border mt-2">
          {searchResults.map((book) => (
            <li key={book.id} onClick={() => handleSelectBook(book)}>
              {book.title} - {book.author}
            </li>
          ))}
        </ul>
      )}

      {/* 선택된 책 표시 */}
      {selectedBook && <p>선택된 책: {selectedBook.title}</p>}

      {/* 설명 */}
      <textarea
        placeholder="상세 설명"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      {/* 위치 */}
      <input
        type="text"
        placeholder="위치"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      {/* 이미지 업로드 */}
      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files))}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 p-2 bg-pistachio rounded"
      >
        {isSubmitting ? '수정 중...' : '수정 완료'}
      </button>
    </form>
  );
}
