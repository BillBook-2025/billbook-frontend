// src/pages/main/SearchResult.jsx
/**### 검색버튼 눌러서 서치하면 나오는 검색결과 페이지
거래글 페이지로 생각해도 됨.

- 상단에 [검색창]
- 검색창 바로밑에 [지역] 설정할수있는 버튼 있고
- 검색결과로는 거래글 리스트가 나옴. 여기서 특정[거래글]을 누르면 - 거래글(Post.jsx)로 이동
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// API 함수
import { searchBook } from "../../api/books";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [region, setRegion] = useState("전체");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      try {
        const params = { query };
        if (region && region !== "전체") {
          params.region = region;
        }
        const res = await searchBook(params);
        const dataList = Array.isArray(res) ? res : (res.data || []);
        
        const pendingBooks = dataList.filter((book) => book.status === 'PENDING');
        
        setResults(pendingBooks);
      } 
      catch (err) {
        console.error("검색 실패:", err);
        setResults([]);
      }
    }
    fetchResults();
  }, [query, region]);

  const handleRegionClick = (r) => { setRegion(r); };
  const regions = ["전체", "서울", "경기", "인천", "강원", "충청", "전라", "경상", "제주"];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">
        "{query}" 검색 결과
      </h1>

      {/* 지역 필터 버튼들 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegionClick(r)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border transition-colors
                        ${
                          region === r
                            ? "bg-darkbrown text-white border-darkbrown" // 활성 상태
                            : "bg-white text-darkbrown border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500" // 비활성 상태
                        }`}
          >
            {r}
          </button>
        ))}
      </div>

      <hr className="my-6 border-darkbrown/20" />

      {/* 검색 결과 리스트 */}
      {results.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {results.map((item) => {
             const thumbnail = item.bookPic && item.bookPic.length > 0 
                ? item.bookPic[0].url 
                : null;

             return (
              <li
                key={item.bookId}
                onClick={() => navigate(`/post/${item.bookId}`)} 
                className="cursor-pointer border rounded-xl p-3 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
              >
                {/* 이미지 표시 */}
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded border border-gray-100"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-darkbrown truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {item.author} | {item.publisher}
                  </p>
                  <p className="text-sm font-bold text-pistachio-dark mt-2">
                    {item.bookpoint ? `${item.bookpoint.toLocaleString()} P` : '가격 미정'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.locate ? item.locate.address : '위치 정보 없음'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}