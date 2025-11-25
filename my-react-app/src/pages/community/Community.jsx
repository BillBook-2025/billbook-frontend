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
    <div className="max-w-4xl mx-auto h-[100dvh] flex flex-col bg-gray-50 border-x shadow-2xl relative">
      {/* 페이지 헤더 및 검색창 */}
      <header className="flex-none p-6 bg-white border-b-4 shadow-lg">
        <h1 className="text-4xl font-extrabold text-darkbrown mb-5">
          커뮤니티
        </h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 내용, 작성자 검색..."
            className="flex-grow px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pistachio transition text-lg"
          />
          <button
            type="submit"
            className="p-3 bg-darkbrown text-white rounded-full hover:bg-darkbrown/90 transition shadow-md"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>
      </header>

      {/* 게시글 목록 */}
      <main className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-100">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.boardId}
              // **경로 로직 유지**
              onClick={() => navigate(`/communityPost/${post.boardId}`)}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl hover:border-orange-500 transition duration-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pistachio/50 flex items-center justify-center border border-darkbrown flex-shrink-0">
                    <User className="w-5 h-5 text-darkbrown" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900">
                      {post.userId || '익명'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
                {/* 카테고리 뱃지 (post.category가 있다면 표시) */}
                {post.category && (
                  <div className="text-sm font-semibold text-darkbrown bg-yellow-300/70 px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 truncate mb-1">
                {post.title}
              </h2>
              <p className="text-gray-700 my-2 line-clamp-2">
                {post.content}
              </p>

              {/* 통계 정보 */}
              <div className="flex items-center gap-6 text-sm mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-orange-500">
                  <Heart className="w-5 h-5 fill-orange-500" />
                  <span className="font-semibold">{post.likeCount || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-darkbrown">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {post.commentsCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <p className="text-gray-600 font-bold text-lg">
              아직 게시글이 없습니다.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              첫 번째 글을 작성해보세요!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}