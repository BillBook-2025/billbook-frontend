// src/api/websocket.js

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

const API_BASE_URL = '/api';

// 웹소켓 연결
export function connectWebSocket(onConnectCallback) {
  if (stompClient && stompClient.connected) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/websocket/ws-chat`),
    connectHeaders: {},
    debug: (str) => console.log('[WebSocket]', str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket 연결됨');
      if (onConnectCallback) onConnectCallback();
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
    onDisconnect: () => console.log('WebSocket 연결 종료'),
  });

  stompClient.activate();
}

// 채팅방 구독 (서버가 브로드캐스트하는 특정 채널을 듣는 것)
// /topic/{chatroomId}는 해당 채팅방에 들어온 모든 메시지를 서버가 뿌려주는 주소고,
// 클라이언트는 이걸 구독해서 메시지를 실시간으로 받음
/**
/app/chat.send → 클라이언트 → 서버
메시지를 서버로 전송하는 경로 (Publish)

/topic/{chatroomId} → 서버 → 구독자들
메시지를 서버가 발행(Publish)하고, 이 토픽을 구독(Subscribe)한 모든 클라이언트가 받음

즉:

네가 채팅방 A에 있다면 → /topic/A를 구독

네가 메시지 보내면 → /app/chat.send로 서버에 전달

서버가 처리 후 → /topic/A에 브로드캐스트

**구독 중인 모든 사용자(같은 채팅방 참여자)**가 수신
 */
export function subscribeChatroom(chatroomId, onMessageReceived) {
  if (!stompClient) return null;

  const subscription = stompClient.subscribe(
    `/topic/chatRoom/${chatRoomId}/chat`,
    (message) => {
      const parsedMessage = JSON.parse(message.body);
      try {
        const parsedMessage = JSON.parse(message.body);
        if (onMessageReceived) onMessageReceived(parsedMessage);
      } catch (error) {
        console.error("메시지 파싱 에러:", error);
      }
    }
  );

  return () => subscription.unsubscribe();
}

// 메시지 보내기
export function sendMessage(chatroomId, message) {
  if (!stompClient || !stompClient.connected) {
    console.error("웹소켓 연결 끊김. 메시지 전송 불가.");
    return;
  }

  stompClient.publish({
    destination: `/app/chatRoom/${chatRoomId}/chat`,
    body: JSON.stringify({
      senderId: data.senderId,
      message: data.content || data.message, 
      type: data.type || 'CHAT', 
      // sendAt은 서버 생성
    }),
  });
}

// 연결 종료
export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('WebSocket 연결 해제');
  }
}
