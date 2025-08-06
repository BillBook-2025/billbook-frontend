// src/pages/main/Search.jsx
/** 
 * Search (검색 입력 페이지)
  ├ 상단에 [입력창 + 돋보기 버튼]
  ├ 최근 검색어 내역
  └ [돋보기 버튼] 누르면 → SearchResult 페이지로 이동
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 돋보기 아이콘
import { Search } from 'lucide-react';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim() === '') return;
    // 검색 결과 페이지로 이동하면서 검색어 전달
    navigate(`/searchresult?query=${encodeURIComponent(keyword)}`);
  };

   return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">검색 페이지</h1>

      {/* 검색창 */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            width: '100%',
            paddingRight: '40px', // 아이콘 공간 확보
            height: '40px',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="검색"
        >
          <Search size={24} />
        </button>
      </div>

      {/* 최근 검색어 예시 */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">최근 검색어</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>해리포터</li>
          <li>자바스크립트</li>
        </ul>
      </div>
    </div>
  );
}