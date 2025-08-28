// src/api/internal.js
// 얘는 백 내부용 api라서 딱히 프런트에서 필요 없을거같기두

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
