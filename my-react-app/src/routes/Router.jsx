// /src/routes/Router.jsx

import { Routes, Route } from 'react-router-dom';

// 레이아웃
import MainLayout from '../layouts/MainLayout';

// 인증 관련 (/auth)
import Start from '../pages/auth/Start';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Verification from '../pages/auth/Verification';
import FindPassword from '../pages/auth/FindPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// 메인 관련 (/main)
import Home from '../pages/main/Home';
import SearchResult from '../pages/main/SearchResult';
import Search from '../pages/main/Search';
import Recommend from '../pages/main/Recommend';
import BookDetail from '../pages/main/BookDetail';
import Post from '../pages/main/Post';
import PostUpload from '../pages/main/PostUpload';
import PostEdit from '../pages/main/PostEdit';
import Chatroom from '../pages/main/Chatroom';
import ChatList from '../pages/main/ChatList';
import Category from '../pages/main/Category';

// 커뮤니티 관련 (/community)
import Community from '../pages/community/Community';
import CommunityPost from '../pages/community/CommunityPost';
import CommunityUpload from '../pages/community/CommunityUpload';
import UserProfile from '../pages/community/UserProfile';

// 마이페이지 관련 (/mypage)
import MyPage from '../pages/mypage/MyPage';
import Manner from '../pages/mypage/Manner';
import MyCommunityPost from '../pages/mypage/MyCommunityPost';
import MyBookPost from '../pages/mypage/MyBookPost';
import Follow from '../pages/mypage/Follow';

// 예외처리용
import NotFound from '../pages/NotFound';

// 나중에 페이지 폴더 안에 인증 메인 등등,,
// 폴더 세분화할지 고민해봐야겠다~ 일단은 굳이?
export default function Router() {
  return (
      <Routes>
        {/* 인증(레이아웃 없이 사용 ㅇㅇ) */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/findPassword" element={<FindPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* 공통 레이아웃 적용되는 페이지들 */}
        <Route element={<MainLayout />}>
          {/* 메인 */}
          <Route path="/home" element={<Home />} />
          <Route path="/searchResult" element={<SearchResult />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/post/:bookId" element={<Post />} />
          <Route path="/postUpload" element={<PostUpload />} />
          <Route path="/edit/:bookId" element={<PostEdit />} />
          <Route path=":chat/:chatId" element={<Chatroom />} />
          <Route path="/chatList" element={<ChatList />} />
          <Route path="/category/:categoryName" element={<Category />} />

          {/* 커뮤니티 */}
          <Route path="/community" element={<Community />} />
          <Route path="/communityPost/:boardId" element={<CommunityPost />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/communityUpload" element={<CommunityUpload />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/manner/:userId" element={<Manner />} />
          <Route path="/myCommunityPost" element={<MyCommunityPost />} />
          <Route path="/myBookPost" element={<MyBookPost />} />
          <Route path="/follow" element={<Follow />} />
        </Route>

        {/* 404 예외처리용!! */}
        <Route path="*" element={<NotFound />} />
      </Routes>
   
  );
}
