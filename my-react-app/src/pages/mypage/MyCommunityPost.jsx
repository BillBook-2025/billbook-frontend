// src/pages/mypage/MyCommunityPost.jsx
/*
* 내가 올린 커뮤니티 글 전체 목록 
*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { userBoards } from "../../api/profile"; // 유저 게시글 조회 API

export default function MyBoardPost() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.userId;

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    userBoards(userId)
      .then((data) => {
        // 작성일 기준 최신순 정렬
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBoards(sorted);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">내 커뮤니티 글</h2>

      {boards.length === 0 ? (
        <p className="text-gray-500">등록한 게시글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {boards.map((b) => (
            <li
              key={b.boardId}
              className="border rounded-lg bg-white shadow hover:shadow-md transition cursor-pointer"
              // 누르면 CommunityPost 페이지로 이동
              onClick={() => navigate(`/boards/${b.boardId}`)}
            >
              {/* 제목 */}
              <h3 className="text-darkbrown truncate mb-2">
                {b.title}
              </h3>

              {/* 날짜, 댓글수, 좋아요수 */}
              <div className="text-sm text-darkbrown truncate">
                <span>작성일: {new Date(b.createdAt).toLocaleDateString("ko-KR")}</span>
                <span>댓글: {b.commentsCount}</span>
                <span>좋아요: {b.likeCount}</span>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}
