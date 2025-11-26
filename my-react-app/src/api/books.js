// src/api/books.js
// 책 거래글 관련 api

const API_BASE_URL = '/api';

// 내부용: fetch 호출에 쓰는 함수
// 이거 안쓰면 다 일일히 export const 어쩌고~ 형태로 써얗함
export async function fetchWithAuth(url, options = {}) {
  options.method = options.method || 'GET';
  options.credentials = 'include';

  const finalOptions = { ...options };
  
  finalOptions.headers = { ...(finalOptions.headers || {}) };

  if (finalOptions.body) {
    if (finalOptions.body instanceof FormData) {
      if (finalOptions.headers['Content-Type']) {
        delete finalOptions.headers['Content-Type'];
      }
    } else {
      if (!finalOptions.headers['Content-Type']) {
        finalOptions.headers['Content-Type'] = 'application/json';
      }
    }
  } else {
    // Body가 없는 경우 헤더를 보내지 않게
    if (finalOptions.headers['Content-Type']) {
      delete finalOptions.headers['Content-Type'];
    }
  }

  const response = await fetch(API_BASE_URL + url, finalOptions);

  if (!response.ok) {
    if (response.status === 401) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login'; // 리다이렉트
      throw new Error('Unauthorized');
    }
    
    // 에러 메시지 파싱 시도
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 텍스트로 읽기 시도
      // const text = await response.text(); 
      // errorMessage = text || errorMessage;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return;

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
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
export async function modifyBook(bookId, formData) {
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
export async function createChatroom(bookId, buyerId) {
  return fetchWithAuth(`/books/${bookId}/chatRoom?buyerId=${buyerId}`, {
    method: 'POST',
  });
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
export async function searchBook(params = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.query) {
    searchParams.append("keyword", params.query);
  }
  
  if (params.region && params.region !== "전체") {
    searchParams.append("region", params.region);
  }
  
  const queryString = searchParams.toString();
  const url = `/api/books/search?${queryString}`;

  console.log("검색 요청 URL (POST/Cookie):", url);

  const response = await fetch(url, {
    method: 'POST', 
    headers: {
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("검색 API 에러상세:", errorData);
    throw new Error(errorData.message || '검색 요청 실패');
  }

  return response.json();
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
