// src/pages/mypage/MyPage.jsx
/**
- 사진, 닉네임, 지역
- [프로필 수정] - 수정 : [사진] [닉네임] [지역] post
- 결제수단 관리
- 포인트
- 찜하기 목록
- 빌린 책 목록 - ‘완료’ 거래에 한해서 [매너평가하기]
- 등록한 책 목록 / [책] 누르면 - 거래관리 페이지로 이동
- 내가 쓴 커뮤니티 글 목록
- 팔로워 / 팔로잉 조회
 * 
 */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// 프로필 기본 사진 용 아이콘
import { User } from 'lucide-react';
// API 함수
import { myInfo, editMyInfo, myLikes, myPoints } from '../../api/my';
import {
  uploadProfileImage,
  borrowedBooks,
  registeredBooks,
  userBoards,
  fetchFollowers,
  fetchFollowings,
} from '../../api/profile';
// 구글맵스 api
import { Autocomplete, LoadScript } from '@react-google-maps/api';

export default function MyPage() {
  const navigate = useNavigate();
  // 구글맵 api
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?.id;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');

  const [points, setPoints] = useState(0);
  const [likedBooks, setLikedBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [myRegisters, setMyRegisters] = useState([]);
  const [myBoardsList, setMyBoardsList] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const fileInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    // 개인정보
    myInfo(userId)
      .then((data) => {
        setProfile(data);
        setNickname(data.userName || data.nickname || '');
        setRegion(data.region || '');
      })
      .catch((err) => console.error("myInfo 로드 실패", err));

    // 포인트
    myPoints(userId)
      .then((data) => setPoints(data.points || 0))
      .catch((err) => console.error("myPoints 로드 실패", err));

    // 내가 좋아요 누른 책
    myLikes(userId)
      .then((data) => {setLikedBooks(data.books || []);})
      .catch((err) => console.error("myLikes 로드 실패", err));

    // 내가 올린 책
    registeredBooks(userId)
      .then((data) => setMyRegisters(data.data?.books || []))
      .catch((err) => console.error("registeredBooks 로드 실패", err));

    // 내가 빌린 책
    borrowedBooks(userId)
      .then((data) => setMyBorrows(data.data?.books || []))
      .catch((err) => console.error("borrowedBooks 로드 실패", err));

    // 내가 쓴 커뮤니티 글
    /*
    userBoards(userId)
      .then((data) => setMyBoardsList(data.boards || [])) 
      .catch((err) => console.error("userBoards 로드 실패", err));
    */

    // 팔로워
    fetchFollowers(userId)
      .then((data) => setFollowers(data.follower || []))
      .catch((err) => console.error("fetchFollowers 로드 실패", err));

    // 팔로잉
    fetchFollowings(userId)
      .then((data) => setFollowings(data.following || []))
      .catch((err) => console.error("fetchFollowings 로드 실패", err));
  }, [userId, navigate]);

  // 프로필 수정
  const handleSaveProfile = async () => {
    try {
      await editMyInfo(userId, { userName: nickname, region });

      const file = fileInputRef.current?.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('avatar', file); 
        await uploadProfileImage(userId, formData);
      }

      const updated = await myInfo(userId);
      setProfile(updated);
      setEditing(false);
      alert('프로필이 수정되었습니다!');
    } catch (err) {
      console.error(err);
      alert('프로필 수정 실패');
    }
  };

  if (!profile) return <div>로딩 중...</div>;

  const currentAvatar = profile.ProfilePic || profile.avatarUrl;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 프로필 섹션 */}
      <section className="border p-4 rounded-lg flex items-start gap-4 bg-ivory relative">
        {/* 왼쪽: 프로필 사진 */}
        {/* 세션쿠키에있는 유저정보중에 프사가 있으면 그걸 가져오고, 
         없으면 User 아이콘으로 대체하는 로직임 */}
        <div className="flex-shrink-0">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="프로필"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-pistachio flex items-center justify-center">
              <User className="w-12 h-12 text-darkbrown" />
            </div>
          )}

          {editing && (
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*" // ㅇㅣ미지만 선택가능
              className="mt-2 w-full text-sm"
            />
          )}
        </div>

        {/* 가운데: 닉네임 + 지역 */}
        <div className="flex-1 space-y-1">
          {editing ? (
            <>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                className="border rounded px-2 py-1 w-full"
              />
              {/* 구글맵스 API */}
              <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                  }
                  // 동 단위 추출 로직
                  onPlaceChanged={() => {
                    if (autocompleteRef.current) {
                      const place = autocompleteRef.current.getPlace();
                      if (place.address_components) {
                        // 동 (sublocality_level_1 또는 sublocality)
                        const dong = place.address_components.find(
                          (c) => c.types.includes('sublocality_level_1') || c.types.includes('sublocality')
                        );
                        setRegion(dong ? dong.long_name : place.formatted_address);
                      } else {
                        // 주소 구성요소가 없는 경우
                        setRegion(place.name);
                      }
                    }
                  }}
                >
                  <input
                    type="text"
                    value={region} // 현재 'region' 상태값 표시
                    onChange={(e) => setRegion(e.target.value)} // 직접 타이핑 허용
                    placeholder="지역 입력 (예: 서교동)"
                    className="border rounded px-2 py-1 w-full"
                  />
                </Autocomplete>
              </LoadScript>
            </>
          ) : (
            <>
              <p className="font-bold text-lg text-darkbrown">
                {profile.userName || profile.nickname}
              </p>
              <p className="text-gray-500 text-sm">{profile.region || "지역 미설정"}</p>
            </>
          )}
        </div>

        {/* 저장. 수정 버튼 */}
        <div className="absolute bottom-2 right-2">
          {editing ? (
            <button
              onClick={handleSaveProfile}
              className="bg-darkbrown text-white px-3 py-1 rounded"
            >
              저장하기
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-darkbrown text-white px-3 py-1 rounded"
            >
              프로필 수정
            </button>
          )}
        </div>
      </section>

      {/* 포인트 */}
      <section className="border p-4 rounded-lg bg-ivory">
        <h3 className="font-semibold mb-2">포인트</h3>
        <p>{points} P</p>
      </section>

      {/* 내가 좋아요 누른 책 */}
      <section className="border p-4 rounded-lg bg-ivory">
        <h3 className="font-semibold mb-2">좋아요한 책</h3>
        <div className="flex gap-4 overflow-x-auto">
          {likedBooks.map((b) => {
            const thumbnail = b.bookPic?.length > 0 ? b.bookPic[0].url : null;

            return (
              <div
                key={b.bookId}
                className="min-w-[150px] border rounded-lg bg-white shadow p-2 flex flex-col justify-between cursor-pointer"
                // 클릭 시 해당 게시글로
                onClick={() => navigate(`/post/${b.bookId}`)} 
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={b.title}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-200 text-darkbrown rounded">
                    {b.title?.slice(0, 1) || '?'}
                  </div>
                )}

                {/* 책 제목 */}
                <p className="mt-2 font-medium text-darkbrown truncate">
                  {b.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 내가 올린 책 */}
      {/* 내가 올린 거래글을 가로로 (최신순)3개까지 띄우고, 그 뒤에는 [더보기]버튼을 넣어서 이 버튼을 누르면 MyBookPost페이지로 이동 */}
      {/* 등록한 책 (내 거래글) */}
      <section className="border p-4 rounded-lg bg-ivory">
        <h3 className="font-semibold mb-2 text-darkbrown">내 거래글</h3>

        {/* 최신순 3개까지 */}
        <div className="flex gap-4 overflow-x-auto">
          {myRegisters.slice(0, 3).map((b) => {
            const thumbnail = b.bookPic?.length > 0 ? b.bookPic[0].url : null;

            return (
              <div
                key={b.bookId}
                className="min-w-[150px] border rounded-lg bg-white shadow p-2 flex flex-col justify-between"
              >
                {/* 책 썸네일 */}
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={b.title}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-pistachio text-darkbrown rounded">
                    {b.title?.slice(0, 1) || '?'}
                  </div>
                )}

                {/* 책 제목 */}
                <p className="mt-2 font-medium text-darkbrown truncate">
                  {b.title}
                </p>

                {/* 상태 표시 */}
                <span className="text-sm text-gray-500">{b.status}</span>
              </div>
            );
          })}

          {/* 더보기 버튼 */}
          {myRegisters.length > 3 && (
            <button
              onClick={() => navigate('/MyBookPost')}
              className="min-w-[100px] border rounded-lg bg-pistachio text-darkbrown flex items-center justify-center hover:bg-pistachio-dark transition-colors"
            >
              더보기
            </button>
          )}
        </div>
      </section>

      {/* 내가 쓴 커뮤니티 글 */}
      <section className="border p-4 rounded-lg bg-ivory">
        <h3 className="font-semibold mb-2 text-darkbrown">내 커뮤니티 글</h3>
        <div className="flex gap-4 overflow-x-auto">
          {myBoardsList.slice(0, 3).map((b) => (
            <div
              key={b.boardId}
              className="min-w-[150px] h-32 border rounded-lg bg-pistachio flex items-center justify-center p-2 cursor-pointer"
              onClick={() => navigate(`/community/${b.boardId}`)} // CommunityPost 페이지로 이동
            >
              <p className="text-darkbrown font-medium text-center truncate">
                {b.title}
              </p>
            </div>
          ))}

          {/* 더보기 버튼 */}
          {myBoardsList.length > 3 && (
            <button
              onClick={() => navigate('/MyBoardPost')}
              className="min-w-[100px] border rounded-lg bg-pistachio text-darkbrown flex items-center justify-center hover:bg-pistachio-dark transition-colors"
            >
              더보기
            </button>
          )}
        </div>
      </section>

      {/* 팔로워/팔로잉 */}
      <section className="border p-4 rounded-lg bg-ivory">
        <h3 className="font-semibold mb-2">
          팔로워 ({followers.length}) / 팔로잉 ({followings.length})
        </h3>
        <div className="flex gap-4">
          {/* 팔로워 리스트 */}
          {/* 세로 스크롤 가능 */}
          <div className="flex-1 max-h-24 overflow-y-auto border p-2 rounded">
            {followers.map((f) => (
              <p key={f.userId} className="text-sm">
                {f.nickname}
              </p>
            ))}
          </div>

          {/* 팔로잉 리스트 */}
          <div className="flex-1 max-h-24 overflow-y-auto border p-2 rounded">
            {followings.map((f) => (
              <p key={f.userId} className="text-sm">
                {f.nickname}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
