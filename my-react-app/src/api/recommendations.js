// src/api/recommendations.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

// AI 추천 책 목록 불러오기
export async function fetchRecommendedBooks(token) {
  return fetchWithAuth(`/api/recommendations/books`, {}, token);
}

// AI 추천 게시글 목록 불러오기
export async function fetchRecommendedBoards(token) {
  return fetchWithAuth(`/api/recommendations/boards`, {}, token);
}