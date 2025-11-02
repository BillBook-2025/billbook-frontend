// src/pages/main/ChatList.jsx
/**### 채팅 목록

- 체팅 목록 전체 불러오기
- [편집]- 채팅 [선택]해서 삭제 가능
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { getChatrooms, leaveChatroom } from "../../api/chatrooms";

export default function ChatList() {
  const [chatrooms, setChatrooms] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const navigate = useNavigate();

  // 채팅 목록 불러오기
  useEffect(() => {
    getChatrooms()
      .then((data) => setChatrooms(data))
      .catch((err) => console.error("채팅 목록 불러오기 실패", err));
  }, []);

  // 채팅방 클릭 → Chatroom으로 이동
  const handleClickChatroom = (id) => {
    if (editMode) {
      toggleSelect(id);
    } 
    else {
      navigate(`/chatroom/${id}`);
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
      } 
      catch (err) {
        console.error(`채팅방 ${id} 삭제 실패`, err);
      }
    }
    setChatrooms((prev) => prev.filter((room) => !selectedRooms.includes(room.id)));
    setSelectedRooms([]);
    setEditMode(false);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col border">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-bold">채팅 목록</h1>
        <button onClick={toggleEditMode} className="text-orange-500">
          {editMode ? "완료" : "편집"}
        </button>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto">
        {chatrooms.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">채팅이 없습니다.</p>
        ) : (
          chatrooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleClickChatroom(room.id)}
              className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-100 ${
                editMode ? "pl-10" : ""
              }${editMode && selectedRooms.includes(room.id) ? "bg-pistachio bg-opacity-50" : "bg-white"}`}
            >
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room.id)}
                  onChange={() => toggleSelect(room.id)}
                  className="mr-3"
                />
              )}
              <div>
                <p className="font-semibold">{room.partnerName}</p>
                <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-400">{room.updatedAt}</p>
            </div>
          ))
        )}
      </div>

      {/* 하단 삭제 버튼 */}
      {editMode && selectedRooms.length > 0 && (
        <div className="p-4 border-t bg-gray-100">
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}
