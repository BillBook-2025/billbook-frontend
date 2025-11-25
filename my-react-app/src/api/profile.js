// src/api/profile.js

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// 프로필 조회
export async function fetchProfile(userId) {
  return fetchWithAuth(`/profile/${userId}`, {});
}

// 팔로워 조회
export async function fetchFollowers(userId) {
  return fetchWithAuth(`/profile/${userId}/follower`, {});
}

// 팔로잉 목록 조회
export async function fetchFollowings(userId) {
  return fetchWithAuth(`/profile/${userId}/following`, {});
}

// 팔로우 추가
export async function addFollowing(userId, followUserId) {
  return fetchWithAuth(`/profile/${userId}/following`, 
    { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: followUserId }),
    }
  );
}

// 팔로우 취소
export async function unfollowUser(userId, followUserId) {
  return fetchWithAuth(`/profile/${userId}/following`, 
    { method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: followUserId }),
    }
  );
}

// 매너온도
export async function changeTemperature(userId, data) {
  return fetchWithAuth(`/profile/${userId}/temperature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), 
  });
}

/**
 * 추가 옵션을 쿼리 파라미터로 받을 수 있어서
 * 그걸 지원하기 위해서 쿼리 파라미터 객체를 받아서 URL에 붙이는 로직을 넣음
 */

// 해당 유저가 빌린 책 목록 조회
export async function borrowedBooks(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/profile/${userId}/buy}?${query}` : `/profile/${userId}/buy`;
  return fetchWithAuth(url, {});
}

// 해당 유저가 등록한 책 목록 조회
export async function registeredBooks(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/profile/${userId}/sell?${query}` : `/profile/${userId}/sell`;
  return fetchWithAuth(url, {});
}

// 해당 유저와의 책 거래 횟수 조회
export async function dealCount(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/profile/${userId}/history?${query}` : `/profile/${userId}/history`;
  return fetchWithAuth(url, {});
}


// 유저가 쓴 (커뮤)게시글 조회
export async function userBoards(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/profile/${userId}/boards?${query}` : `/profile/${userId}/boards`;
  return fetchWithAuth(url, {});
}

// 프로필 이미지 등록
export async function uploadProfileImage(userId, formData) {
  return fetchWithAuth(`/profile/${userId}/image`, 
    {
      method: 'POST',
      headers: {},
      body: formData,
    }
  );
}
