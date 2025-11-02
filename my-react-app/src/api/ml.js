// src/api/recommendations.js

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// AI 추천 책 목록 불러오기
export async function fetchRecommendedBooks() {
  return fetchWithAuth(`/ml/recommendations`, {});
}
