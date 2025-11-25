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
import { User, Heart } from 'lucide-react';
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
  const [myRegisters, setMyRegisters] = useState([]); // 등록한 책 (판매)
  const [myBorrows, setMyBorrows] = useState([]); // 빌린 책 (구매)
  const [tradingItems, setTradingItems] = useState([]); // 거래 중인 항목

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

    const fetchData = async () => {
        try {
            // 개인정보
            const info = await myInfo(userId);
            setProfile(info);
            setNickname(info.userName || info.nickname || '');
            setRegion(info.region || '');

            // 포인트, 좋아요
            const [pointsData, likesData] = await Promise.all([
                myPoints(userId),
                myLikes(userId),
            ]);

            setPoints(pointsData.points || 0);
            setLikedBooks(likesData.books || []);
            
            // 내 거래글
            const registeredData = await registeredBooks(userId);
            const registers = registeredData.data?.books || [];
            setMyRegisters(registers);

            // 내가 빌린 책
            const borrowedData = await borrowedBooks(userId);
            const borrows = borrowedData.data?.books || [];
            setMyBorrows(borrows);

            // 거래중 (내가 구매자이거나 판매자)
            const allItems = [...registers, ...borrows];
            const trading = allItems.filter(item => 
                item.status === 'BORROWING'
            );
            // 중복 제거 및 상태 업데이트
            const uniqueTrading = Array.from(new Set(trading.map(item => item.bookId)))
                .map(id => trading.find(item => item.bookId === id));

            setTradingItems(uniqueTrading);

            // 커뮤니티 글
            const boardsData = await userBoards(userId);
            const boards = Array.isArray(boardsData) ? boardsData : boardsData.boards || [];
            const sortedBoards = boards.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setMyBoardsList(sortedBoards);

            // 팔로워 / 팔로잉
            const [followersData, followingsData] = await Promise.all([
                fetchFollowers(userId),
                fetchFollowings(userId),
            ]);
            setFollowers(followersData.follower || []);
            setFollowings(followingsData.following || []);
            
        } catch (err) {
            console.error("마이페이지 데이터 로드 실패", err);
        }
    };
    
    fetchData();

  }, [userId, navigate]);

  // 프로필 수정
  const handleSaveProfile = async () => {
    try {
      await editMyInfo(userId, { userName: nickname, region });

      const file = fileInputRef.current?.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('profilePic', file); 
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
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 1. 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="w-full px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-extrabold text-darkbrown">마이페이지</h1>
          {/* 설정/로그아웃 버튼 등 배치 가능 */}
          <div className="w-8"></div> 
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* 2. 상단: 프로필 & 포인트 (한 줄 배치) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* [Left] 프로필 카드 (PC에서 2/3 차지) */}
          <section className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-5 relative overflow-hidden">
             {/* 프로필 이미지 */}
            <div className="relative flex-shrink-0 mt-1">
               {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="프로필"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-pistachio/20 flex items-center justify-center border-2 border-gray-100">
                  <User className="w-10 h-10 text-pistachio-dark" />
                </div>
              )}
              {editing && (
                <label className="flex-col bottom-0 right-0 bg-darkbrown text-white p-1.5 rounded-full cursor-pointer shadow hover:bg-black transition-colors z-20">
                  <span className="text-[10px] font-bold px-1">변경</span>
                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                </label>
              )}
            </div>

            {/* 유저 정보 입력/표시 */}
            <div className="flex-1 z-10">
               {editing ? (
                 <div className="space-y-3 w-full pr-1">
                    {/* 닉네임 입력 */}
                    <div>
                        <label className="text-xs text-gray-400 font-bold ml-1 mb-1 block">닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임"
                            className="w-full border border-pistachio rounded px-3 py-2 text-sm focus:outline-none focus:border-darkbrown bg-gray-50"
                        />
                    </div>

                    {/* 저장 버튼 (입력창 아래로 이동 - 겹침 해결) */}
                    <div className="flex justify-end pt-2">
                        <button 
                            onClick={handleSaveProfile} 
                            className="bg-pistachio text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-pistachio-dark transition-colors shadow-sm"
                        >
                            저장완료
                        </button>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col justify-center h-full min-h-[5rem]">
                   <h2 className="text-xl font-extrabold text-darkbrown flex items-center gap-2">
                     {profile.userName || profile.nickname}
                     <span className="text-sm font-normal text-gray-500">님</span>
                   </h2>
                 </div>
               )}
            </div>

            {/* 수정 버튼 (평소에만 우측 상단 표시) */}
            {!editing && (
                <div className="absolute top-6 right-6 z-30">
                    <button 
                        onClick={() => setEditing(true)} 
                        className="text-gray-400 hover:text-darkbrown text-xs underline font-medium"
                    >
                        정보수정
                    </button>
                </div>
            )}
          </section>

          {/* [Right] 포인트 카드 */}
          <section className="md:col-span-1 bg-darkbrown text-ivory rounded-2xl shadow-lg p-6 flex flex-col justify-center relative overflow-hidden min-h-[140px]">
             <div className="absolute -top-4 -right-4 w-16 h-16 bg-pistachio rounded-full opacity-20 blur-xl"></div>
             
             <div className="flex justify-between items-start mb-2">
                <p className="text-pistachio text-xs font-bold">MY POINT</p>
                <button className="bg-white/10 hover:bg-white/20 text-[10px] px-2 py-1 rounded transition-colors border border-white/10">
                    충전
                </button>
             </div>
             <p className="text-2xl font-extrabold tracking-tight">{points.toLocaleString()} P</p>
          </section>
        </div>

        {/* 3. 거래중인 책 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4 border-l-4 border-pistachio pl-3">
             <h2 className="text-lg font-bold text-gray-800">
               🤝 거래중인 책 <span className="text-pistachio-dark ml-1">{tradingItems.length}</span>
             </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {tradingItems.length > 0 ? (
              tradingItems.map((b) => (
                <div
                  key={b.bookId}
                  onClick={() => navigate(`/post/${b.bookId}`)}
                  className="min-w-[150px] bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {/* 이미지 */}
                  {b.bookPic && b.bookPic.length > 0 ? (
                    <img src={b.bookPic[0].url} alt={b.title} className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-gray-50 flex items-center justify-center text-gray-300">No Image</div>
                  )}
                  {/* 내용 */}
                  <div className="p-3">
                    <p className="font-bold text-darkbrown text-sm truncate">{b.title}</p>
                    <span className="text-[10px] bg-pistachio/20 text-darkbrown px-1.5 py-0.5 rounded font-bold mt-1 inline-block">{b.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-8 text-center text-gray-400 text-sm bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                진행 중인 거래가 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 4. 나의 서재 & 찜한 책 */}
        <div className="space-y-4">
           {/* 나의 서재 */}
           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4 border-l-4 border-pistachio pl-3">
                 <h2 className="text-lg font-bold text-gray-800">📚 나의 서재</h2>
                 {myRegisters.length > 0 && (
                    <button onClick={() => navigate('/MyBookPost')} className="text-xs text-gray-400 hover:text-darkbrown">더보기</button>
                 )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                 {myRegisters.length > 0 ? myRegisters.slice(0, 5).map((b) => (
                   <div key={b.bookId} onClick={() => navigate(`/post/${b.bookId}`)} className="min-w-[120px] cursor-pointer group">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-gray-100 bg-gray-50 relative">
                        {b.bookPic?.length > 0 ? (
                           <img src={b.bookPic[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300">?</div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 text-center truncate">
                          {b.status}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-darkbrown truncate">{b.title}</p>
                   </div>
                 )) : <p className="text-gray-400 text-sm py-4 ml-1">등록한 책이 없습니다.</p>}
              </div>
           </section>

           {/* 찜한 책 */}
           <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
               <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-pistachio pl-3">❤️ 찜한 책</h2>
               <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                 {likedBooks.length > 0 ? likedBooks.map((b) => (
                   <div key={b.bookId} onClick={() => navigate(`/post/${b.bookId}`)} className="min-w-[120px] cursor-pointer group">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-gray-100 bg-gray-50">
                        {b.bookPic?.length > 0 ? (
                           <img src={b.bookPic[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300">?</div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-darkbrown truncate">{b.title}</p>
                   </div>
                 )) : <p className="text-gray-400 text-sm py-4 ml-1">찜한 책이 없습니다.</p>}
               </div>
           </section>
        </div>

        {/* 5. 커뮤니티 & 친구 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* 커뮤니티 */}
           <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
              <div className="flex justify-between items-center mb-4 border-l-4 border-pistachio pl-3">
                 <h2 className="text-lg font-bold text-gray-800">✍️ 작성한 글</h2>
                 <button onClick={() => navigate('/MyBoardPost')} className="text-xs text-gray-400 hover:text-darkbrown underline">전체보기</button>
              </div>
              <div className="space-y-2">
                {myBoardsList.length > 0 ? myBoardsList.slice(0, 3).map((board) => (
                  <div key={board.boardId} onClick={() => navigate(`/communityPost/${board.boardId}`)} className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                     <p className="text-sm text-darkbrown truncate flex-1 pr-2">{board.title}</p>
                     <span className="text-xs text-gray-400 whitespace-nowrap">{board.createdAt && new Date(board.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                )) : <p className="text-center text-gray-400 text-sm py-4">작성한 글이 없습니다.</p>}
              </div>
           </section>

           {/* 친구 관리 */}
           <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-pistachio pl-3">👫 친구</h2>
              <div className="grid grid-cols-2 gap-3 h-32">
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col">
                    <p className="text-xs font-bold text-gray-500 mb-2">팔로워 <span className="text-pistachio-dark ml-1">{followers.length}</span></p>
                    <div className="overflow-y-auto custom-scrollbar flex-1 space-y-1">
                       {followers.map(f => <div key={f.userId} className="text-sm truncate text-gray-700">{f.nickname}</div>)}
                    </div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col">
                    <p className="text-xs font-bold text-gray-500 mb-2">팔로잉 <span className="text-pistachio-dark ml-1">{followings.length}</span></p>
                    <div className="overflow-y-auto custom-scrollbar flex-1 space-y-1">
                       {followings.map(f => <div key={f.userId} className="text-sm truncate text-gray-700">{f.nickname}</div>)}
                    </div>
                 </div>
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}