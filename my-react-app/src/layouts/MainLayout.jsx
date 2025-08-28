// /src/layouts/MainLayout.jsx 
/* colors: {
        pistachio: '#CDE8A6',
        'pistachio-dark': '#B0D99A', // hover
        ivory: '#F9F6EE',   // 배경
*/

import { Outlet } from "react-router-dom";
import BottomNavigation from "src/components/BottomNavigation.jsx"; 

import React from 'react';
/* 리액트 lucide 아이콘 라이브러리 쓸것임!! */
import {
  Book,
  Trophy,
  House,
  MessageCircle,
  User,
  Plus
} from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 상단 고정 헤더 */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-20 h-16 flex items-center justify-center">
        
      </header>

      {/* 메인 콘텐츠: 헤더, 하단바 공간만큼 */}
      <main className="pt-16 pb-20">
        <Outlet />
      </main>

      {/* 하단 고정 네비게이션 바 */}
      <footer className="fixed bottom-0 left-0 w-full z-30">
        <BottomNavigation />
      </footer>
    </div>
  );
}
