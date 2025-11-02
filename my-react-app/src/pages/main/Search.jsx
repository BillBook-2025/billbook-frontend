// src/pages/main/Search.jsx
/** 
 * Search (검색 입력 페이지)
  ├ 상단에 [입력창 + 돋보기 버튼]
  ├ 최근 검색어 내역
  └ [돋보기 버튼] 누르면 → SearchResult 페이지로 이동
  [전체 삭제]버튼 누르면 최근 검색어 전체삭제
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([]);

  // 인기검색어 하려면 최근검색어 저장?하는게 백에 잇어야함
  // localStorage에서 최근 검색어 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (searchTerm) => {
    const trimmed = (searchTerm ?? keyword).trim();
    if (!trimmed) return;

    // 최근 검색어 업데이트 (중복 제거, 최대 5개)
    const newRecent = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // 검색 결과 페이지로 이동
    navigate(`/searchresult?query=${encodeURIComponent(trimmed)}`);
  };

  // 전체 검색 기록 삭제
  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">검색 페이지</h1>

      {/* 검색창 */}
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full max-w-md mx-auto flex items-center justify-between mt-3 px-4 py-2 border-2 border-darkbrown rounded-md bg-pistachio text-darkbrown cursor-pointer"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          aria-label="검색어 입력"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
          aria-label="검색"
        >
          <SearchIcon size={24} />
        </button>
      </div>

      {/* 최근 검색어 목록 */}
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">최근 검색어</h2>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:underline"
              aria-label="최근 검색어 전체 삭제"
            >
              검색 기록 전체 삭제
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentSearches.map((word, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setKeyword(word);
                    handleSearch(word); // 클릭하면 바로 검색 실행
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  aria-label={`최근 검색어 ${word} 검색`}
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}