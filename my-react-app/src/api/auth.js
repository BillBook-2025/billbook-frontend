// src/api/auth.js

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

// 로그인
export async function login(userId, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

// 로그아웃
export async function logout(token) {
  return fetchWithAuth(
    '/api/auth/login',
    {
      method: 'DELETE',
    },
    token
  );
}

// 아이디 찾기
export async function findId(email) {
  const response = await fetch('/api/auth/find/id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Find ID failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

// 비밀번호 찾기 요청
export async function findPassword(userId, email) {
  const response = await fetch('/api/auth/find/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Find password failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

// 비밀번호 변경
export async function changePassword(password, confirmPassword) {
  const response = await fetch('/api/auth/find/password/change', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, confirmPassword }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Change password failed: ${response.status} ${errorText}`);
  }

  // 명세서에 204 응답, body 없을 수 있어서 여기선 메시지 없이 리턴
  return;
}

// 회원가입
export async function signup(userId, password, email, username) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password, email, username }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Signup failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

// 회원 탈퇴
export async function deleteAccount(password, message, token) {
  return fetchWithAuth(
    '/api/auth/signup',
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, message }),
    },
    token
  );
}
