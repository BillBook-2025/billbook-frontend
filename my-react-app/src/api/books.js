// src/api/books.js
// 책 거래글 관련 api

const API_BASE_URL = '/api';

// 내부용: fetch 호출에 쓰는 함수
// 이거 안쓰면 다 일일히 export const 어쩌고~ 형태로 써얗함
export async function fetchWithAuth(url, options = {}) {
  /**
   * url: 요청할 API 경로 (예: /api/books)
   * options: fetch 함수에 넣는 옵션(HTTP 메서드, 바디, 헤더 등)
   * 세션 쿠키 사용
   */
  options.method = options.method || 'GET';
  options.credentials = 'include';

  const isFormData = options.body instanceof FormData;

  const finalOptions = { ...options };
  
  if (isFormData) {
    if (finalOptions.headers) {
      finalOptions.headers = { ...finalOptions.headers }; 
      delete finalOptions.headers['Content-Type']; 
    }
  } else {
    finalOptions.headers = {
      'Content-Type': 'application/json',
      ...(finalOptions.headers || {}),
    };
  }

  const response = await fetch(API_BASE_URL + url, finalOptions);

  // 응답이 ok가 아닐 경우
  if (!response.ok) {
    const text = await response.text();
    let errorContent;
    try {
      errorContent = JSON.parse(text);
    } catch {
      errorContent = text || 'error';
    }
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorContent)}`);
  }

  // 204 No Content는 json 파싱 X
  if (response.status === 204) return;

  // 성공 응답 처리
  // 바디가 없으면 null 반환, JSON 아니면 문자열 반환
  const text = await response.text();
  if (!text) return null; // body 없으면 걍냅둬
  try {
    return JSON.parse(text); // JSON이면 파싱
  } catch {
    return text; // 아니면 그냥 문자열 반환
  }
}

// 등록된 거래글 목록 불러오기
export async function bookList() {
  return fetchWithAuth('/books', {});
}

// 거래글 상세정보
export async function bookDetail(bookId) {
  return fetchWithAuth(`/books/${bookId}`, {});
}

// 등록된 책 정보 수정
export async function modifyBook(bookId, data, deleteImages, newImages) {
  const formData = new FormData();
  formData.append('book', new Blob([JSON.stringify(data)], {
    type: 'application/json'
  }));

  // 이미지 삭제
  if (deleteImages && deleteImages.length > 0) {
    formData.append('deleteImages', new Blob([JSON.stringify(deleteImages)], {
      type: 'application/json'
    }));
  }
  
  // 이미지 추가
  if (newImages && newImages.length > 0) {
    newImages.forEach((file) => {
      formData.append('newImages', file);
    });
  }

  return fetchWithAuth(`/books/${bookId}`, {
    method: 'PATCH',
    body: formData,
  });
}

// 등록된 책 게시물 삭제
export async function deleteBook(bookId) {
  return fetchWithAuth(`/books/${bookId}`, {
    method: 'DELETE',
  });
}

// 채팅방 생성
export async function createChatroom(bookId) {
  return fetchWithAuth(`/books/${bookId}/chatroom`, { method: 'POST' });
}

// 좋아요 개수 조회
export async function likeCount(bookId) {
  return fetchWithAuth(`/books/${bookId}/like`, {});
}

// 좋아요 토글
export async function likeBook(bookId) {
  return fetchWithAuth(`/books/${bookId}/like`, {
    method: 'POST',
  });
}

// 거래글 사진 업로드
// 이미지 파일은 JSON이 아니라 FormData 형태로 보내야함
export async function uploadImage(bookId, formData) {
  return fetchWithAuth(`/books/${bookId}/upload-images`, {
    method: 'POST',
    body: formData,
  });
}

// 거래글 사진 삭제
export async function deleteImage(bookId, filename) {
  return fetchWithAuth(`/books/${bookId}/upload-images`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
}

// 책 대출하기
export async function borrowBook(bookId, data) {
  return fetchWithAuth(`/books/${bookId}/borrow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), //자바스크립트 객체를 문자열 JSON으로 변환
  });
}

// 반납 완료 후 게시물 자동 생성
export async function returnBook(bookId) {
  return fetchWithAuth(`/books/${bookId}/existing`, { method: 'POST' });
}

// 거래글 검색
export async function searchBook(params) {
  const queryString = new URLSearchParams(params).toString();
  return fetchWithAuth(`/books/search?${queryString}`, {});
}

// 새 책 거래 게시물 등록
export async function registerBook(formData) {
  return fetchWithAuth(`/books/register/new`, {
    method: 'POST',
    body: formData,
  });
}

// api를 통해 키워드로 책 정보 가져오기
// 거래글 올릴 때 사용
export async function fetchBookInfo(params) {
  const queryString = new URLSearchParams(params).toString();
  return fetchWithAuth(`/books/register/new/info?${queryString}`, {});
}
