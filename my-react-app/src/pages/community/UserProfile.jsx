// src/pages/community/UserProfile.jsx
// 다른 유저의 프로필을 클릭했을때 들어가는 페이지
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
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  // 유저 정보 불러오기
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?.userId;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

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
    if (!userId) return;

    // 개인정보
    myInfo(userId).then((data) => {
      setProfile(data);
      setNickname(data.nickname || '');
      setRegion(data.region || '');
    });

    // 포인트
    myPoints(userId).then(setPoints);

    // 내가 좋아요 누른 책
    myLikes(userId).then(setLikedBooks);

    // 내가 올린 책
    registeredBooks(userId).then(setMyRegisters);

    // 내가 빌린 책
    borrowedBooks(userId).then(setMyBorrows);

    // 내가 쓴 커뮤니티 글
    userBoards(userId).then(setMyBoardsList);

    // 팔로워, 팔로잉
    fetchFollowers(userId).then(setFollowers);
    fetchFollowings(userId).then(setFollowings);
  }, [userId]);

  // 프로필 수정
  const handleSaveProfile = async () => {
    try {
      await editMyInfo(userId, { nickname, region });
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
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

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 프로필 섹션 */}
      <section className="border p-4 rounded-lg flex items-start gap-4 bg-ivory relative">
        {/* 왼쪽: 프로필 사진 */}
        <div className="flex-shrink-0">
          <img
            src={
              avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl
            }
            alt="프로필"
            className="w-24 h-24 rounded-full object-cover"
          />
          {/* 프사 설정 안했으면 기본 아이콘 */}
          {!avatarFile && !profile.avatarUrl && (
            <div className="w-24 h-24 rounded-full bg-pistachio flex items-center justify-center">
              <User className="w-12 h-12 text-darkbrown" />
            </div>
          )}
          {editing && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="mt-2"
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
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current.getPlace();
                    const dong = place.address_components.find((c) =>
                      c.types.includes('sublocality_level_1')
                    );
                    setRegion(dong ? dong.long_name : place.formatted_address);
                  }}
                >
                  <input
                    type="text"
                    value={region}
                    placeholder="지역 입력"
                    className="border rounded px-2 py-1 w-full"
                  />
                </Autocomplete>
              </LoadScript>
            </>
          ) : (
            <>
              <p className="font-bold text-lg text-darkbrown">
                {profile.nickname}
              </p>
              <p className="text-gray-500 text-sm">{profile.region}</p>
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
        <ul className="space-y-1">
          {likedBooks.map((b) => (
            <li key={b.bookId}>{b.title}</li>
          ))}
        </ul>
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
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">
          팔로워 ({followers.length}) / 팔로잉 ({followings.length})
        </h3>
        <div className="flex gap-4">
          {/* 팔로워 리스트 */}
          {/**max-h-24 overflow-y-auto로 세로 스크롤 가능 */}
          <div className="flex-1 max-h-24 overflow-y-auto border p-2 rounded">
            {followers.data.map((f) => (
              <p key={f.userId} className="text-sm">
                {f.nickname}
              </p>
            ))}
          </div>

          {/* 팔로잉 리스트 */}
          <div className="flex-1 max-h-24 overflow-y-auto border p-2 rounded">
            {followings.data.map((f) => (
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
