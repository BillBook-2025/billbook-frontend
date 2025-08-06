// src/pages/main/Home.jsx
/* ### 홈 화면

- [검색창] - 누르면 max 5개 최근 검색기록 나옴
- [검색 버튼] - 누르면 검색됨
- 카테고리 - [과학][문화][사회][역사] 등등… - 카테고리별 상세페이지로 연결
- 거래 글 리스트
- 하단 바(얘는 BottomNavigation.jsx로 따로 모듈화하여 구현) - [홈화면][추천도서][커뮤니티][채팅][마이페이지] - 각각 클릭 시 리다이렉트
// /src/components/BottomNavigation.jsx

import React from 'react';
리액트 lucide 아이콘 라이브러리 쓸것
import {
  Book,
  Trophy,
  Users,
  MessageCircle,
  User,
  Plus
} from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로를 기준으로 active 아이콘 색상 설정
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50">
      <button
        onClick={() => navigate('/home')}
        className={`flex flex-col items-center ${
          isActive('/home') ? 'text-pistachio' : 'text-gray-600'
        } hover:text-pistachio-dark`}
      >
        <Book className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate('/recommend')}
        className={`flex flex-col items-center ${
          isActive('/recommend') ? 'text-pistachio' : 'text-gray-600'
        } hover:text-pistachio-dark`}
      >
        <Trophy className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate('/community')}
        className={`flex flex-col items-center ${
          isActive('/community') ? 'text-pistachio' : 'text-gray-600'
        } hover:text-pistachio-dark`}
      >
        <Users className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate('/chatList')}
        className={`flex flex-col items-center ${
          isActive('/chatList') ? 'text-pistachio' : 'text-gray-600'
        } hover:text-pistachio-dark`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigate('/mypage')}
        className={`flex flex-col items-center ${
          isActive('/mypage') ? 'text-pistachio' : 'text-gray-600'
        } hover:text-pistachio-dark`}
      >
        <User className="w-6 h-6" />
      </button>

      플로팅 책 등록하기 버튼 (+) 
      <button
        onClick={() => navigate('/postUpload')}
        className="absolute -top-6 right-4 w-14 h-14 rounded-full bg-yellow-300 hover:bg-yellow-200 shadow-lg border-2 border-white flex items-center justify-center z-50"
      >
        <Plus className="w-8 h-8 text-black" />
      </button>
    </nav>
  );
}
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 돋보기 아이콘
import { Search } from 'lucide-react';


export default function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
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

    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedSearches.slice(0, 5));
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    navigate(`/searchResult?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div>
      {/* 검색창처럼 보이는 버튼 */}
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
