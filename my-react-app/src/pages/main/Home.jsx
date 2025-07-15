// src/pages/main/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [books, setBooks] = useState([]);

  const categories = ['과학', '문화', '사회', '역사'];

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/books', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (e) {
        console.error('책 목록 로드 실패', e);
      }
    }
    fetchBooks();

    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedSearches.slice(0, 5));
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    navigate(`/searchResult?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div>
      {/* 🔍 상단 검색창 */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2 shadow">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pistachio"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pistachio-dark"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
          </button>

          {showRecent && recentSearches.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow z-20">
              {recentSearches.map((term, idx) => (
                <li
                  key={idx}
                  className="px-3 py-1 hover:bg-pistachio cursor-pointer"
                  onMouseDown={() => {
                    setSearchTerm(term);
                    handleSearch();
                  }}
                >
                  {term}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 📚 카테고리 리스트 */}
      <div className="category-list flex justify-around mt-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className="px-3 py-1 bg-pistachio rounded-full hover:bg-pistachio-dark transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📖 책 리스트 */}
      <div className="book-list grid grid-cols-2 gap-4 px-4 py-6">
        {books.map(book => (
          <div
            key={book.id}
            onClick={() => navigate(`/bookDetail/${book.id}`)}
            className="border rounded-md p-2 cursor-pointer hover:shadow"
          >
            <img
              src={book.bookPic || '/default_book.png'}
              alt={book.title}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 text-sm font-semibold">{book.title}</div>
            <div className="text-xs text-gray-500">{book.locate?.address}</div>
            <div className="text-xs text-gray-700">상태: {book.bookPoint}</div>
          </div>
        ))}
      </div>

      {/* ➕ 플로팅 버튼 (책 추가 버튼임) */}
      <button
        className="floating-add-btn fixed bottom-24 right-4 bg-pistachio text-white text-3xl w-12 h-12 rounded-full shadow-lg"
        onClick={() => navigate('/postUpload')}
      >
        +
      </button>
    </div>
  );
}
