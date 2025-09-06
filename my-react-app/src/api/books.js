// src/api/books.js
// 책 거래글 관련 api

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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

  if (token) headers['Authorization'] = `Bearer ${token}`;
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

// 등록된 책 목록 불러오기
export async function bookList(token) {
  return fetchWithAuth('/api/books', {}, token);
}

// 책 상세정보
export async function bookDetail(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}`, {}, token);
}

// 등록된 책 정보 수정
export async function modifyBook(bookId, data, deleteImages, newImages, token) {
  const formData = new FormData();
  formData.append('book', JSON.stringify(data));

  // 이미지 삭제
  if (deleteImages && deleteImages.length > 0) {
    formData.append('deleteImages', JSON.stringify(deleteImages));
  }

  // 이미지 추가
  if (newImages && newImages.length > 0) {
    newImages.forEach(file => {
      formData.append('newImages', file);
    });
  }

  return fetchWithAuth(`/api/books/${bookId}`, {
    method: 'PATCH',
    body: formData,
  }, token);
}


// 등록된 책 게시물 삭제
export async function deleteBook(bookId, token) {
  return fetchWithAuth( `/api/books/${bookId}`,
    { method: 'DELETE' },
    token
  );
}

// 채팅방 생성
export async function createChatroom(bookId, token) {
  return fetchWithAuth( `/api/books/${bookId}/chatroom`,
    { method: 'POST' },
    token
  );
}

// 좋아요 개수 조회
export async function likeCount(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/like`, {}, token);
}

// 좋아요 토글
export async function likeBook(bookId, token) {
  return fetchWithAuth(`/api/books/${bookId}/like`, { method: 'POST' }, token);
}

// 거래글 사진 업로드
// 이미지 파일은 JSON이 아니라 FormData 형태로 보내야함
export async function uploadImage(bookId, formData, token) {
  return fetchWithAuth( `/api/books/${bookId}/upload-images`,
    {
      method: 'POST',
      body: formData,
    },
    token
  );
}

// 거래글 사진 삭제
export async function deleteImage(bookId, token) {
   return fetchWithAuth( `/api/books/${bookId}/upload-images`,
    {
      method: 'DELETE',
    },
    token
  );
  
}

// 책 대출하기
export async function borrowBook(bookId, data, token) {
  return fetchWithAuth( `/api/books/${bookId}/borrow`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), //자바스크립트 객체를 문자열 JSON으로 변환
    },
    token
  );
}

//  반납 완료 후 게시물 자동 생성 
export async function returnBook(token) {
  return fetchWithAuth( `/api/books/register/existing`,
    { method: 'POST' },
    token
  );
}

// 거래글 검색
export async function searchBook(params, token) {
  const queryString = new URLSearchParams(params).toString();
  return fetchWithAuth(`/api/books/search?${queryString}`, {}, token);
}

// 새 책 거래 게시물 등록
export async function registerBook(data, images, token) {
  const formData = new FormData();
  formData.append('book', JSON.stringify(data));

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }
  return fetchWithAuth('/api/books/register/new',
    {
      method: 'POST',
      body: formData,  
    },
    token
  );
}

// api를 통해 키워드로 책 정보 가져오기
// 거래글 올릴 때 사용
export async function fetchBookInfo(keyword, token) {
  const queryString = new URLSearchParams({ keyword }).toString();
  return fetchWithAuth(`/api/books/register/new/info?${queryString}`, {}, token);
}

