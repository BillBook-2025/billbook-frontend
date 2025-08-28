// src/api/websocket.js

import { Stomp } from '@stomp/stompjs';

let stompClient = null;

// 웹소켓 연결
export function connectWebSocket(onConnectCallback) {
  const socket = new WebSocket('ws://localhost:8080/websocket/ws-chat');
  stompClient = Stomp.over(socket);
  
  stompClient.connect({}, () => {
    console.log('WebSocket connected');
    if (onConnectCallback) onConnectCallback();
  });
}

// 채팅방 구독
export function subscribeChatroom(chatroomId, onMessageReceived) {
  if (!stompClient) return;
  stompClient.subscribe(`/topic/${chatroomId}`, (message) => {
    if (onMessageReceived) onMessageReceived(JSON.parse(message.body));
  });
}

// 메시지 보내기
export function sendMessage(chatroomId, message) {
  if (!stompClient) return;
  stompClient.send('/app/chat.send', {}, JSON.stringify({ chatroomId, ...message }));
}

// 웹소켓 종료
export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.disconnect(() => console.log('WebSocket disconnected'));
    stompClient = null;
  }
}
