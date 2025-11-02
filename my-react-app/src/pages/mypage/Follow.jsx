// src/pages/mypage/Follow.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 뒤로가기 아이콘
import { ArrowLeft } from "lucide-react"; 
// API 함수
import { fetchFollowers, fetchFollowings, unfollowUser } from "../../api/profile";

export default function Follow() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.userId;

  const [activeTab, setActiveTab] = useState("followers"); // 'followers' or 'followings'
  const [list, setList] = useState([]);

  const loadList = async () => {
    if ( !userId) return;
    try {
      let data = [];
      if (activeTab === "followers") {
        data = await fetchFollowers(userId);
      } else {
        data = await fetchFollowings(userId);
      }
      setList(data);
    } 
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadList();
  }, [activeTab, userId]);

  // 언팔로우 버튼 클릭
  const handleUnfollow = async (followId) => {
    try {
      await unfollowUser(followId); // API에서 팔로잉 해제
      setList(list.filter((user) => user.userId !== followId)); // 목록에서 제거
    } 
    catch (err) {
      console.error(err);
      alert("언팔로우 실패");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center mb-4">
        <ArrowLeft
          className="cursor-pointer"
          size={24}
          onClick={() => navigate("/mypage")}
        />
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "followers" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("followers")}
        >
          팔로워
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "followings" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("followings")}
        >
          팔로잉
        </button>
      </div>

      {/* 목록 */}
      <ul className="space-y-2">
        {list.map((user) => (
          <li
            key={user.userId}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.nickname}</span>
            </div>

            {/* 팔로잉 탭일 때만 언팔로우 버튼 */}
            {activeTab === "followings" && (
              <button
                onClick={() => handleUnfollow(user.userId)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                언팔로우
              </button>
            )}
          </li>
        ))}

        {list.length === 0 && (
          <li className="text-gray-500 text-center py-4">
            {activeTab === "followers" ? "팔로워가 없습니다." : "팔로잉이 없습니다."}
          </li>
        )}
      </ul>
    </div>
  );
}
