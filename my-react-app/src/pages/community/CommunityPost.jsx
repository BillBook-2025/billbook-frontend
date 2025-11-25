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
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* 게시글 정보 */}
        <div className="border-b-2 border-pistachio pb-5 space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-snug">{board.title}</h1>
          
          <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 shadow-inner">{board.content}</p>

          <div className="flex justify-end text-sm text-gray-500 pt-2">
            <p className="text-xs font-medium text-gray-600">
              작성자: <span className="text-orange-500">{board.userId}</span> | 작성일:{' '}
              {new Date(board.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* 좋아요 버튼 */}
          <div className="pt-2 flex justify-end">
            <button
              className="flex items-center gap-2 text-gray-600 transition duration-300 transform hover:scale-105 hover:text-red-600"
              onClick={handleLike}
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-300 ${
                  liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
              <span className="text-lg font-semibold">{likeCount}</span>
            </button>
          </div>
        </div>

        {/* 댓글 영역 */}
        <div className="p-0 space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">댓글</h3>
          
          {Array.isArray(comments) &&
            comments.map((c) => (
              <div key={c.commentId} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                
                {/* 댓글 */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-800 font-medium">
                    <span className="text-orange-500 font-bold">{c.userId}</span>: {c.content}
                  </p>
                  <p className="text-xs text-gray-400 flex justify-between items-center">
                    {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}

          {/* 댓글 작성 */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="댓글 입력..."
              className="flex-1 border-2 border-gray-300 rounded-full p-3 focus:border-pistachio focus:ring-0 transition duration-150"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              className="w-12 h-12 flex items-center justify-center bg-pistachio text-white rounded-full hover:bg-orange-500 shadow-lg transition duration-150 transform hover:scale-105"
              onClick={handleAddComment}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}