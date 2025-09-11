// src/api/recommendations.js

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
// AI 추천 책 목록 불러오기
export async function fetchRecommendedBooks(token) {
  return fetchWithAuth(`/api/recommendations/books`, {}, token);
}

// AI 추천 게시글 목록 불러오기
export async function fetchRecommendedBoards(token) {
  return fetchWithAuth(`/api/recommendations/boards`, {}, token);
}