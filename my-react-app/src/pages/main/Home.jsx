// src/pages/main/Home.jsx
/* ### 홈 화면
- [검색 버튼] - 누르면 검색 페이지로 넘어감
- 카테고리 - [과학][문화][사회][역사] 등등… - 카테고리별 상세페이지로 연결
- 거래 글 리스트
- 하단 바(얘는 BottomNavigation.jsx로 따로 모듈화하여 구현) - [홈화면][추천도서][커뮤니티][채팅][마이페이지] - 각각 클릭 시 리다이렉트
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 돋보기 아이콘
import { Search } from 'lucide-react';


export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  // 카테고리는 걍 예시임
  const categories = ['과학', '문화', '사회', '역사'];

  // 책 상태 점수 -> 단어 변환하는 함수
  const getBookCondition = (point) => {
    switch (point) {
     case 3: return '양호';
     case 2: return '보통';
     case 1: return '나쁨';
      default: return '알 수 없음';
   }
  };


  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/books', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } 
      catch (e) {
        console.error('책 목록 로드 실패', e);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div>
      {/* 검색창처럼 보이는 버튼(서치 페이지로 이동 ㅋ) */}
      <button
        onClick={() => navigate('/search')}
        className="w-full max-w-md mx-auto flex items-center justify-between px-4 py-2 border rounded-md text-gray-700 hover:border-pistachio hover:text-pistachio cursor-pointer"
        type="button"
      >
        검색하기
        <Search className="w-5 h-5" />
      </button>

      {/* 카테고리 리스트 */}
      <div className="category-list flex justify-around mt-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className="px-3 py-1 bg-pistachio rounded-full hover:bg-pistachio-dark transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 지금 거래가능한 책 리스트 */}
      <div className="book-list grid grid-cols-2 gap-4 px-4 py-6">
        {books.map(book => (
          <div
            key={book.id}
            onClick={() => navigate(`/bookDetail/${book.id}`)}
            className="border rounded-md p-2 cursor-pointer hover:shadow"
          >
            <img
              src={book.bookPic || '/default_book.png'}
              alt={book.title}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 text-sm font-semibold">{book.title}</div>
            <div className="text-xs text-gray-500">{book.locate?.address}</div>
            <div className="text-xs text-gray-700">상태: {getBookCondition(book.bookPoint)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
