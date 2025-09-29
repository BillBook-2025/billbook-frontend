// src/api/my.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

// 개인정보 조회
// fetch()의 기본 옵션은 { method: 'GET' }이라서 get일때는 메소드 종류 안써도되~
export async function myInfo(userId, token) {
  return fetchWithAuth(`/api/${userId}/my`, {}, token);
}

// 개인정보 수정 (닉네임/이메일)
export async function editMyInfo(userId, data, token) {
  return fetchWithAuth(`/api/${userId}/my`, 
    {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, 
    token);
}

// 내가 좋아요 누른 거래글 목록 조회
export async function myLikes(userId, token, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/api/${userId}/my/like?${queryString}` : `/api/${userId}/my/like`;
  return fetchWithAuth(url, {}, token);
}

// 내가 가진 포인트 조회
export async function myPoints(userId, token) {
  return fetchWithAuth(`/api/${userId}/my/point`, {}, token);
}

// 포인트 변화 (보류 상태, 구현 전)
// export async function changeMyPoints(userId, points, token) {
//   return fetchWithAuth(`/api/${userId}/my/point`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ points }),
//   }, token);
// }
