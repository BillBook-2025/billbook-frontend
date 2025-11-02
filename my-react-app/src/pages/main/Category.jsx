// src/pages/main/Category.jsx
/**
 * 카테고리 선택했을때 해당 카테고리 책 거래글들만 필터링해서 보여줌
 */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// API 함수
import { searchBook } from "../../api/books";

export default function Category() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 책 상태 점수 -> 단어 변환 함수
  const getBookCondition = (point) => {
    switch (point) {
      case 3: return '좋음';
      case 2: return '보통';
      case 1: return '나쁨';
      default: return '알 수 없음';
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        // 카테고리로 필터링 한 검색결과
        const params = { category: categoryName };
        const data = await searchBook(params);
        // 검색 결과를 posts 상태로 저장
        setPosts(data);
      } 
      catch (e) {
        console.error("카테고리 글 로드 실패", e);
      }
    }
    fetchPosts();
  }, [categoryName]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{categoryName} 카테고리</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">등록된 거래글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {posts.map(post => (
            <div
              key={post.bookId}
              onClick={() => navigate(`/bookDetail/${post.bookId}`)}
              className="border rounded-md p-2 cursor-pointer hover:shadow"
            >
              <img
                src={post.bookPic || "/default_book.png"}
                alt={post.title}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 text-sm font-semibold">{post.title} - {post.author}</div>
              <div className="text-xs text-gray-500">{post.locate?.address}</div>
              <div className="text-xs text-gray-700">상태: {getBookCondition(post.bookPoint)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
