// /src/components/BottomNavigation.jsx

import { useNavigate, useLocation } from 'react-router-dom';

/* 리액트 lucide 아이콘 라이브러리 쓸것임!! */
import {
  Book,
  Trophy,
  House,
  MessageCircle,
  User,
  Plus
} from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로를 기준으로 active 아이콘 색상 설정
  // 현재 위치(location.pathname)와 각 버튼의 경로(path)를 비교해서 현재 페이지인지 여부를 판단
  const isActive = (path) => location.pathname === path;

  const handleFloatingClick = () => {
    // 페이지 당 다른 +버튼 ㅣ기능임!!
    if (location.pathname.startsWith('/community')) {
      // 커뮤니티 페이지면 커뮤 글 작성 페이지로 이동
      navigate('/communityUpload');
    } else {
      // 그 외 모든 페이지(홈, 마이페이지 등)에서는 책 등록 페이지로 이동
      navigate('/postUpload');
    }
  };

  const isChatRoom = location.pathname.startsWith('/chatRoom');

  return (
    <>
      {/* 만능 플로팅 버튼 (+) */}
      {!isChatRoom && (
        <button
          onClick={handleFloatingClick}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-yellow-300 hover:bg-yellow-200 shadow-lg flex items-center justify-center z-50 transition-transform active:scale-95"
        >
          <Plus className="w-8 h-8 text-black" />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50">
        {/**홈화면으로 이동 */}
        <button
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center ${
           isActive('/home') ? 'text-pistachio' : 'text-gray-600'
          } hover:text-pistachio-dark`}
        >
          <Book className="w-6 h-6" />
        </button>

        {/**추천도서로 이동 */}
        <button
          onClick={() => navigate('/recommend')}
          className={`flex flex-col items-center ${
            isActive('/recommend') ? 'text-pistachio' : 'text-gray-600'
          } hover:text-pistachio-dark`}
        >
          <Trophy className="w-6 h-6" />
        </button>

        {/**커뮤니티로 이동 */}
        <button
          onClick={() => navigate('/community')}
          className={`flex flex-col items-center ${
            isActive('/community') ? 'text-pistachio' : 'text-gray-600'
          } hover:text-pistachio-dark`}
        >
          <House className="w-6 h-6" />
        </button>

        {/**채팅목록으로 이동 */}
        <button
          onClick={() => navigate('/chatList')}
          className={`flex flex-col items-center ${
            isActive('/chatList') ? 'text-pistachio' : 'text-gray-600'
          } hover:text-pistachio-dark`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/**마이페이지로 이동 */}
        <button
          onClick={() => navigate('/mypage')}
          className={`flex flex-col items-center ${
            isActive('/mypage') ? 'text-pistachio' : 'text-gray-600'
          } hover:text-pistachio-dark`}
        >
          <User className="w-6 h-6" />
        </button>
      </nav>
    </>
  );
}