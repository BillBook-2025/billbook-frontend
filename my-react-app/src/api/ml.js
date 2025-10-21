// src/api/recommendations.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://13.209.17.126:8080/api";

import {fetchWithAuth} from './books.js';

// AI 추천 책 목록 불러오기
export async function fetchRecommendedBooks() {
  return fetchWithAuth(`/ml/recommendations`, {});
}
