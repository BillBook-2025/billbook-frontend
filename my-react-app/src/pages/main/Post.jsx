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
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// 하트(좋아요) 아이콘
import { Heart } from 'lucide-react';
// API 함수
import {
  bookDetail,
  deleteBook,
  likeBook,
  likeCount,
  createChatroom,
} from '../../api/books';

export default function Post() {
  const { bookId } = useParams();

  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const getBookCondition = (point) => {
    switch (point) {
      case 3:
        return '좋음';
      case 2:
        return '보통';
      case 1:
        return '나쁨';
      default:
        return '알 수 없음';
    }
  };

  // 게시글 로드 + 좋아요 상태
  useEffect(() => {
    async function loadData() {
      try {
        const data = await bookDetail(bookId);
        setPost(data);

        const likeData = await likeCount(bookId);
        setLikesCount(likeData.count);
        setLiked(likeData.likedByMe);
      } catch (err) {
        console.error('게시글 로드 실패', err);
      }
    }
    loadData();
  }, [bookId]);

  if (!post) return <div>로딩 중...</div>;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?.id;
  const isOwner = userId === post.sellerId;

  // 게시자이면 글 삭제 가능
  const handleDelete = async () => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    try {
      await deleteBook(bookId);
      alert('삭제 완료');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  // 좋아요 누르기
  const handleLike = async () => {
    try {
      await likeBook(bookId);
      setLikesCount((prev) => {
        if (liked) return prev - 1;
        else return prev + 1;
      });
      setLiked((prev) => !prev);
    } catch (err) {
      console.error('좋아요 실패', err);
    }
  };

  // 채팅 생성
  const handleChat = async () => {
    try {
      const data = await createChatroom(bookId);
      navigate(`/chat/${data.chatroomId}`);
    } catch (err) {
      console.error('채팅방 생성 실패', err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">{post.title}</h1>
      <p>작성자: {post.username || post.sellerId}</p>
      <img
        src={post.bookPic[0]?.url || '/default_book.png'}
        alt={`책 이미지: ${post.title}`}
        className="w-full h-60 object-cover rounded mb-2"
      />
      <p className="text-gray-500 mt-1">
        상태: {getBookCondition(post.bookPoint)}
      </p>
      <p className="mt-1">설명: {post.content}</p>

      <div className="flex items-center gap-4 mb-2">
        {isOwner ? (
          <>
            <button
              onClick={() => navigate(`/edit/${bookId}`)}
              className="px-4 py-2 bg-pistachio text-darkbrown rounded hover:bg-yellow-300"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-red-500"
            >
              삭제
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLike} className="flex flex-col items-center">
              <Heart
                color={liked ? 'red' : 'gray'}
                fill={liked ? 'red' : 'none'}
              />
              <span className="text-sm">{likesCount}</span>
            </button>
            <button
              onClick={handleChat}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              채팅하기
            </button>
            <button
              onClick={() => alert('신고 기능 준비 중입니다.')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              신고하기
            </button>
          </>
        )}
      </div>

      <p className="text-gray-700 mt-2">{post.description}</p>
      <p className="text-gray-500 mt-1">
        위치: {post.locate?.address || '없음'}
      </p>
    </div>
  );
}
