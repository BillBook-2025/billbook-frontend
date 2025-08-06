// src/pages/main/SearchResult.jsx
/**### 검색버튼 눌러서 서치하면 나오는 검색결과 페이지
거래글 페이지로 생각해도 됨.

- 상단에 [검색창]
- 검색창 바로밑에 [지역] 설정할수있는 버튼 있고
- 검색결과로는 거래글 리스트가 나옴. 여기서 특정[거래글]을 누르면 - 거래글(Post.jsx)로 이동
 */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchResult() {
  const [searchParams] = useSearchParams(); // ?query=책이름&type=...
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [region, setRegion] = useState("전체"); // 지역 기본값
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 검색어(query)나 지역(region)이 바뀌면 fetch 다시
    if (query) {
      fetch(`/api/search?query=${query}&region=${region}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(err => console.error("검색 실패", err));
    }
  }, [query, region]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 쿼리 URL 반영
    navigate(`/search?query=${query}`);
  };

  return (
    <div>
      <h1>검색 결과</h1>

      {/* 검색창 */}
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          placeholder="책 제목을 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {/* 지역 설정 버튼들 */}
      <div style={{ marginTop: "10px" }}>
        {["전체", "서울", "부산", "대구", "광주"].map((r) => (
          <button
            key={r}
            style={{
              marginRight: "5px",
              backgroundColor: region === r ? "#ddd" : "#fff",
            }}
            onClick={() => setRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <hr />

      {/* 검색 결과 리스트 */}
      <ul>
        {results.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          results.map((item) => (
            <li
              key={item.boardId}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
              onClick={() => navigate(`/posts/${item.boardId}`)}
            >
              <h3>{item.title}</h3>
              <p>{item.bookTitle} · {item.region}</p>
              <img src={item.bookImageUrl} alt="책 이미지" width="100" />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
