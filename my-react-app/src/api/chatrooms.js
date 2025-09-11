// src/api/chatrooms.js

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

// 채팅목록 불러오기
export async function getChatrooms(token) {
  return fetchWithAuth('/chatrooms', {}, token);
}

// 채팅방 나가기
export async function leaveChatroom(chatId, token) {
  return fetchWithAuth(`/chatrooms/${chatId}`, { method: 'DELETE' }, token);
}

// 채팅 상세 페이지 불러오기
export async function getChatroomDetail(chatId, token) {
  return fetchWithAuth(`/chatrooms/${chatId}`, {}, token);
}

// 채팅 불러오기
export async function getChats(chatId, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/chat`, {}, token);
}

// 채팅 보내기
export async function sendChat(chatId, data, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );
}

// 사진 올리기 
export async function getPictures(chatId, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/picture`, {}, token);
}

// 사진 보내기 
export async function sendPicture(chatId, formData, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/picture`,
    {
      method: 'POST',
      body: formData,
    },
    token
  );
}

// 송금하기
export async function sendDeal(chatId, data, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/deal`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    token
  );
}

// 기한 확인
export async function getDeadline(chatId, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/deadline`, {}, token);
}

// 기한 설정
export async function setDeadline(chatId, data, token) {
  return fetchWithAuth(`/chatrooms/${chatId}/deadline`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), 
    },
    token
  );
}
