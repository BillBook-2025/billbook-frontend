// src/pages/community/CommunityPost.jsx
/* 커뮤니티 게시글 (클릭해서) 보기 페이지
- 게시글 상세: 제목, 내용, 작성자, 작성일
- [하트(좋아요 버튼)]
- 댓글 리스트
- [댓글 입력칸],[종이비행기(전송버튼)]
- 대댓글 달기
*/
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// API 함수
import { getBoardDetail,  getBoardLike,  likeBoard,  getComment,
  addComment,  addReply } from "../../api/boards";
// 하트, 댓글남기기 버튼 이모티콘으로 하기
import { Heart, Send } from "lucide-react";

export default function CommunityPost() {
  const { boardId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const [board, setBoard] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // 대댓글 상태
  const [replyContent, setReplyContent] = useState("");
  const [replyInputOpen, setReplyInputOpen] = useState(null);

  useEffect(() => {
    if (!token || !boardId) return;

    // 게시글 상세 조회
    getBoardDetail(boardId, token).then(setBoard);

    // 좋아요 개수
    getBoardLike(boardId, token).then((data) => setLikeCount(data.likeCount));

    // 댓글 조회
    fetchComments();
  }, [token, boardId]);

  const fetchComments = async () => {
    const data = await getComment(boardId, token);
    setComments(data);
  };

  const handleLike = async () => {
    await likeBoard(boardId, token);
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    await addComment(boardId, { content: commentInput }, token);
    setCommentInput("");
    fetchComments();
  };

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) return;
    await addReply(boardId, commentId, { content: replyContent }, token);
    setReplyContent("");
    setReplyInputOpen(null);
    fetchComments();
  };

  if (!board) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 게시글 정보 */}
      <div className="border rounded-lg bg-pistachio p-4">
        <h2 className="text-xl font-bold mb-2">{board.title}</h2>
        <p className="text-sm text-gray-700 mb-2">{board.content}</p>
        <p className="text-xs text-gray-500">
          작성자: {board.userId} | 작성일:{" "}
          {new Date(board.createdAt).toLocaleDateString()}
        </p>

        {/* 좋아요 버튼 */}
        <button
          className="mt-3 flex items-center gap-2 text-darkbrown"
          onClick={handleLike}
        >
          {/* 하트 누르기전 회색->누르면 레드 */}
          <Heart
            className={`w-5 h-5 ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
          <span>{likeCount}</span>
        </button>
      </div>

      {/* 댓글 영역 */}
      <div className="border rounded-lg bg-white p-4 space-y-4">
        <h3 className="font-semibold mb-2">댓글</h3>
        {comments.map((c) => (
          <div key={c.commentId} className="mb-3">
            
            {/* 댓글 */}
            <div className="border-b pb-2 last:border-b-0">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{c.userId}</span>: {c.content}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleDateString("ko-KR")}
              </p>
              
              {/* 대댓글 입력 */}
              <button
                className="text-xs text-pistachio mt-1"
                onClick={() =>
                  setReplyInputOpen(
                    replyInputOpen === c.commentId ? null : c.commentId
                  )
                }
              >
                답글 달기
              </button>

              {/* 대댓글 입력창 */}
              {replyInputOpen === c.commentId && (
                <div className="flex gap-2 mt-2 ml-4">
                  <input
                    type="text"
                    placeholder="대댓글 입력..."
                    className="flex-1 border rounded p-2 text-sm"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    className="px-2 bg-pistachio text-darkbrown rounded hover:bg-pistachio-dark"
                    onClick={() => handleAddReply(c.commentId)}
                  >
                    {/* 종이비행기 이모티콘 누르면 댓글전송 */}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 대댓글 리스트 */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-2 ml-4 space-y-2">
                  {c.replies.map((r) => (
                    <div key={r.replyId} className="text-sm text-gray-600">
                      <span className="font-medium">{r.userId}</span>:{" "}
                      {r.content}
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 댓글 작성 */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="댓글 입력..."
            className="flex-1 border rounded p-2"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            className="px-4 bg-pistachio text-darkbrown rounded hover:bg-pistachio-dark"
            onClick={handleAddComment}
          >
            {/* 종이비행기 이모티콘 누르면 댓글전송 */}
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
