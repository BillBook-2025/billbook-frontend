// /src/components/BottomNavigation.jsx

import React from 'react';
/* 리액트 lucide 아이콘 라이브러리 쓸것임!! */
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
  // 현재 위치(location.pathname)와 각 버튼의 경로(path)를 비교해서 현재 페이지인지 여부를 판단
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

      {/* 플로팅 책 등록하기 버튼 (+) */}
      <button
        onClick={() => navigate('/postUpload')}
        className="absolute -top-6 right-4 w-14 h-14 rounded-full bg-yellow-300 hover:bg-yellow-200 shadow-lg border-2 border-white flex items-center justify-center z-50"
      >
        <Plus className="w-8 h-8 text-black" />
      </button>
    </nav>
  );
}