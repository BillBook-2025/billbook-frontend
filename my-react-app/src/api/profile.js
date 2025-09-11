// src/api/profile.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

async function fetchWithAuth(url, options = {}, token) {
  /**
   * url: 요청할 API 경로 (예: /api/books)
   * options: fetch 함수에 넣는 옵션(HTTP 메서드, 바디, 헤더 등)
   * token: 인증용 토큰 (없을 수도 있음)
   */
  const headers = options.headers ? { ...options.headers } : {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(API_BASE_URL + url, { ...options, headers });

  // 응답이 ok가 아닐 경우
  if (!response.ok) {
    const text = await response.text();
    let errorContent;
    try {
      errorContent = JSON.parse(text);
    } 
    catch {
      errorContent = text || 'error';
    }
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorContent)}`);
  }

  // 성공 응답 처리
  const text = await response.text();
  if (!text) return null; // body 없으면 걍냅둬
  try {
    return JSON.parse(text); // JSON이면 파싱
  } 
  catch {
    return text; // 아니면 그냥 문자열 반환
  }
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

// 팔로우 추가
// 상대 유저 아이디 경로 파라미터로,,,
export async function addFollowing(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following/${followUserId}`, 
    { method: 'POST' }, token);
}

// 팔로우 취소
// 상대 유저 아이디 경로 파라미터로,,,
export async function removeFollowing(userId, followUserId, token) {
  return fetchWithAuth(`/api/profile/${userId}/following/${followUserId}`, 
    { method: 'DELETE' }, token);
}

// 매너온도
export async function changeTemperature(userId, data, token) {
  return fetchWithAuth(`/api/profile/${userId}/temperature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // 예: { score: 5 }
  }, token);
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

// 프로필 이미지 등록
export async function uploadProfileImage(userId, formData, token) {
  return fetchWithAuth(`/api/profile/${userId}/image`, 
    {
      method: 'POST',
      body: formData, // formData에 파일 포함
    },
    token
  );
}
