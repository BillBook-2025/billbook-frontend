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
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50">
      <button className="flex flex-col items-center text-pistachio hover:text-pistachio-dark">
        <Book className="w-6 h-6" />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-pistachio">
        <Trophy className="w-6 h-6" />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-pistachio">
        <Users className="w-6 h-6" />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-pistachio">
        <MessageCircle className="w-6 h-6" />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-pistachio">
        <User className="w-6 h-6" />
      </button>

      {/* 책 등록하기 버튼 (+) */}
      <button className="absolute -top-6 right-4 w-14 h-14 rounded-full bg-yellow-300 hover:bg-yellow-200 shadow-lg border-2 border-white flex items-center justify-center z-50">
        <Plus className="w-8 h-8 text-black" />
      </button>
    </nav>
  );
}

