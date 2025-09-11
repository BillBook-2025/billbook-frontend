// src/api/boards.js
// 얘는 커뮤니티 기능 위한 거

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

// 게시글 목록 조회
export async function getBoards(token) {
  return fetchWithAuth('/api/boards', {}, token);
}

// 게시글 상세 조회
export async function getBoardDetail(boardId, token) {
  return fetchWithAuth(`/api/boards/${boardId}`, {}, token);
}

// 게시글 등록
export async function createBoard(data, token) {
  return fetchWithAuth('/api/boards', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 게시글 수정
export async function updateBoard(boardId, data, token) {
  return fetchWithAuth(`/api/boards/${boardId}`, 
    {
     method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token
  );
}

// 게시글 삭제
export async function deleteBoard(boardId, token) {
  return fetchWithAuth(`/api/boards/${boardId}`, 
    {
      method: 'DELETE'
    }, token
  );
}

// 좋아요 상태 조회
export async function getBoardLike(boardId, token) {
  return fetchWithAuth(`/api/boards/${boardId}/like`, {}, token);
}

// 좋아요 누르기
export async function likeBoard(boardId, token) {
  return fetchWithAuth(`/api/boards/${boardId}/like`, 
    { method: 'POST' }, token);
}

// 댓글 목록 조회
export async function getComment(boardId, token) {
  return fetchWithAuth(`/api/boards/${boardId}/comments`, {}, token);
}

// 댓글 작성
export async function addComment(boardId, data, token) {
  return fetchWithAuth(`/api/boards/${boardId}/comments`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 댓글 삭제
export async function deleteComment(boardId, commentId, token) {
  return fetchWithAuth(`/api/boards/${boardId}/comments/${commentId}`, 
    {
      method: 'DELETE'
    }, token
  );
}

// 대댓글 추가 
export async function addReply(boardId, commentId, data, token) {
  return fetchWithAuth(`/api/boards/${boardId}/comments/${commentId}/replies`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, token);
}

// 게시글 검색
export async function searchBoard(params = {}, token) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/boards/search?${query}` : `/api/boards/search`;
  return fetchWithAuth(url, {}, token);
}

// 게시글 이미지 업로드
export async function uploadBoardImage(boardId, formData, token) {
  return fetchWithAuth(`/api/boards/${boardId}/upload-images`, {
    method: 'POST',
    body: formData, 
  }, token);
}

// 게시글 이미지 삭제
export async function deleteBoardImage(boardId, data, token) {
  return fetchWithAuth(`/api/boards/${boardId}/upload-images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // {filename: "image3.jpeg"}
  }, token);
}