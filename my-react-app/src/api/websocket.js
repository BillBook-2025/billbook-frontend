// src/api/websocket.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

// [중요] 프록시를 통해 백엔드의 /websocket/ws-chat 엔드포인트로 연결
// Vite가 '/api'를 보고 'http://13.209.17.126:8080'으로 바꿔서 요청을 보냅니다.
const SOCKET_URL = '/api/ws';

export function connectWebSocket(onConnectCallback) {
  if (stompClient && stompClient.connected) return;

  console.log(`[WebSocket] 연결 시도: ${SOCKET_URL}`);

  stompClient = new Client({
    brokerURL: SOCKET_URL,
    reconnectDelay: 5000,

    debug: (str) => {
      console.log('[Stomp]', str);
    },

    onConnect: () => {
      console.log('>>> WebSocket 연결 성공! <<<');
      if (onConnectCallback) onConnectCallback();
    },

    onStompError: (frame) => {
      console.error('Broker error: ' + frame.headers['message']);
      console.error('Details: ' + frame.body);
    },

    onWebSocketClose: () => {
      console.log('웹소켓 연결이 종료되었습니다.');
    },
  });

  stompClient.activate();
}

export function subscribeChatroom(chatroomId, onMessageReceived) {
  if (!stompClient || !stompClient.connected) {
    console.error('웹소켓 미연결');
    return null;
  }

  const path = `/topic/chatroom/${chatroomId}/chat`;

  const subscription = stompClient.subscribe(path, (message) => {
    if (message.body) {
      const parsedMessage = JSON.parse(message.body);
      if (onMessageReceived) onMessageReceived(parsedMessage);
    }
  });
  return () => subscription.unsubscribe();
}

export function sendMessage(chatroomId, senderId, messageContent) {
  if (!stompClient || !stompClient.connected) {
    console.error('웹소켓 미연결: 전송 실패');
    return;
  }

  const destination = `/app/chatroom/${chatroomId}/chat`;
  let payload;

  if (
    typeof messageContent === 'object' &&
    messageContent !== null &&
    messageContent.type
  ) {
    payload = {
      senderId: senderId,
      message: messageContent.message || '',
      type: messageContent.type,
      content: messageContent.message || '',
    };
  } else {
    payload = {
      senderId: senderId,
      message: messageContent,
      type: 'CHAT',
      content: messageContent,
    };
  }

  stompClient.publish({
    destination: destination,
    body: JSON.stringify(payload),
  });
}
