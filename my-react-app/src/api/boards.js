// src/api/boards.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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