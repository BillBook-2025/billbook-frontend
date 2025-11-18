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

import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// API
import { getChats, sendPicture, setDeadline } from '../../api/chatrooms';
import { returnBook, borrowBook } from '../../api/books';
// 아이콘
import {
  ArrowLeft, MoreVertical, Send, Plus, Image as ImageIcon, Calendar, DollarSign
} from 'lucide-react';
// 웹소켓
import { connectWebSocket, subscribeChatroom, sendMessage } from '../../api/websocket';

export default function Chatroom() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState({
    id: null,
    partnerName: '상대방',
    myId: null,
    isActive: true,
  });

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deadline, setDeadlineState] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setChatData(prev => ({ ...prev, myId: userInfo.id }));
    }
  }, []);

  // 데이터 불러오기
  useEffect(() => {
    if (!chatId) return;
    async function fetchData() {
      try {
        const res = await getChats(chatId);
        if (res && Array.isArray(res.content)) {
           setMessages(res.content);
        } else if (Array.isArray(res)) {
           setMessages(res);
        } else if (res && Array.isArray(res.messages)) {
           setMessages(res.messages);
        } else {
           setMessages([]);
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    }
    fetchData();
  }, [chatId]);

  // 웹소켓 연결
  useEffect(() => {
    if (!chatId) return;
    connectWebSocket(() => {
      const unsubscribe = subscribeChatroom(chatId, (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, [chatId]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

const handleSend = () => {
  if (!input.trim()) return;

  const messagePayload = {
    senderId: userId,
    message: input,   
    type: "CHAT"      
  };

  sendMessage(chatId, messagePayload);

  setInput('');
};

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await sendPicture(chatId, formData);
      setShowPlusMenu(false);
    } catch (err) { console.error(err); }
  };

  const handleSetDeadline = async () => {
    if (!deadline) return alert('날짜를 선택해주세요');
    try {
      await setDeadline(chatId, { deadline });
      alert('반납 기한 설정 완료');
      setShowDatePicker(false);
      setShowPlusMenu(false);
    } catch (err) { console.error(err); }
  };

  const handleBorrowBook = () => alert('기능 준비 중입니다.');
  const handleCompleteDeal = () => alert('기능 준비 중입니다.');
  const handleSendDeal = () => alert('송금 기능 준비 중입니다.');

  return (
    // [PC 레이아웃 적용]
    // h-screen: 모니터 화면 꽉 차게
    // max-w-5xl: 너무 넓으면 보기 싫으니 적당히 넓게 (약 1024px)
    <div className="flex flex-col h-screen bg-gray-100 w-full max-w-5xl mx-auto border-x shadow-2xl relative overflow-hidden">
      
      {/* 1. 상단 헤더 (고정) */}
      <div className="flex-none flex items-center justify-between p-5 bg-white border-b shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h2 className="font-bold text-xl text-gray-900">{chatData.partnerName}</h2>
            {/* 필요시 여기에 책 제목 등 추가 정보 표시 */}
          </div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </button>
        
        {/* 우측 상단 메뉴 드롭다운 */}
        {showMenu && (
            <div className="absolute right-4 top-16 w-48 bg-white border rounded-lg shadow-xl z-30 overflow-hidden">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium">거래 관리</button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-500 font-medium border-t">나가기</button>
            </div>
        )}
      </div>

      {/* 2. 채팅 내역 (스크롤 영역) */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f2f4f6]" 
        ref={scrollRef}
      >
        {messages.map((msg, idx) => {
          const isMe = String(msg.senderId) === String(chatData.myId);
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {/* 상대방 프사 (선택) */}
              {!isMe && <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0" />}
              
              <div 
                className={`max-w-[60%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed break-words ${
                  msg.senderId === userId
                    ? 'bg-pistachio text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.message || msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 하단 입력창 (고정) */}
      <div className="flex-none bg-white border-t p-4 z-20">
        
        {/* 입력 컨트롤러 */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setShowPlusMenu(!showPlusMenu);
              setShowDatePicker(false);
            }} 
            className={`p-3 rounded-full transition-all duration-200 ${showPlusMenu ? 'bg-gray-200 rotate-45' : 'hover:bg-gray-100'}`}
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-6 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pistachio/50 text-base"
          />
          
          <button 
            onClick={handleSend} 
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all shadow-md ${
                message.trim() 
                ? 'bg-pistachio text-white hover:opacity-90 hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={message.trim() ? { backgroundColor: '#93C572' } : {}}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>

        {/* 확장 메뉴 */}
        {showPlusMenu && (
          <div className="grid grid-cols-4 gap-6 mt-4 p-6 bg-gray-50 rounded-2xl border animate-fade-in-up">
             <MenuButton 
                icon={<ImageIcon size={28} className="text-blue-500" />} 
                label="사진" 
                color="bg-blue-100"
                onClick={() => fileInputRef.current.click()} 
             />
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            
             <MenuButton 
                icon={<Calendar size={28} className="text-orange-500" />} 
                label="약속 잡기" 
                color="bg-orange-100"
                onClick={() => { setShowDatePicker(true); setShowPlusMenu(false); }} 
             />

             <MenuButton 
                icon={<DollarSign size={28} className="text-green-500" />} 
                label="송금" 
                color="bg-green-100"
                onClick={handleSendDeal} 
             />
            
             <MenuButton 
                icon={<span className="text-purple-600 font-bold text-lg">Book</span>} 
                label="책 대출" 
                color="bg-purple-100"
                onClick={handleBorrowBook} 
             />
          </div>
        )}
        
        {/* 날짜 설정창 */}
        {showDatePicker && (
          <div className="mt-4 p-6 bg-white rounded-2xl border shadow-lg animate-fade-in-up">
             <p className="text-lg font-bold mb-4 text-gray-800">반납 기한 설정</p>
             <div className="flex gap-3">
                <input 
                    type="date" 
                    value={deadline} 
                    onChange={(e) => setDeadlineState(e.target.value)} 
                    className="border p-3 rounded-lg flex-1 text-base bg-gray-50" 
                />
                <button onClick={handleSetDeadline} className="bg-darkbrown text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90">확인</button>
                <button onClick={() => setShowDatePicker(false)} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300">취소</button>
             </div>
          </div>
        )}
      </div>

    </div>
  );
}

// 메뉴 버튼 컴포넌트 (코드 깔끔하게 분리)
function MenuButton({ icon, label, color, onClick }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2 group">
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
        </button>
    );
}