// src/pages/community/CommunityPost.jsx
/* 커뮤니티 게시글 (클릭해서) 보기 페이지
- 게시글 상세: 제목, 내용, 작성자, 작성일
- [하트(좋아요 버튼)]
- 댓글 리스트
- [댓글 입력칸],[종이비행기(전송버튼)]
- 대댓글 달기
*/
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// API 함수
import {
  getBoardDetail,
  getBoardLike,
  likeBoard,
  getComment,
  addComment,
  addReply,
} from '../../api/boards';
// 하트, 댓글남기기 버튼 이모티콘으로 하기
import { Heart, Send } from 'lucide-react';

export default function CommunityPost() {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  // 대댓글 상태
  const [replyContent, setReplyContent] = useState('');
  const [replyInputOpen, setReplyInputOpen] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComment(boardId);
      setComments(data);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      // 댓글 로드에 실패해도 페이지가 죽지 않도록 빈 배열 설정
      setComments([]);
    }
  }, [boardId]);

  useEffect(() => {
    // 게시글 상세 조회
    getBoardDetail(boardId).then(setBoard);

    // 좋아요 개수
    getBoardLike(boardId)
      .then((data) => {
        setLikeCount(data.likeCount);
        setLiked(data.isLiked);
      })
      .catch(console.error);

    // 댓글 조회
    fetchComments();
  }, [boardId, fetchComments]);

  // 좋아요누르기
  const handleLike = async () => {
    await likeBoard(boardId);
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // 댓글달기
  const handleAddComment = async () => {
    try {
      await addComment(boardId, { content: commentInput });
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert(error.message);
    }
  };

  // 대댓글달기
  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      await addComment(boardId, { content: commentInput });
      fetchComments();
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      alert(error.message);
    }
  };

  if (!board) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 게시글 정보 */}
      <div className="border rounded-lg bg-ivory p-4">
        <h2 className="text-xl font-bold mb-2">{board.title}</h2>
        <p className="text-sm text-gray-700 mb-2">{board.content}</p>
        <p className="text-xs text-gray-500">
          작성자: {board.userId} | 작성일:{' '}
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
              liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
          <span>{likeCount}</span>
        </button>
      </div>

      {/* 댓글 영역 */}
      <div className="border rounded-lg bg-white p-4 space-y-4">
        <h3 className="font-semibold mb-2">댓글</h3>
        {Array.isArray(comments) &&
          comments.map((c) => (
            <div key={c.commentId} className="mb-3">
              {/* 댓글 */}
              <div className="border-b pb-2 last:border-b-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{c.userId}</span>: {c.content}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                </p>
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
            className="px-4 bg-orange-400 text-white rounded hover:bg-pistachio-dark"
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
