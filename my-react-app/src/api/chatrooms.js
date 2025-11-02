// src/api/chatrooms.js

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// 채팅목록 불러오기
export async function getChatrooms() {
  return fetchWithAuth('/chatrooms', {});
}

// 채팅방 나가기
export async function leaveChatroom(chatId) {
  return fetchWithAuth(`/chatrooms/${chatId}`, { 
    method: 'DELETE' });
}

// 채팅 상세 페이지 불러오기
export async function getChatroomDetail(chatId) {
  return fetchWithAuth(`/chatrooms/${chatId}`, {});
}

// 채팅 불러오기
export async function getChats(chatId) {
  return fetchWithAuth(`/chatrooms/${chatId}/chat`, {});
}

// 채팅 보내기
export async function sendChat(chatId, data) {
  return fetchWithAuth(`/chatrooms/${chatId}/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

// 사진 올리기 
export async function getPictures(chatId) {
  return fetchWithAuth(`/chatrooms/${chatId}/picture`, {});
}

// 사진 보내기 
export async function sendPicture(chatId, formData) {
  return fetchWithAuth(`/chatrooms/${chatId}/picture`,
    {
      method: 'POST',
      body: formData,
    }
  );
}

// 송금하기
export async function sendDeal(chatId, data) {
  return fetchWithAuth(`/chatrooms/${chatId}/deal`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

// 기한 확인
export async function getDeadline(chatId) {
  return fetchWithAuth(`/chatrooms/${chatId}/deadline`, {});
}

// 기한 설정
export async function setDeadline(chatId, data) {
  return fetchWithAuth(`/chatrooms/${chatId}/deadline`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), 
    }
  );
}
