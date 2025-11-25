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
// 아이콘
import { Heart, MapPin, AlertTriangle } from 'lucide-react';
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
    const prevLiked = liked;
    const prevLikesCount = likesCount;

    // 좋아요 누른 거 즉시 반영하기
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevLikesCount - 1 : prevLikesCount + 1);
    
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
        navigate(`/chatRoom/${data.id}`, { state: { bookId } });
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
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* 이미지 */}
        <div className="relative w-full h-80">
          <img
            src={post.bookPic[0]?.url || '/default_book.png'}
            alt={`책 이미지: ${post.title}`}
            className="w-full h-full object-cover"
          />
          {/* 상태 */}
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-base font-semibold px-4 py-2 rounded-full shadow-md">
            상태: {post.cond || post.condition || '정보 없음'}
          </span>
        </div>

        <div className="p-6">
          
          {/* 제목 */}
          <div className="border-b pb-4 mb-4">
            <h1 className="text-3xl font-extrabold text-darkbrown mb-1">{post.title}</h1>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-700">작성자:</span>{' '}
              {post.username || post.sellerId}
            </p>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-l-4 border-pistachio pl-2">
              책 정보
            </h2>

            {/* 내용 요약 카드 */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p className="text-sm font-semibold text-gray-700 mb-1">내용</p>
              <p className="text-gray-800 whitespace-pre-wrap text-base">
                {post.content}
              </p>
            </div>

            {/* 상세 설명 */}
            {post.description && (
              <div className="text-sm text-gray-600 border-t pt-3">
                <p className="font-semibold mb-1">상세 설명</p>
                <p>{post.description}</p>
              </div>
            )}
          </div>

          {/* 지도 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-l-4 border-pistachio pl-2 mb-3">
              거래 희망 위치
            </h2>
            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-darkbrown" />
              <span>{(post.locate || post.location)?.address || '위치 정보 없음'}</span>
            </div>

            {/* 구글맵 표시 */}
            {mapCenter && apiKey ? (
              <div className="h-60 w-full rounded-md overflow-hidden border shadow-md">
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
              <p className="text-sm text-gray-400 mt-2">지도 정보가 없습니다.</p>
            )}
          </div>

          {/* 5. 액션 버튼 */}
          <div className="pt-4 border-t">
            {isOwner ? (
              // 게시자 모드: 수정, 삭제
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate(`/edit/${bookId}`)}
                  className="flex-1 px-4 py-3 bg-pistachio text-darkbrown font-bold rounded-lg hover:bg-yellow-300 transition shadow-md"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  삭제
                </button>
              </div>
            ) : (
              // 사용자 모드: 좋아요, 채팅, 신고
              <div className="flex items-center justify-between gap-4 mt-3">
                {/* 좋아요 버튼 */}
                <button
                  className="flex items-center gap-1 p-3 border rounded-full text-darkbrown hover:bg-gray-100 transition shadow-sm"
                  onClick={handleLike}
                  aria-label="좋아요"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-lg font-semibold">{likesCount || 0}</span>
                </button>

                {/* 채팅하기 버튼 (주요 행동 강조) */}
                <button
                  onClick={handleChat}
                  className="flex-1 px-6 py-3 bg-pistachio text-darkbrown font-bold rounded-lg hover:bg-yellow-300 transition shadow-lg"
                >
                  채팅하기
                </button>

                {/* 신고하기 버튼 (보조 행동) */}
                <button
                  onClick={() => alert('신고 기능 준비 중입니다.')}
                  className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition shadow-sm"
                  aria-label="신고하기"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}