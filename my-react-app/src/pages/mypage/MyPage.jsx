// src/pages/mypage/MyPage.jsx

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { myInfo } from '../../api/my'; // 개인정보 조회 api 함수
import { myLikes } from '../../api/my'; // 좋아요 누른 글 조회 api 함수
import { myPoints } from '../../api/my'; // 포인트 조회 api 함수

export default function MyPage() {
  return <h1>마이페이지</h1>;
}