// src/api/boards.js

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

// 게시글 목록 조회
export async function getBoards(token) {
  return fetchWithAuth('/boards', {}, token);
}

// 게시글 상세 조회
export async function getBoardDetail(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}`, {}, token);
}

// 게시글 등록
export async function createBoard(data, token) {
  return fetchWithAuth('/boards', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 게시글 수정
export async function updateBoard(boardId, data, token) {
  return fetchWithAuth(`/boards/${boardId}`, 
    {
     method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 게시글 삭제
export async function deleteBoard(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}`, 
    {
      method: 'DELETE'
    }, token);
}

// 좋아요 상태 조회
export async function getBoardLike(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}/like`, {}, token);
}

// 좋아요 누르기
export async function likeBoard(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}/like`, 
    { method: 'POST' }, token);
}

// 좋아요 취소
export async function unlikeBoard(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}/like`, 
    { method: 'DELETE' }, token);
}

// 댓글 목록 조회
export async function getComments(boardId, token) {
  return fetchWithAuth(`/boards/${boardId}/comments`, {}, token);
}

// 댓글 작성
export async function addComment(boardId, data, token) {
  return fetchWithAuth(`/boards/${boardId}/comments`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 댓글 삭제
export async function deleteComment(boardId, commentId, token) {
  return fetchWithAuth(`/boards/${boardId}/comments/${commentId}`, 
    {
      method: 'DELETE'
    }, token);
}

/* 대댓글 추가 */
export async function addReply(boardId, commentId, data, token) {
  return fetchWithAuth(`/boards/${boardId}/comments/${commentId}/replies`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

/* 책 추천 목록 */
export async function getRecommendations(token) {
  return fetchWithAuth('/recommendations', {}, token);
}