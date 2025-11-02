// src/pages/main/Chatroom.jsx
/**
 ### 1:1 거래글 채팅방

- [상대방 프로필]
- [거래상품] - 거래글로 이동
- (올린 사람만 접근)[약속 잡기] - 거래 관리 페이지. 거래글 상태: 비활성화 / [거래 관리] - 거래 관리 페이지
- 채팅 기록
- 하단[채팅창] - 타자입력
- [전송]
- [+] - 캘린더, 사진, 송금
 */
/**
 * 1. “책 대출하기” 버튼 표시

대출 버튼은 거래 참여자(빌리는 유저, 빌려주는 유저) 모두에게 표시 가능
→ 대출 가능한 상태(chatData.isActive === true)인 책만 표시.

클릭 시 API 호출로 대출 처리.

2. 거래 완료 처리

거래 완료(거래글 상태: 비활성화) 버튼은 책을 올린 사람(빌려주는 유저)만 표시.

완료 시:

책 상태 비활성화

팝업: “완료되었습니다. 마이페이지에서 매너평가를 할 수 있어요”

자동으로 반납 후 다시 게시물 생성 가능 → returnBook 호출

3. 대출 → 반납 → 재게시

빌린 책을 반납하면:

기존 거래글이 다시 활성화 상태로 전환

returnBook 호출로 게시물 새로 등록
 */

import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 아이콘
import { Plus, Send, Image, DollarSign } from "lucide-react";
// 리액트 date picker(캘린더)
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// API 함수
import { fetchProfile } from '../../api/profile';
import { getChatroomDetail, getChats, sendChat, sendPicture, sendDeal, getDeadline, setDeadline } from '../../api/chatrooms';
import { connectWebSocket, subscribeChatroom, sendMessage, disconnectWebSocket } from "../../api/websocket";
import { borrowBook, returnBook } from '../../api/books';

export default function Chatroom() {
  const { chatId } = useParams();

  const [chatData, setChatData] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [partner, setPartner] = useState(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);  // + 버튼 눌렀을때 나오는 메뉴
  const [selectedDate, setSelectedDate] = useState(null);
  const clientRef = useRef(null);

  const messagesEndRef = useRef(null);

// 초기 데이터 로드
  useEffect(() => {
    getChatroomDetail(chatId)
      .then((data) => {
        setChatData(data);
        return fetchProfile(data.partnerId);
      })
      .then((profile) => setPartner(profile))
      .catch((err) => console.error("채팅방 로드 실패", err));

    getChats(chatId)
      .then((data) => setChats(data))
      .catch((err) => console.error("채팅 불러오기 실패", err));
  }, [chatId]);

  // 웹소켓 연결 + 구독
  useEffect(() => {
    connectWebSocket(() => {
      const unsubscribe = subscribeChatroom(chatId, (msg) => {
        setChats((prev) => [...prev, msg]);
      });

      return () => {
        unsubscribe();
        disconnectWebSocket();
      };
    });
  }, [chatId]);

  // 메시지 전송 
  const handleSend = () => {
    if (!message.trim() || !chatData) return;
    sendMessage(chatId, {
      senderId: chatData.myId,
      content: message,
      type: "TEXT",
    });
    setMessage("");
  };

  // 사진 전송 
  const handleSendPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("picture", file);
    try {
      await sendPicture(chatId, formData);
    } 
    catch (err) {
      console.error("사진 전송 실패", err);
    }
  };

  // 송금하기
  const handleSendDeal = async () => {
    const amount = prompt("송금할 금액을 입력하세요:");
    if (!amount) return;
    try {
      await sendDeal(chatId, { amount });
      alert("송금 완료!");
    } 
    catch (err) {
      console.error("송금 실패", err);
    }
  };

  // 약속 날짜 설정 
  const handleSetDeadline = async () => {
    if (!selectedDate) return;
    try {
      await setDeadline(chatId, { deadline: selectedDate.toISOString().split("T")[0] });
      alert("약속 날짜 설정 완료");
      setMenuOpen(false);
    } 
    catch (err) {
      console.error("기한 설정 실패", err);
    }
  };

  // 책 대출하기
  const handleBorrowBook = async () => {
    try {
      await borrowBook(chatData.bookId, { borrowerId: chatData.myId });
      alert("대출 완료! 마이페이지에서 대여 상태를 확인할 수 있습니다.");

      // 상태 업데이트: 더 이상 대여 불가로 표시
      setChatData(prev => ({ ...prev, isActive: false }));
      setMenuOpen(false);
    } 
    catch (err) {
    console.error("대출 실패", err);
    }
  };

  // 거래 완료 (= 반납 완료, 책 빌려준 사람만 가능)
  const handleCompleteDeal = async () => {
    try {
      //거래글 상태 재활성화
      await returnBook(chatData.bookId); 
      alert("완료되었습니다. 마이페이지에서 매너평가를 할 수 있어요");

      // 상태 업데이트
      setChatData(prev => ({ ...prev, isActive: true }));
      setMenuOpen(false);
    } 
    catch (err) {
      console.error("거래 완료 실패", err);
    }
  };

  // 새로운 채팅 메시지가 추가될 때 자동으로 스크롤을 맨 아래로 내려주는 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

   // 메뉴 바깥 클릭 감지 (누르면 메뉴 창 닫힘)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (!chatData || !partner) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border">
      {/* 상단: 프로필 + 책 제목 */}
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <img src={partner.avatarUrl} alt="상대 프로필" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">{partner.username}</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-700">{chatData.bookTitle}</div>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chats.map((c, i) => (
          <div key={i} className={`mb-2 ${c.senderId === chatData.myId ? "text-right" : "text-left"}`}>
            <p className="inline-block px-3 py-2 rounded-lg bg-white shadow">{c.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* 하단 입력 */}
      <div className="border-t p-2 flex items-center gap-2 relative bg-white">
        {/* + 버튼 */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-200">
            <Plus />
          </button>
          
          {menuOpen && (
            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 w-40">
              {/* 캘린더 */}
              <div>
                <p className="text-xs mb-1">약속 날짜</p>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border rounded px-2 py-1 w-full"
                />
                <button onClick={handleSetDeadline} className="bg-blue-500 text-white w-full mt-2 py-1 rounded">
                  설정
                </button>
              </div>
              
              {/* 사진 */}
              <label className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded cursor-pointer">
                <Image size={18} /> 사진
                <input type="file" accept="image/*" className="hidden" onChange={handleSendPicture} />
              </label>
              
              {/* 송금 */}
              <button onClick={handleSendDeal} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
                <DollarSign size={18} /> 송금
              </button>
              
              {/* 책 대출하기 (모두) */}
              {chatData.isActive && (
                <button
                  onClick={handleBorrowBook}
                  className="bg-green-500 text-white w-full py-1 rounded hover:bg-green-600"
                >
                  책 대출하기
                </button>
              )}

              {/* 거래 완료 (올린 사람만) */}
              {chatData.isActive && chatData.myId === chatData.sellerId && (
                <button
                  onClick={handleCompleteDeal}
                  className="bg-yellow-500 text-white w-full py-1 rounded hover:bg-yellow-600"
                >
                  거래 완료
                </button>
              )}
            </div>
          )}
        </div>

        {/* 입력창 */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
          className="flex-grow border rounded px-2 py-1"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* 전송 버튼 */}
        <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}