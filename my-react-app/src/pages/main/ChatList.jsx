// src/pages/main/ChatList.jsx
/**### 채팅 목록

- 체팅 목록 전체 불러오기
- [편집]- 채팅 [선택]해서 삭제 가능
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// API 함수
import { getChatroom, leaveChatroom } from '../../api/chatrooms';
import { bookDetail } from '../../api/books';
// 아이콘
import { BookOpenText } from 'lucide-react';

export default function ChatList() {
  const [chatrooms, setChatrooms] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?.id;

  // 채팅 목록 불러오기
  useEffect(() => {
    if (!userId) {
      console.error("로그인된 유저 ID가 없습니다.");
      return;
    }

    getChatroom(userId)
      .then(async (data) => {
        // 채팅방 목록을 먼저 가져온 뒤
        // bookId를 이용해 책 제목을 추가로 조회 -> 방 이름
        const roomsWithTitle = await Promise.all(
          data.map(async (room) => {
            if (!room.bookId) return room;

            try {
              const bookInfo = await bookDetail(room.bookId);
              return { ...room, bookTitle: bookInfo.title };
            }
            catch (err) {
              return room;
            }
          })
        );

        setChatrooms(roomsWithTitle);
      })
      .catch((err) => console.error('채팅 목록 불러오기 실패', err));
  }, []);

  // 채팅방 클릭 → Chatroom으로 이동
  const handleClickChatroom = (roomId, bookId) => {
    if (editMode) {
      toggleSelect(id);
    } else {
      console.log('--- navigating with ---');
      console.log('roomId:', roomId);
      console.log('bookId to pass:', bookId);

      navigate(`/chatRoom/${roomId}`, { state: { bookId } });
    }
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedRooms([]);
  };

  // 채팅방 선택 토글
  const toggleSelect = (id) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((roomId) => roomId !== id) : [...prev, id]
    );
  };

  // 선택한 채팅방 삭제
  const handleDelete = async () => {
    for (const id of selectedRooms) {
      try {
        await leaveChatroom(id);
      } catch (err) {
        console.error(`채팅방 ${id} 삭제 실패`, err);
      }
    }
    setChatrooms((prev) =>
      prev.filter((room) => !selectedRooms.includes(room.id))
    );
    setSelectedRooms([]);
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[100dvh] flex flex-col bg-white border-x shadow-2xl">
      <div className="flex-none flex justify-between items-center p-5 bg-white border-b-4 shadow-lg">
        <h1 className="text-3xl font-extrabold text-darkbrown">채팅 목록</h1>
        <button
          onClick={toggleEditMode}
          className={`px-4 py-2 rounded-xl font-bold transition-all shadow-md ${
            editMode
              ? 'bg-darkbrown text-white hover:bg-darkbrown/90'
              : 'text-darkbrown border border-pistachio/50 hover:bg-pistachio/20 bg-pistachio/10'
          }`}
        >
          {editMode ? '완료' : '편집'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white divide-y divide-gray-200">
        {chatrooms.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 p-4 text-lg">
            아직 시작된 채팅이 없습니다.
          </p>
        ) : (
          chatrooms.map((room) => (
            <div
              key={room.id}
              onClick={() =>
                editMode
                  ? toggleSelect(room.id)
                  : handleClickChatroom(room.id, room.bookId)
              }
              className={`flex items-center gap-6 py-4 px-6 transition-all relative cursor-pointer ${
                editMode
                  ? selectedRooms.includes(room.id)
                    ? 'bg-pistachio/10 border-l-4 border-darkbrown'
                    : 'hover:bg-gray-50'
                  : 'hover:bg-gray-100'
              }`}
            >
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room.id)}
                  onChange={() => toggleSelect(room.id)}
                  className="w-5 h-5 text-darkbrown bg-white border-gray-400 rounded focus:ring-pistachio focus:ring-2 checked:bg-darkbrown checked:border-darkbrown flex-shrink-0"
                />
              )}

              {/* 책 이미지/프사 Placeholder */}
              <div
                className={`w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center border-2 border-darkbrown shadow-md ${
                  editMode ? 'bg-pistachio/30' : 'bg-pistachio/50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open-text text-darkbrown"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  <path d="M6 8h2" />
                  <path d="M6 12h2" />
                  <path d="M16 8h2" />
                  <path d="M16 12h2" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-xl text-gray-900 truncate">
                  {room.bookTitle || room.partnerName}
                </p>
                <p className="text-base text-gray-600 truncate mt-1">
                  {room.lastMessage || '새로운 대화가 시작되었습니다.'}
                </p>
              </div>

              <div className="flex flex-col items-end self-start pt-1.5 flex-shrink-0">
                <p className="text-xs text-gray-400">{room.updatedAt}</p>
                {/* 여기에 안 읽은 메시지 뱃지 등을 추가할 수 있습니다. */}
              </div>
            </div>
          ))
        )}
      </div>

      {editMode && selectedRooms.length > 0 && (
        <div className="flex-none p-4 border-t bg-white shadow-2xl">
          <button
            onClick={handleDelete}
            className="w-full bg-darkbrown text-white py-3 rounded-xl font-bold hover:bg-darkbrown/90 transition shadow-lg text-lg"
          >
            선택된 채팅방 {selectedRooms.length}개 삭제
          </button>
        </div>
      )}
    </div>
  );
}