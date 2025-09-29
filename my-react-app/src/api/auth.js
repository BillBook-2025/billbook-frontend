// src/api/auth.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

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