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
import { Search, BookImage } from 'lucide-react';
// api 함수
import { bookList } from '../../api/books';

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  // 책 상태 점수 -> 단어 변환하는 함수
  const getBookCondition = (point) => {
    switch (point) {
      case 3:
        return '좋음';
      case 2:
        return '보통';
      case 1:
        return '나쁨';
      default:
        return '알 수 없음';
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        // 현재 거래 가능한 글 불러오기
        const data = await bookList();
        setBooks(data);

        // 거래글에서 카테고리 추출 (중복 제거, null 제거)
        const uniqueCategories = Array.from(
          new Set(data.map((post) => post.category))
        ).filter(Boolean);
        setCategories(uniqueCategories);
      } catch (e) {
        console.error('거래글 목록 로드 실패', e);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="pb-20">
      {' '}
      {/* 하단 바 공간 확보 */}
      {/* 검색창처럼 보이는 버튼(서치 페이지로 이동 ㅋ) */}
      <button
        onClick={() => navigate('/search')}
        className="w-full max-w-md mx-auto flex items-center justify-between mt-3 px-4 py-2 border-2 border-darkbrown rounded-md bg-pistachio text-darkbrown cursor-pointer"
        type="button"
      >
        검색하기
        <Search className="w-5 h-5" />
      </button>
      {/* 카테고리 리스트 */}
      <div className="category-list flex justify-around mt-4">
        {categories.map((cat) => (
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
        {books.map((book) => {
          // 이미지 존재하느지
          const thumbnailUrl =
            book.bookPic &&
            Array.isArray(book.bookPic) &&
            book.bookPic.length > 0
              ? book.bookPic[0].url // 썸네일 = 첫 번째 이미지
              : null; // 이미지가 없으면 null

          return (
            <div
              key={book.bookId}
              // book 클릭 시 book.bookId 참조
              onClick={() => navigate(`/post/${book.bookId}`)}
              className="border rounded-md p-2 cursor-pointer hover:bg-pistachio"
            >
              {thumbnailUrl ? (
                // 썸네일 이미지가 있으면 보여줌
                <img
                  src={thumbnailUrl}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                // 이미지 없으면 아이콘
                <div className="w-full h-40 rounded bg-gray-50 flex items-center justify-center">
                  <BookImage
                    className="w-16 h-16 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
              )}
              <div className="mt-2 text-sm font-semibold">{book.title}</div>
              <div className="text-xs text-gray-500">
                {book.locate?.address}
              </div>
              <div className="text-xs text-gray-700">
                상태: {getBookCondition(book.bookpoint)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
