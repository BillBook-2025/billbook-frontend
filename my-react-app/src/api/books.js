// src/api/books.js

/**
 * 함수 선언 시
파라미터 이름을 써서 함수가 받을 입력값을 정의해줘야 해

    // 함수가 search 조건을 받는다고 약속하는 것
    export const searchBooks = async (params) => {
        // params를 받아서 처리하는 코드
    };

 */
import { BOOKS } from "./endpoints";

// 내부용: fetch 호출에 쓰는 함수 
// 이거 안쓰면 다 일일히 export const 어쩌고~ 형태로 써얗함
async function fetchWithAuth(url, options = {}, token) {
    /**
     * url: 요청할 API 경로 (예: /api/books)
     * options: fetch 함수에 넣는 옵션(HTTP 메서드, 바디, 헤더 등)
     * token: 인증용 토큰 (없을 수도 있음)
     */
  const headers = options.headers ? { ...options.headers } : {};
  // options 안에 headers가 있으면 복사하고 없으면 빈 객체 생성

  if (token) headers["Authorization"] = `Bearer ${token}`;
  // token이 있으면 HTTP 요청 헤더에 Authorization: Bearer 토큰값 추가
  // 이게 서버에서 인증할 때 사용하는 방식

  // 실제 fetch 호출
  const response = await fetch(API_BASE_URL + url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  return response.json();
}

// /books - 등록된 책 목록 불러오기 (GET) 
export async function fetchBookList(token) {
  return fetchWithAuth("/api/books", {}, token);
}

// /books/{bookId} - 책 상세정보 (GET) 
export async function fetchBookDetail(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}`, {}, token);
}

// /books/{bookId}/chatroom - 채팅방 생성 (POST) 
export async function createChatroom(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/chatroom`, { method: "POST" }, token);
}

// /books/{bookId}/like - 좋아요 개수 조회 (GET) 
export async function fetchLikeCount(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/like`, {}, token);
}

// /books/{bookId}/like - 좋아요 누르기 (POST) 
export async function likeBook(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/like`, { method: "POST" }, token);
}

// /books/{bookId}/like - 좋아요 취소 (DELETE) 
export async function unlikeBook(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/like`, { method: "DELETE" }, token);
}

// /books/{bookId}/upload-images - 책 사진 업로드 (POST) 
// 이미지 파일은 JSON이 아니라 FormData 형태로 보내야함
export async function uploadBookImages(bookId, formData, token) {
  return fetchWithAuth(`/api/books/${bookId}/upload-images`, {
    method: "POST",
    body: formData,
  }, token);
}

// /books/{bookId}/borrow - 책 대출하기 (POST)
export async function borrowBook(bookId, data, token) {
  return fetchWithAuth(`/api/books/${bookId}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), //자바스크립트 객체를 문자열 JSON으로 변환
  }, token);
}

// /books/search - 책 검색 (GET)
export async function searchBooks(params, token) {
  const queryString = new URLSearchParams(params).toString();
  return fetchWithAuth(`/api/books/search?${queryString}`, {}, token);
}

/** /books/search/history - 검색 기록 불러오기 (GET) */
export async function fetchSearchHistory(token) {
  return fetchWithAuth(`/api/books/search/history`, {}, token);
}

/** /books/search/history - 전체 검색 기록 삭제 (DELETE) */
export async function deleteAllSearchHistory(token) {
  return fetchWithAuth(`/api/books/search/history`, { method: "DELETE" }, token);
}

/** /books/search/history/{historyId} - 특정 검색 기록 삭제 (DELETE) */
export async function deleteSearchHistoryById(historyId, token) {
  return fetchWithAuth(`/api/books/search/history/${historyId}`, { method: "DELETE" }, token);
}

/** /books/register/new - 새 책 거래 게시물 등록 (POST)
 * @param {Object} data - 책 등록 정보
 */
export async function registerNewBook(data, token) {
  return fetchWithAuth(`/api/books/register/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, token);
}

/** /books/register/existing - 반납 완료 후 게시물 자동 생성 (POST) */
export async function registerExistingBook(token) {
  return fetchWithAuth(`/api/books/register/existing`, { method: "POST" }, token);
}

/** /books/register/{bookId} - 등록된 책 정보 수정 (PATCH)
 * @param {number|string} bookId 
 * @param {Object} data 
 */
export async function updateRegisteredBook(bookId, data, token) {
  return fetchWithAuth(`/api/books/register/${bookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, token);
}

/** /books/register/{bookId} - 등록된 책 게시물 삭제 (DELETE) */
export async function deleteRegisteredBook(bookId, token) {
  return fetchWithAuth(`/api/books/register/${bookId}`, { method: "DELETE" }, token);
}

/** /books/register/{bookId}/upload-images - 책 사진 업로드 (POST) */
export async function uploadRegisteredBookImages(bookId, data, token) {
  return fetchWithAuth(`/api/books/register/${bookId}/upload-images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, token);
}

/** /books/register/{bookId}/borrow - 책 대출하기 (POST) */
export async function borrowRegisteredBook(bookId, data, token) {
  return fetchWithAuth(`/api/books/register/${bookId}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, token);
}