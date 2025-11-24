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

// src/pages/main/Chatroom.jsx

// src/pages/main/Chatroom.jsx

import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// API
import {
  getChats,
  getChatroomDetail,
  sendPicture,
  setDeadline,
} from '../../api/chatrooms';
import { returnBook, borrowBook } from '../../api/books';
// 아이콘
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Plus,
  X,
  Image as ImageIcon,
  Calendar,
  DollarSign,
} from 'lucide-react';
// 웹소켓
import {
  connectWebSocket,
  subscribeChatroom,
  sendMessage,
} from '../../api/websocket';

export default function Chatroom() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?.id;
  const currentUserId = userId;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [bookId, setBookId] = useState(location.state?.bookId || null);
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setChatData((prev) => ({ ...prev, myId: userInfo.id }));
    }
  }, []);

  // 데이터 불러오기
  useEffect(() => {
    if (!chatId) return;

    // 채팅방 상세 정보
    /*
    async function loadChatroomDetail() {
      try {
        const detail = await getChatroomDetail(chatId);
        setChatData(detail);
      } catch (err) {
        console.error('채팅방 상세 정보 로드 실패:', err);
      }
    } 
    */

    // 채팅 메시지 목록
    async function loadMessages() {
      try {
        const msgData = await getChats(chatId);
        setMessages(msgData.content || []);
      } catch (err) {
        console.error('메시지 로드 실패:', err);
      }
    }

    loadMessages();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showPlusMenu, showDatePicker, imagePreviewUrl]);

  const handleSend = async () => {
    if (selectedImage) {
      await handleImageSend();
      // return;
    }

    // 텍스트 메시지 전송
    if (message.trim()) {
      try {
        sendMessage(chatId, userId, message);
        setMessage('');
      } catch (err) {
        console.error('텍스트 전송 실패:', err);
        alert('메시지 전송 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePictureMenuClick = () => {
    fileInputRef.current.click();
    setShowPlusMenu(false); // 메뉴 닫기
  };

  // 이미지 선택
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  // 이미지 전송
  const handleImageSend = async () => {
    if (!selectedImage || !chatId) return;

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await sendPicture(chatId, formData);

      const newMessage = {
        messageId: Date.now(),
        senderId: currentUserId,
        content: response.url,
        time: new Date().toISOString(),
        type: 'IMAGE',
      };
      setMessages((prev) => [...prev, newMessage]);

      setSelectedImage(null);
      setImagePreviewUrl(null);
    } catch (error) {
      console.error('사진 메시지 전송 실패:', error);
      alert(`사진 전송에 실패했습니다. ${error.message}`);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 날짜 ㅁㅁㅁㅁ년 ㅁ월 ㅁ일 형식으로 만들기
  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '유효하지 않은 날짜';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 시스템 메시지를 로컬 채팅에 추가
  const sendSystemMessage = (text) => {
    const newMessage = {
      messageId: Date.now(),
      senderId: 'system',
      content: text,
      time: new Date().toISOString(),
      type: 'SYSTEM',
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // 책 대출 처리
  const handleBorrow = async () => {
    if (!bookId) {
      alert('책 정보가 없습니다.');
      console.error('책 ID를 찾을 수 없음:', { bookId });
      return;
    }

    if (!window.confirm('책 대출 처리를 하시겠습니까?')) return;

    try {
      await borrowBook(bookId, { status: 'ON_LOAN' });

      alert(
        '책 대출 처리가 완료되었습니다. 게시글 상태가 [대여 중]으로 변경됩니다.'
      );
    } catch (err) {
      console.error('책 대출 처리 실패:', err);
      alert('책 대출 처리에 실패했습니다. 권한을 확인해주세요.');
    }
  };

  // 반납일자
  const handleSetDeadline = async () => {
    if (!deadline) {
      alert('반납 일자를 선택해주세요.');
      return;
    }
    const returnTimeISO = `${deadline}T00:00:00+09:00`;

    try {
      await setDeadline(chatId, { returnTime: returnTimeISO });

      const formattedDate = formatDateDisplay(deadline);
      const systemMessage = `반납 일자가 ${formattedDate}로 설정되었습니다!`;

      sendSystemMessage(systemMessage);

      setShowDatePicker(false);

      console.log(`반납 기한 설정 완료: ${formattedDate}`);
    } catch (error) {
      console.error('반납 기한 설정 실패', error);
      alert('반납 기한 설정에 실패했습니다. 다시 시도해 주세요.');
    }
  };
  const handleBorrowBook = () => alert('기능 준비 중입니다.');
  const handleCompleteDeal = () => alert('기능 준비 중입니다.');
  const handleSendDeal = () => alert('송금 기능 준비 중입니다.');

  return (
    <div className="flex flex-col h-[100dvh] pb-16 bg-gray-100 w-full max-w-5xl mx-auto border-x shadow-2xl relative overflow-hidden">
      {/* 상단 헤더 */}
      <div className="flex-none flex items-center justify-between py-3 px-4 bg-white border-b shadow-sm ">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h2 className="font-bold text-xl text-gray-900">
              {chatData.partnerName}
            </h2>
            {/* 필요시 여기에 책 제목 등 추가 정보 표시 */}
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </button>

        {/* 우측 상단 메뉴 드롭다운 */}
        {showMenu && (
          <div className="absolute right-4 top-16 w-48 bg-white border rounded-lg shadow-xl z-30 overflow-hidden">
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium">
              거래 관리
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-500 font-medium border-t">
              나가기
            </button>
          </div>
        )}
      </div>

      {/* 채팅 내역 */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f2f4f6]"
        ref={scrollRef}
      >
        {messages.map((msg, idx) => {
          const isMe = String(msg.senderId) === String(chatData.myId);
          const content = msg.content || msg.message;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* 상대방 프사 */}
              {!isMe && (
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0" />
              )}

              <div
                className={`max-w-[60%] px-4 py-3 rounded-2xl text-base shadow-sm leading-relaxed break-words ${
                  msg.senderId === userId
                    ? 'bg-pistachio text-darkbrown rounded-tr-none'
                    : 'bg-white border border-orange-500 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.type === 'IMAGE' ||
                content?.startsWith('http') ||
                content?.startsWith('/') ? (
                  <img
                    src={content}
                    alt="전송된 사진"
                    className="rounded-lg max-w-full h-auto mt-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  content
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 입력창 */}
      <div className="flex-none bg-white border-t p-4 z-20 transition-all duration-300 ease-in-out">
        {/* 💡 *유지*: 이미지 미리보기 */}
        {imagePreviewUrl && (
          <div className="absolute bottom-full mb-4 left-4 bg-white p-2 rounded-lg shadow-xl border z-20">
            <p className="font-semibold text-darkbrown mb-2 text-sm">
              사진 미리보기
            </p>
            <div className="relative w-40 h-40">
              <img
                src={imagePreviewUrl}
                alt="미리보기"
                className="w-full h-full object-cover rounded"
              />
              {/* 취소 버튼 */}
              <button
                onClick={clearImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* 입력 컨트롤러 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowPlusMenu(!showPlusMenu);
              setShowDatePicker(false);
            }}
            className={`p-3 rounded-full transition-all duration-200 ${
              showPlusMenu ? 'bg-gray-200 rotate-45' : 'hover:bg-gray-100'
            }`}
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              !e.nativeEvent.isComposing &&
              (message.trim() || selectedImage) &&
              handleSend()
            }
            placeholder={
              selectedImage ? '사진 전송 준비 완료' : '메시지를 입력하세요...'
            }
            className="flex-1 px-6 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pistachio/50 text-base"
            disabled={!!selectedImage}
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() && !selectedImage}
            className={`p-3 rounded-full transition-all shadow-md ${
              message.trim() || selectedImage
                ? 'bg-orange-300 text-white hover:opacity-90 hover:scale-105'
                : 'bg-yellow-300 text-darkbrown cursor-not-allowed'
            }`}
            style={
              message.trim() || selectedImage
                ? { backgroundColor: '#ffb758ff' }
                : {}
            }
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
              onClick={handlePictureMenuClick}
            />

            <MenuButton
              icon={<Calendar size={28} className="text-orange-500" />}
              label="약속 잡기"
              color="bg-orange-100"
              onClick={() => {
                setShowDatePicker(true);
                setShowPlusMenu(false);
              }}
            />

            <MenuButton
              icon={<DollarSign size={28} className="text-green-500" />}
              label="송금"
              color="bg-green-100"
              onClick={handleSendDeal}
            />

            <MenuButton
              icon={
                <span className="text-purple-600 font-bold text-lg">Book</span>
              }
              label="책 대출"
              color="bg-purple-100"
              onClick={handleBorrow}
            />
          </div>
        )}

        {/* 날짜 설정창 */}
        {showDatePicker && (
          <div className="mt-4 p-6 bg-white rounded-2xl border shadow-lg animate-fade-in-up">
            <p className="text-lg font-bold mb-4 text-gray-800">
              반납 기한 설정
            </p>
            <div className="flex gap-3">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadlineState(e.target.value)}
                className="border p-3 rounded-lg flex-1 text-base bg-gray-50"
              />
              <button
                onClick={handleSetDeadline}
                className="bg-darkbrown text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90"
              >
                확인
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 메뉴 버튼 컴포넌트
function MenuButton({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
        {label}
      </span>
    </button>
  );
}
