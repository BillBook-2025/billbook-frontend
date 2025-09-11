// src/api/internal.js
// 얘는 백 내부용 api라서 딱히 프런트에서 필요 없을거같기두

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
// AI 추천
export async function requestAIRecommendation(data, token) {
  return fetchWithAuth(`/internal/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, token);
}

// 감정 분석
export async function analyzeSentiment(data, token) {
  return fetchWithAuth(`/internal/ai/sentiment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, token);
}

// 임베딩 생성
export async function generateEmbedding(data, token) {
  return fetchWithAuth(`/internal/ai/embedding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, token);
}
