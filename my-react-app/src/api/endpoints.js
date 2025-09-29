/*
이걸로 경로 변수화 하려했는데
그냥 더 복잡해지는거같아서 일단 하드코딩으로.....


// src/api/endpoints.js

// 백엔드 API 경로 주소를 모아놓는 파일
// 실제로 요청 보내는 함수를 정의하는건 다른 파일들에서!~

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:8080";

export const AUTH = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/login`, // DELETE 요청
  FIND_ID: `${API_BASE_URL}/auth/find/id`,
  FIND_PASSWORD: `${API_BASE_URL}/auth/find/password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/find/password/change`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  DELETE_ACCOUNT: `${API_BASE_URL}/auth/signup`, // DELETE 요청
};

export const BOOKS = {
  LIST: `${API_BASE_URL}/books`,
  DETAIL: (bookId) => `${API_BASE_URL}/books/${bookId}`,
  UPDATE: (bookId) => `${API_BASE_URL}/books/${bookId}`,
  CREATE_CHATROOM: (bookId) => `${API_BASE_URL}/books/${bookId}/chatroom`,
  LIKE_COUNT: (bookId) => `${API_BASE_URL}/books/${bookId}/like`,
  LIKE_TOGGLE: (bookId) => `${API_BASE_URL}/books/${bookId}/like`,
  UPLOAD_IMAGES: (bookId) => `${API_BASE_URL}/books/${bookId}/upload-images`,
  BORROW: (bookId) => `${API_BASE_URL}/books/${bookId}/borrow`,

  SEARCH: `${API_BASE_URL}/books/search`,
  SEARCH_HISTORY: `${API_BASE_URL}/books/search/history`,
  DELETE_SEARCH_HISTORY: (historyId) => `${API_BASE_URL}/books/search/history/${historyId}`,

  REGISTER_NEW: `${API_BASE_URL}/books/register/new`,
  REGISTER_EXISTING: `${API_BASE_URL}/books/register/existing`,
  REGISTER_UPDATE: (bookId) => `${API_BASE_URL}/books/register/${bookId}`,
  REGISTER_DELETE: (bookId) => `${API_BASE_URL}/books/register/${bookId}`,
  REGISTER_UPLOAD_IMAGES: (bookId) => `${API_BASE_URL}/books/register/${bookId}/upload-images`,
  REGISTER_BORROW: (bookId) => `${API_BASE_URL}/books/register/${bookId}/borrow`,
};

export const MY = {
  INFO: (userId) => `${API_BASE_URL}/${userId}/my`,
  UPDATE: (userId) => `${API_BASE_URL}/${userId}/my`,
  LIKE_LIST: (userId) => `${API_BASE_URL}/${userId}/my/like`,
  POINTS: (userId) => `${API_BASE_URL}/${userId}/my/point`,
  POINTS_CHANGE: (userId) => `${API_BASE_URL}/${userId}/my/point`,
};

export const PROFILE = {
  DETAIL: (userId) => `${API_BASE_URL}/profile/${userId}`,
  FOLLOWER_LIST: (userId) => `${API_BASE_URL}/profile/${userId}/follower`,
  FOLLOWING_LIST: (userId) => `${API_BASE_URL}/profile/${userId}/following`,
  FOLLOWING_ADD: (userId) => `${API_BASE_URL}/profile/${userId}/following`,
  FOLLOWING_REMOVE: (userId) => `${API_BASE_URL}/profile/${userId}/following`,
  TEMPERATURE_GET: (userId) => `${API_BASE_URL}/profile/${userId}/temporature`,
  TEMPERATURE_POST: (userId) => `${API_BASE_URL}/profile/${userId}/temporature`,
  BORROW_LIST: (userId) => `${API_BASE_URL}/profile/${userId}/borrow`,
  REGISTER_LIST: (userId) => `${API_BASE_URL}/profile/${userId}/register`,
  HISTORY: (userId) => `${API_BASE_URL}/profile/${userId}/history`,
  BOARDS: (userId) => `${API_BASE_URL}/profile/${userId}/boards`,
  UPLOAD_IMAGE: (userId) => `${API_BASE_URL}/profile/${userId}/image`,
};

export const CHATROOMS = {
  LIST: `${API_BASE_URL}/chatrooms`,
  LEAVE: `${API_BASE_URL}/chatrooms`,
  DETAIL: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}`,
  CHAT_LIST: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/chat`,
  CHAT_SEND: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/chat`,
  PICTURE_GET: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/picture`,
  PICTURE_SEND: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/picture`,
  DEAL_SEND: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/deal`,
  DEADLINE_GET: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/deadline`,
  DEADLINE_SET: (chatId) => `${API_BASE_URL}/chatrooms/${chatId}/deadline`,
};

export const BOARDS = {
  LIST: `${API_BASE_URL}/boards`,
  CREATE: `${API_BASE_URL}/boards`,
  DETAIL: (boardId) => `${API_BASE_URL}/boards/${boardId}`,
  UPDATE: (boardId) => `${API_BASE_URL}/boards/${boardId}`,
  DELETE: (boardId) => `${API_BASE_URL}/boards/${boardId}`,
  LIKE_GET: (boardId) => `${API_BASE_URL}/boards/${boardId}/like`,
  LIKE_POST: (boardId) => `${API_BASE_URL}/boards/${boardId}/like`,
  LIKE_DELETE: (boardId) => `${API_BASE_URL}/boards/${boardId}/like`,
  COMMENTS: (boardId) => `${API_BASE_URL}/boards/${boardId}/comments`,
  COMMENT_CREATE: (boardId) => `${API_BASE_URL}/boards/${boardId}/comments`,
  COMMENT_DELETE: (boardId, commentId) => `${API_BASE_URL}/boards/${boardId}/comments/${commentId}`,
  REPLY_CREATE: (boardId, commentId) => `${API_BASE_URL}/boards/${boardId}/comments/${commentId}/replies`,
};

export const RECOMMENDATIONS = {
  LIST: `${API_BASE_URL}/recommendations`,
};

export const INTERNAL = {
  PREDICT: `${API_BASE_URL}/internal/predict`,
  BOARDS_SENTIMENT: `${API_BASE_URL}/internal/boards-sentiment`,
  BOOK_EMBEDDING: `${API_BASE_URL}/internal/book-embedding`,
  USER_VECTOR: `${API_BASE_URL}/internal/user-vector`,
  BOOK_CLUSTER: `${API_BASE_URL}/internal/book-cluster`,
};

export const WEBSOCKET = {
  WS_CHAT: `${API_BASE_URL}/websocket/ws-chat`, // WS 연결 주소
  APP_CHAT_SEND: `${API_BASE_URL}/websocket/app/chat.send`, // WS 메시지 보내기
  TOPIC_CHATROOM: (chatroomId) => `${API_BASE_URL}/websocket/topic/${chatroomId}`, // WS 구독 주소
};

*/