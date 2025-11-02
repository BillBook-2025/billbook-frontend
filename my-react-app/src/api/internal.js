// src/api/internal.js
// 얘는 백 내부용 api라서 딱히 프런트에서 필요 없을거같기두

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// AI 추천
export async function requestAIRecommendation(data) {
  return fetchWithAuth(`/internal/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// 감정 분석
export async function analyzeSentiment(data) {
  return fetchWithAuth(`/internal/ai/sentiment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// 임베딩 생성
export async function generateEmbedding(data) {
  return fetchWithAuth(`/internal/ai/embedding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
