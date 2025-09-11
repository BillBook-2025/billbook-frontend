// src/api/my.js

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
  // 바디가 없으면 null 반환, JSON 아니면 문자열 반환
  const text = await response.text();
  if (!text) return null; // body 없으면 걍냅둬
  try {
    return JSON.parse(text); // JSON이면 파싱
  } 
  catch {
    return text; // 아니면 그냥 문자열 반환
  }
}

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
