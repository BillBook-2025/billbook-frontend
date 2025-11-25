// src/api/chatrooms.js

const API_BASE_URL = "/api";

import {fetchWithAuth} from './books.js';

// 채팅 보내기
export async function sendChat(chatId, data) {
  return fetchWithAuth(`/chatRoom/${chatId}/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

// 유저의 채팅목록 불러오기
export async function getChatroom(userId) {
  return fetchWithAuth(`/users/${userId}/chatRoom`, {});
}

// 채팅방 메시지 조회
export async function getChats(chatId) {
  return fetchWithAuth(`/chatRoom/${chatId}/messages`, {});
}

// 채팅 상세 정보 조회
export async function getChatroomDetail(chatId) {
  return fetchWithAuth(`/chatRoom/${chatId}`, {});
}

// 채팅방 나가기
export async function leaveChatroom(chatId) {
  return fetchWithAuth(`/chatRoom/${chatId}`, { 
    method: 'DELETE' });
}

// 사진 보내기 
export async function sendPicture(chatId, formData) {
  return fetchWithAuth(`/chatRoom/${chatId}/picture`,
    {
      method: 'POST',
      body: formData,
    }
  );
}

// 기한 확인
export async function getDeadline(chatId) {
  return fetchWithAuth(`/chatRoom/${chatId}/deadline`, {});
}

// 기한 설정
export async function setDeadline(chatId, data) {
  return fetchWithAuth(`/chatRoom/${chatId}/deadline`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), 
    }
  );
}

// 송금하기
export async function sendDeal(chatId, data) {
  return fetchWithAuth(`/chatRoom/${chatId}/deal`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}