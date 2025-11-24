// src/api/boards.js
// 얘는 커뮤니티 기능 위한 거

const API_BASE_URL = '/api';

import { fetchWithAuth } from './books.js';

// 게시글 목록 조회
export async function getBoards() {
  return fetchWithAuth('/boards', {});
}

// 게시글 상세 조회
export async function getBoardDetail(boardId) {
  return fetchWithAuth(`/boards/${boardId}`, {});
}

// 게시글 등록
export async function createBoard(formData) {
  return fetchWithAuth('/boards', {
    method: 'POST',
    body: formData,
  });
}

// 게시글 수정
export async function updateBoard(boardId, data) {
  return fetchWithAuth(`/boards/${boardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// 게시글 삭제
export async function deleteBoard(boardId) {
  return fetchWithAuth(`/boards/${boardId}`, {
    method: 'DELETE',
  });
}

// 좋아요 상태 조회
export async function getBoardLike(boardId) {
  return fetchWithAuth(`/boards/${boardId}/like`, {});
}

// 좋아요 취소 로직 없음!!!!!!!!!!!!!

// 좋아요 누르기
export async function likeBoard(boardId) {
  return fetchWithAuth(`/boards/${boardId}/like`, {
    method: 'POST',
  });
}

// 댓글 목록 조회
export async function getComment(boardId) {
  return fetchWithAuth(`/boards/${boardId}/comments`, {});
}

// 댓글 작성
export async function addComment(boardId, data) {
  return fetchWithAuth(`/boards/${boardId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// 댓글 삭제
export async function deleteComment(boardId, commentId) {
  return fetchWithAuth(`/boards/${boardId}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

// 대댓글 추가
export async function addReply(boardId, commentId, data) {
  return fetchWithAuth(`/boards/${boardId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// 게시글 검색
export async function searchBoard(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/boards/search?${query}` : `/boards/search`;
  return fetchWithAuth(url, {});
}

// 게시글 이미지 업로드
export async function uploadBoardImage(boardId, formData) {
  return fetchWithAuth(`/boards/${boardId}/upload-images`, {
    method: 'POST',
    body: formData,
  });
}

// 게시글 이미지 삭제
export async function deleteBoardImage(boardId, data) {
  return fetchWithAuth(`/boards/${boardId}/upload-images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
