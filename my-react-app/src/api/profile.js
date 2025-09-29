// src/api/profile.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

// 프로필 조회
export async function fetchProfile(userId, token) {
  return fetchWithAuth(`/api/profile/${userId}`, {}, token);
}

// 팔로워 조회
export async function fetchFollowers(userId, token) {
  return fetchWithAuth(`/api/profile/${userId}/follower`, {}, token);
}

// 팔로잉 목록 조회
export async function fetchFollowings(userId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following`, {}, token);
}

// 팔로우 추가
export async function addFollowing(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following`, 
    { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: followUserId }),
    }, token
  );
}

// 팔로우 취소
export async function unfollowUser(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following`, 
    { method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: followUserId }),
    }, token
  );
}

// 매너온도
export async function changeTemperature(userId, data, token) {
  return fetchWithAuth(`/api/profile/${userId}/temperature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // 예: {score: 5}
  }, token);
}

/**
 * 추가 옵션을 쿼리 파라미터로 받을 수 있어서
 * 그걸 지원하기 위해서 쿼리 파라미터 객체를 받아서 URL에 붙이는 로직을 넣음
 */

// 해당 유저가 빌린 책 목록 조회
export async function borrowedBooks(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/buy?${query}` : `/api/profile/${userId}/buy`;
  return fetchWithAuth(url, {}, token);
}

// 해당 유저가 등록한 책 목록 조회
export async function registeredBooks(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/sell?${query}` : `/api/profile/${userId}/sell`;
  return fetchWithAuth(url, {}, token);
}

// 해당 유저와의 책 거래 횟수 조회
export async function dealCount(userId, params = {}, token) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/history?${query}` : `/api/profile/${userId}/history`;
  return fetchWithAuth(url, {}, token);
}


// 유저가 쓴 (커뮤)게시글 조회
export async function userBoards(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/boards?${query}` : `/api/profile/${userId}/boards`;
  return fetchWithAuth(url, {}, token);
}

// 프로필 이미지 등록
export async function uploadProfileImage(userId, imageUrl, token) {
  return fetchWithAuth(`/api/profile/${userId}/image`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profilePic: imageUrl })
    },token
  );
}
