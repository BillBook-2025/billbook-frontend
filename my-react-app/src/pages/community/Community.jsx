// src/pages/community/Community.jsx
/* 최상단에 글 검색창 있음
최하단 오른쪽에 + 동그라미 버튼 누르면 글쓰기페이지로 이동(CommunityUpload)
세로 스크롤 형식으로 글 최신순으로 정렬된거 볼 수 있음.
글 누르면 해당 글 상세페이지(CommunityPost로 이동)
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// API 함수
import { getBoards, searchBoard } from '../../api/boards';
// 아이콘
import { Search, Plus, Heart, MessageCircle, User } from 'lucide-react';

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 모든 게시글을 불러오는 함수
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getBoards();
      // API 응답 데이터를 최신순으로 정렬
      if (Array.isArray(data)) {
        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } 
      else {
        setPosts([]); // data가 배열이 아니면 빈 배열로 설정
      }
    } catch (err) {
      const status = err.message.match(/HTTP (\d+):/)?.[1];
      if (status === '401' || status === '403') {
        setError('게시글을 보려면 로그인이 필요합니다.');
      } 
      else {
        setError('게시글을 불러오는 데 실패했습니다.');
      }
      console.error(err);
    } 
    finally {
      setLoading(false);
    }
  };

  // 게시글 목록
  useEffect(() => {
      fetchPosts();
  }, []);

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault(); // form의 기본 제출 동작 방지
    if (!searchTerm.trim()) {
      fetchPosts(); // 검색어가 없으면 전체 목록 다시 로드
      return;
    }
    try {
      setLoading(true);
      const data = await searchBoard({ keyword: searchTerm }); // token 인자 제거
      if (Array.isArray(data)) {
        setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setPosts([]); // data가 배열이 아니면 빈 배열로 설정
      }
    } catch (err) {
      const status = err.message.match(/HTTP (\d+):/)?.[1];

      if (status === '401' || status === '403') {
        setError('검색을 하려면 로그인이 필요합니다.');
      } else {
        setError('검색 결과를 불러오는 데 실패했습니다.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  // 에러 메시지
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 relative">
      {/* 페이지 헤더 및 검색창 */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">커뮤니티</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="관심 있는 내용을 검색해보세요."
            className="flex-grow border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pistachio"
          />
          <button
            type="submit"
            className="bg-pistachio text-gray-700 px-4 py-2 rounded-md hover:bg-pistachio-dark transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </header>

      {/* 게시글 목록 */}
      <main className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.boardId}
              onClick={() => navigate(`/communityPost/${post.boardId}`)}
              className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {/* 프로필 사진이 있다면
                  <img src={post.user?.profileImageUrl} alt={post.user?.nickname} className="w-full h-full rounded-full object-cover" /> 
                  */}
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.userId || '익명'}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <h2 className="text-lg font-bold truncate">{post.title}</h2>
              <p className="text-gray-600 my-2 break-words truncate">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likeCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // 글 0개일떄
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
}
