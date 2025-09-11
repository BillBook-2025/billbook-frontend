// src/api/auth.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

import {fetchWithAuth} from './books.js';

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
