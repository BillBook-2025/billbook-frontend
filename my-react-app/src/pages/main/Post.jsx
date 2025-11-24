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
// 구글맵
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  // 게시글 로드 + 좋아요 상태
  useEffect(() => {
    async function loadData() {
      try {
        const data = await bookDetail(bookId);
        setPost(data);

        // 키 이름 둘다 확인..
        const postLoc = data.locate || data.location;
        if (postLoc && postLoc.latitude && postLoc.longitude) {
          setMapCenter({
            lat: Number(postLoc.latitude),
            lng: Number(postLoc.longitude),
          });
        }

        const likeData = await likeCount(bookId);
        // 좋아요 수
        setLikesCount(Number(likeData.likeCount) || 0);
        // 좋아요 눌렀는지
        setLiked(!!likeData.isLiked);
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

  // 좋아요누르기
  const handleLike = async () => {
    try {
      const data = await likeBook(bookId);

      setLiked(!!data.isLiked); 
      setLikesCount(Number(data.likeCount) || 0);

    } catch (err) {
      console.error('좋아요 처리 실패', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 채팅 생성
  const handleChat = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const buyerId = userInfo?.id;

      if (!buyerId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const data = await createChatroom(bookId, buyerId);

      if (data && data.id) {
        navigate(`/chatRoom/${data.id}`);
      } else {
        console.error('채팅방 ID를 받지 못했습니다.', data);
      }
    } catch (err) {
      console.error('채팅방 생성 실패', err);
      if (err.status === 403) {
        alert('본인의 게시글에는 채팅방을 만들 수 없습니다.');
      } else if (err.status === 409) {
        alert('이미 채팅방이 존재합니다.');
      } else if (err.status === 404) {
        alert('존재하지 않는 게시글입니다.');
      } else {
        alert('채팅방 생성에 실패했습니다.');
      }
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
      <p className="mt-1"> 상태: {post.cond || post.condition}</p>
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
              <span>{likesCount || 0}</span>
            </button>
            <button
              onClick={handleChat}
              className="px-4 py-2 bg-pistachio text-white rounded hover:bg-orange-500"
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

      <div className="text-xs text-gray-500">
        {(post.locate || post.location)?.address}
      </div>
      {/* 구글맵 표시 */}
      {mapCenter && apiKey ? (
        <div className="mt-4 h-60 w-full rounded-md overflow-hidden border">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={15}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
      ) : (
        <p className="text-sm text-gray-400">지도 정보가 없습니다.</p>
      )}
    </div>
  );
}
