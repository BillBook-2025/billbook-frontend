// src/api/auth.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

async function fetchWithAuth(url, options = {}, token) {
  /**
   * url: 요청할 API 경로 (예: /api/books)
   * options: fetch 함수에 넣는 옵션(HTTP 메서드, 바디, 헤더 등)
   * token: 인증용 토큰 (없을 수도 있음)
   */
  const headers = options.headers ? { ...options.headers } : {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(API_BASE_URL + url, { ...options, headers });

  // 응답이 ok가 아닐 경우
  if (!response.ok) {
    const text = await response.text();
    let errorContent;
    try {
      errorContent = JSON.parse(text);
    } 
    catch {
      errorContent = text || 'error';
    }
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorContent)}`);
  }

  // 성공 응답 처리
  const text = await response.text();
  if (!text) return null; // body 없으면 걍냅둬
  try {
    return JSON.parse(text); // JSON이면 파싱
  } 
  catch {
    return text; // 아니면 그냥 문자열 반환
  }
}

// 로그인
export async function login(userId, password) {
  return fetchWithAuth('/api/auth/login', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
  });
}

// 로그아웃
export async function logout(token) {
  return fetchWithAuth('/api/auth/login',
    {  method: 'DELETE'  },
    token
  );
}

// 아이디 찾기
export async function findId(email) {
  return fetchWithAuth('/api/auth/find/id', 
    {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
/*
얘 안쓸듯

// 비밀번호 찾기 요청
export async function findPassword(userId, email) {
  return fetchWithAuth('/api/auth/find/password', 
    {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email }),
  });
}
  */

// 비밀번호 변경
// 204 No Content를 반환할 가능성 있어서 fetchWithAuth함수 안쓰고 걍 정통으로 예외처리
export async function changePassword(password, confirmPassword) {
  const response = await fetch(API_BASE_URL + '/api/auth/find/password/change', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, confirmPassword }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  // 204 응답이라 응답 본문 없음 → 그냥 리턴
  return;
}


// 회원가입
export async function signup(userId, password, email, username) {
  return fetchWithAuth('/api/auth/signup', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, email, username }),
    });
}

// 회원 탈퇴
export async function deleteAccount(password, message, token) {
  return fetchWithAuth( '/api/auth/signup',
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, message }),
    },
    token
  );
}
