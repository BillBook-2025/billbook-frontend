// src/api/my.js

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// 개인정보 조회
// fetch()의 기본 옵션은 { method: 'GET' }이라서 get일때는 메소드 종류 안써도되~
export async function myInfo(userId) {
  return fetchWithAuth(`/${userId}/my`, {});
}

// 개인정보 수정 (닉네임/이메일)
export async function editMyInfo(userId, data) {
  return fetchWithAuth(`/${userId}/my`, 
    {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

// 내가 좋아요 누른 거래글 목록 조회
export async function myLikes(userId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/${userId}/my/like?${queryString}` : `/${userId}/my/like`;
  return fetchWithAuth(url, {});
}

// 내가 가진 포인트 조회
export async function myPoints(userId) {
  return fetchWithAuth(`/${userId}/my/point`, {});
}

// 포인트 변화 (보류 상태, 구현 전)
// export async function changeMyPoints(userId, points, token) {
//   return fetchWithAuth(`/api/${userId}/my/point`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ points }),
//   }, token);
// }
