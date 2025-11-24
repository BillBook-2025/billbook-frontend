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
import { logout } from '../../api/auth';

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  // 로그아웃
  const handleLogout = async () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      try {
        await logout();
        alert('로그아웃되었습니다.');

        navigate('/login'); // 로그인 페이지로 이동
      } catch (error) {
        console.error('로그아웃 실패:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    }
  };

  // 일단 전체 글 목록 불러옴
  useEffect(() => {
    async function fetchPosts() {
      try {
        // 현재 거래 가능한 글 불러오기
        const data = await bookList();
        const availableBooks = Array.isArray(data) 
          ? data.filter(book => book.status === 'PENDING')
          : [];

        setBooks(availableBooks);

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

  /*
  const handleNearbySearch = () => {
    setIsLoadingNearby(true); // 로딩 시작

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // 3. 현재 위치(lat, lng)로 fetchPosts 함수 호출!
          fetchPosts(lat, lng); 
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다.", error);
          alert("위치 정보 사용을 허용해주세요.");
          setIsLoadingNearby(false); // 로딩 중단
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      setIsLoadingNearby(false); // 로딩 중단
    }
  };
  */

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      
      {/* 상단 헤더 (로고, 검색 버튼, 로그아웃) */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="w-full px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
          {/* 로고/타이틀 */}
          <h1 className="text-2xl font-extrabold text-darkbrown">
            BillBook
          </h1>

          <div className="flex items-center space-x-3">
            {/* 검색 버튼 */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 bg-pistachio text-white rounded-full shadow-md hover:bg-opacity-90 transition duration-200 ease-in-out transform hover:scale-105"
              type="button"
              aria-label="검색하기"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-darkbrown text-sm py-1 px-3 rounded-full hover:bg-gray-200 transition font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {/* 카테고리 */}
        <div className="w-full mt-4 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex space-x-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/category/${cat}`)}
                className="px-4 py-2 bg-pistachio text-white font-medium rounded-lg shadow-sm hover:bg-darkbrown transition flex-shrink-0"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* --- */}

        {/* 책 리스트 */}
        <h2 className="text-xl font-bold text-gray-800 px-4 mt-6 mb-3 border-l-4 border-pistachio pl-3">
          지금 거래 가능한 책
        </h2>
        <div className="book-list grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 pb-6">
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
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer 
                           hover:shadow-xl hover:scale-[1.02] transition duration-300 ease-in-out border border-gray-100"
              >
                {thumbnailUrl ? (
                  // 썸네일 이미지가 있으면 보여줌
                  <img
                    src={thumbnailUrl}
                    alt={book.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  // 이미지 없으면 아이콘
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <BookImage
                      className="w-16 h-16 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="text-sm font-bold text-gray-800 truncate mb-1">
                    {book.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {(book.locate || book.location)?.address}
                  </div>
                  <div className="text-xs font-medium text-darkbrown mt-1">
                    상태: {book.cond}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 하단 바 공간 확보 */}
    </div>
  );
}