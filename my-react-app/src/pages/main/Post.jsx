// src/pages/main/Post.jsx

// 같은 게시글을 눌렀을 때, 내가 올린 글이면 (게시자 입장)으로 보이고 남의 글이면(보는 입장)으로 보이도록...
/**### 거래글(보는 입장)

- 책 정보
- [좋아요]
- [채팅하기] - 제공자(빌려주는사람)-빌리는사람(대여자)간의 채팅 화면으로 연결
- 이 게시글 [신고하기]
 */
/**
 *  ### 거래글(게시자 입장)

- [수정]
- [삭제]
 */
// src/pages/main/Post.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// 하트(좋아요) 아이콘
import { Heart } from "lucide-react"; 
// API 함수
import { fetchBookDetail, deleteRegisteredBook, likeBook, unlikeBook, fetchLikeCount, createChatroom } from '../../api/books';

export default function Post() {
  const { bookId } = useParams();
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  // 게시글 로드 + 좋아요 상태
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const data = await fetchBookDetail(bookId, token);
        setPost(data);

        const likeData = await fetchLikeCount(bookId, token);
        setLikeCount(likeData.count);
        setLiked(likeData.likedByMe);
      } 
      catch (err) {
        console.error("게시글 로드 실패", err);
      }
    }
    loadData();
  }, [bookId, token]);

  if (!post) return <div>로딩 중...</div>;

  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      await deleteRegisteredBook(bookId, token);
      alert("삭제 완료");
      window.location.href = "/";
    } 
    catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  // 좋아요 누르기
  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeBook(bookId, token);
        setLikeCount(prev => prev - 1); //좋아요 취소
      } else {
        await likeBook(bookId, token);
        setLikeCount(prev => prev + 1); // 좋아요 추가
      }
      setLiked(!liked);
    } 
    catch (err) {
      console.error("좋아요 실패", err);
    }
  };

  // 채팅하기
  const handleChat = async () => {
    try {
      const data = await createChatroom(bookId, token);
      window.location.href = `/chat/${data.chatroomId}`;
    } 
    catch (err) {
      console.error("채팅방 생성 실패", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">{post.title}</h1>
      <p>작성자: {post.username}</p>
      <img src={post.bookImageUrl || '/default_book.png'} alt={post.title} className="w-full h-60 object-cover rounded mb-2" />

      <div className="flex items-center gap-4 mb-2">
        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart color={liked ? "red" : "gray"} fill={liked ? "red" : "none"} />
          <span className="text-sm">{likeCount}</span>
        </button>
        <button onClick={handleChat} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          채팅하기
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          삭제
        </button>
      </div>

      <p className="text-gray-700 mt-2">{post.description}</p>
      <p className="text-gray-500 mt-1">위치: {post.locate?.address || "없음"}</p>
      <p className="text-gray-500 mt-1">상태: {post.bookPoint}</p>
    </div>
  );
}
