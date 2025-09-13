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
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// API 함수
import { myInfo, editMyInfo, myLikes, myPoints } from "../../api/my";
import { uploadProfileImage, borrowedBooks, registeredBooks, userBoards, fetchFollowers, fetchFollowings } from "../../api/profile";

export default function MyPage() {
  const navigate = useNavigate();
  // 구글맵 api
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  // 유저 정보 불러오기
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const userId = userInfo?.userId;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [region, setRegion] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [points, setPoints] = useState(0);
  const [likedBooks, setLikedBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [myRegisters, setMyRegisters] = useState([]);
  const [myBoardsList, setMyBoardsList] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);


  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token || !userId) return;

    // 개인정보
    myInfo(userId, token).then((data) => {
      setProfile(data);
      setNickname(data.nickname || "");
      setRegion(data.region || "");
    });

    // 포인트
    myPoints(userId, token).then(setPoints);

    // 내가 좋아요 누른 책
    myLikes(userId, token).then(setLikedBooks);

    // 내가 올린 책
    registeredBooks(userId, token).then(setMyRegisters);

    // 내가 빌린 책
    borrowedBooks(userId, token).then(setMyBorrows);

    // 내가 쓴 커뮤니티 글
    userBoards(userId, token).then(setMyBoardsList);

    // 팔로워, 팔로잉
    fetchFollowers(userId, token).then(setFollowers);
    fetchFollowings(userId, token).then(setFollowings);
  }, [token, userId]);

  // 프로필 수정
  const handleSaveProfile = async () => {
    try {
      await editMyInfo(userId, { nickname, region }, token);
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await uploadProfileImage(userId, formData, token);
      }
      const updated = await myInfo(userId, token);
      setProfile(updated);
      setEditing(false);
      alert("프로필이 수정되었습니다!");
    } 
    catch (err) {
      console.error(err);
      alert("프로필 수정 실패");
    }
  };

  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* 프로필 섹션 */}
      <section className="border p-4 rounded-lg flex items-center gap-4">
        <div>
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl}
            alt="프로필"
            className="w-20 h-20 rounded-full object-cover"
          />
          {editing && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="mt-2"
            />
          )}
        </div>
        <div className="flex-1 space-y-2">
          {editing ? (
            <>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                className="border rounded px-2 py-1 w-full"
              />
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="지역"
                className="border rounded px-2 py-1 w-full"
              />
            </>
          ) : (
            <>
              <p className="font-bold text-lg">{profile.nickname}</p>
              <p className="text-gray-600">{profile.region}</p>
            </>
          )}
        </div>
        <div>
          {editing ? (
            <button onClick={handleSaveProfile} className="bg-blue-500 text-white px-3 py-1 rounded">
              저장
            </button>
          ) : (
            <button onClick={() => navigate("/EditProfile.")} className="bg-gray-200 px-3 py-1 rounded">
              프로필 수정
            </button>
          )}
        </div>
      </section>

      {/* 포인트 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">포인트</h3>
        <p>{points} P</p>
      </section>

      {/* 내가 좋아요 누른 책 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">좋아요한 책</h3>
        <ul className="space-y-1">
          {likedBooks.map((b) => (
            <li key={b.bookId}>{b.title}</li>
          ))}
        </ul>
      </section>

      {/* 내가 올린 책 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">등록한 책</h3>
        <ul className="space-y-1">
          {myRegisters.map((b) => (
            <li key={b.bookId} className="flex justify-between items-center">
              <span>{b.title}</span>
              {b.status === "완료" && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => navigate("./Manner", { state: { book: b, isLender: true } })}
                >
                  매너 평가
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 내가 빌린 책 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">빌린 책</h3>
        <ul className="space-y-1">
          {myBorrows.map((b) => (
            <li key={b.bookId} className="flex justify-between items-center">
              <span>{b.title}</span>
              {b.status === "완료" && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => navigate("./Manner", { state: { book: b } })}
                >
                  매너 평가
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 내가 쓴 커뮤니티 글 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">내 커뮤니티 글</h3>
        <ul className="space-y-1">
          {myBoardsList.map((b) => (
            <li key={b.boardId}>{b.title}</li>
          ))}
        </ul>
      </section>

      {/* 팔로워/팔로잉 */}
      <section className="border p-4 rounded-lg">
        <h3 className="font-semibold mb-2">팔로워 ({followers.length}) / 팔로잉 ({followings.length})</h3>
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