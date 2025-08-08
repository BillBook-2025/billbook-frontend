// src/api/profile.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

async function fetchWithAuth(url, options = {}, token) {
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(API_BASE_URL + url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
}

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

// 팔로잉 추가
export async function addFollowing(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following`, 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: followUserId }),
    }, 
    token);
}

// 팔로잉 삭제
export async function removeFollowing(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following`, 
    {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: followUserId }),
    }, 
    token);
}

// 매너 온도 변화
export async function changeTemperature(userId, token) {
  return fetchWithAuth(`/api/profile/${userId}/temperature`, 
    {
        method: 'POST',
    }, 
    token);
}

/**
 * 추가 옵션을 쿼리 파라미터로 받을 수 있어서
 * 그걸 지원하기 위해서 쿼리 파라미터 객체를 받아서 URL에 붙이는 로직을 넣음
 */

// 해당 유저가 빌린 책 목록 조회
export async function borrowedBooks(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/borrow?${query}` : `/api/profile/${userId}/borrow`;
  return fetchWithAuth(url, {}, token);
}

// 해당 유저가 등록한 책 목록 조회
export async function registeredBooks(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/register?${query}` : `/api/profile/${userId}/register`;
  return fetchWithAuth(url, {}, token);
}

// 해당 유저와의 책 거래 횟수 조회
export async function dealCount(userId, token) {
  return fetchWithAuth(`/api/profile/${userId}/history`, {}, token);
}

// 유저가 쓴 게시글 조회
export async function userBoards(userId, token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/profile/${userId}/boards?${query}` : `/api/profile/${userId}/boards`;
  return fetchWithAuth(url, {}, token);
}

// 프로필 사진 등록
export async function uploadProfileImage(userId, profilePicUrl, token) {
  return fetchWithAuth(`/api/profile/${userId}/image`, 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePic: profilePicUrl }),
    }, 
    token);
}
