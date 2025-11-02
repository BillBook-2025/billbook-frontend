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
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      try {
        const res = await searchBook({ query, region: region === "전체" ? "" : region });
        setResults(res.data.books || []);
      } 
      catch (err) {
        console.error("검색 실패:", err);
        setResults([]);
      }
    }
    fetchResults();
  }, [query, region]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색어가 빈 값이면 이동 안함
    if (!query.trim()) return;

    navigate(`/searchresult?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-darkbrown">검색 결과</h1>

      {/* 검색창 */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          placeholder="책 제목을 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 border-2 border-darkbrown rounded-md bg-pistachio text-darkbrown placeholder-darkbrown/70" // ⭐️ mt-3, w-full, flex 등 불필요한 클래스 모두 제거
          aria-label="책 제목 검색 입력"
        />
        <button
          type="submit"
          className="flex-shrink-0 px-4 py-2 bg-darkbrown text-white rounded-md hover:bg-orange-500" // ⭐️ rounded-md로 통일, flex-shrink-0 추가
          aria-label="검색 버튼"
        >
          검색
        </button>
      </form>

      {/* 지역 설정 버튼 */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {["전체", "서울", "부산", "대구", "광주", "인천", "경기도", "경상도", "전라도", "강원도", "충청도", "제주도", "울릉도","독도"].map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all
                        border
                        ${
                          region === r
                            ? "bg-pistachio text-darkbrown border-darkbrown ring-1 ring-darkbrown" // 활성 상태
                            : "bg-white text-darkbrown border-gray-300" // 비활성 상태
                        }
                        hover:bg-orange-500 hover:text-white hover:border-orange-500`} // 호버 상태
            aria-pressed={region === r}
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
          {results.map((item) => (
            <li
              key={item.book_id}
              onClick={() => navigate(`/posts/${item.book_id}`)} // post id 대신 book_id 사용 중
              className="cursor-pointer border rounded p-3 flex items-center gap-4 hover:bg-gray-100"
              aria-label={`${item.title} 상세 보기`}
            >
              <img
                src={item.book_pic}
                alt={`${item.title} 표지`}
                className="w-16 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.author}</p>
                <p className="text-sm text-gray-500">{item.locate?.address || "지역 정보 없음"}</p>
                <p className="text-sm text-gray-400">좋아요 {item.like_count}개</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
