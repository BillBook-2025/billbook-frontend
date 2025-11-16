// src/pages/main/PostEdit.jsx
/**
 * 이미 올린 게시글 수정하는 페이지... 인데 
 사실상 업로드페이지PostUpload.jsx랑 똑같아서 
 (다른점은, 수정화면은 이미 입력해둔 게시글 정보가 있는 상태로 수정할수있는거고. 업로드는 그냥 빈칸에서 채워서 업로드...) 
 이걸 합쳐야할지??
 
- [사진 등록]
- 제목은 자동으로 책 제목과 동일하게 설정
- 책 선택 ? (이름 검색으로 리스트중에 정해서 선택하면. 그 책 정보가 api를통해 자동으로 들어오게)
- [상세 설명]
- [지역 설정하기]
 */
// PostUpload 랑 거의 동일한데 기존 게시글 데이터 불러오는거만 추가하면됨

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// API 함수
import { bookDetail, modifyBook, searchBook } from '../../api/books';
import { XCircle } from 'lucide-react';
// 구글맵 api
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';

export default function PostEdit({}) {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const autocompleteRef = useRef(null);

  const [bookSearch, setBookSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [content, setContent] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [bookPoint, setBookPoint] = useState(1000);
  const [location, setLocation] = useState({
    address: '',
    latitude: null,
    longitude: null,
    regionLevel1: '',
    regionLevel2: '',
    regionLevel3: '',
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await bookDetail(bookId);
        setSelectedBook(post);
        setContent(post.content);
        setBookPoint(post.bookPoint || 1000);
        setBookSearch(`${post.title} - ${post.author}`);
        setCondition(post.condition || 'GOOD');

        const locate = post.locate || {};
        setLocation({
          address: locate.address || '',
          latitude: locate.latitude || 37.5665,
          longitude: locate.longitude || 126.978,
          regionLevel1: locate.regionLevel1 || '',
          regionLevel2: locate.regionLevel2 || '',
          regionLevel3: locate.regionLevel3 || '',
        });

        // 기존 이미지
        setImagePreviews(
          (post.bookPic || []).map((img) => ({
            ...img,
            isNew: false,
          }))
        );
      } catch (err) {
        setError('게시글 로드 실패');
      }
    }
    fetchPost();
  }, [bookId]);

  // 책 검색
  const handleSearch = async () => {
    if (!bookSearch.trim()) return;
    try {
      const results = await searchBook({ keyword: bookSearch });
      setSearchResults(results);
    } catch (err) {
      setError('책 검색 실패');
    }
  };

  // 책 선택한 후 정보 반영
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setBookSearch(`${book.title} - ${book.author}`);
    setSearchResults([]);
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // 새로 추가된 파일
    const newFilesToAdd = [...files];
    setNewImages((prev) => [...prev, ...newFilesToAdd]);

    // 새로 추가된 파일에 대한 미리보기 URL 생성
    const newPreviewsToAdd = newFilesToAdd.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file: file,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviewsToAdd]);
  };

  // 이미지 삭제
  const handleRemoveImage = (indexToRemove) => {
    const imageToRemove = imagePreviews[indexToRemove];

    if (!imageToRemove.isNew) {
      setDeleteImages((prev) => [...prev, imageToRemove.url]);
    } else {
      setNewImages((prev) =>
        prev.filter((file) => file !== imageToRemove.file)
      );
      URL.revokeObjectURL(imageToRemove.url);
    }

    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return setError('책을 선택해주세요');
    setIsSubmitting(true);

    try {
      const bookText = {
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        category: selectedBook.category,
        isbn: selectedBook.isbn || selectedBook.id,
        content: content,
        locate: location,
        condition: condition,
        bookpoint: bookPoint || 1000,
      };

      await modifyBook(bookId, bookText, deleteImages, newImages);

      alert('게시글 수정 완료');
      navigate(`/post/${bookId}`);
    } catch (err) {
      setError('수정 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>

      {/* 책 검색 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="책 검색"
          value={bookSearch} //
          onChange={(e) => setBookSearch(e.target.value)} //
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch} //
          className="mt-2 px-4 py-2 bg-pistachio text-black rounded"
          type="button"
        >
          검색
        </button>

        {searchResults.length > 0 && (
          <ul className="border mt-2 max-h-40 overflow-auto">
            {searchResults.map((book, index) => (
              <li
                key={book.id || index}
                onClick={() => handleSelectBook(book)} //
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{book.title}</span>
                <span className="text-gray-500 text-sm">{book.author}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 입력폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 책제목 로드 */}
        <input
          type="text"
          value={selectedBook?.title || ''}
          placeholder="책 제목"
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
        {/* 책 상태 */}
        <div className="mb-2">
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700"
          >
            책 상태
          </label>
          <select
            id="condition" 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)} 
            className="w-full p-2 border rounded"
          >
            <option value="GOOD">좋음</option>
            <option value="FAIR">보통</option>
            <option value="POOR">나쁨</option>
          </select>
        </div>

        {/* 상세 설명 */}
        <textarea
          placeholder="상세 설명"
          value={content} //
          onChange={(e) => setContent(e.target.value)} //
          className="w-full p-2 border rounded"
        />
        {/* 구글맵 자동완성 + 지도 */}
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={() => {
              if (autocompleteRef.current) {
                const place = autocompleteRef.current.getPlace();
                if (!place.geometry) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const comps = place.address_components || [];

                const region1 =
                  comps.find((c) =>
                    c.types.includes('administrative_area_level_1')
                  )?.long_name || '';
                const region2 =
                  comps.find((c) =>
                    c.types.includes('administrative_area_level_2')
                  )?.long_name || '';
                const region3 =
                  comps.find(
                    (c) =>
                      c.types.includes('sublocality_level_1') ||
                      c.types.includes('sublocality')
                  )?.long_name || '';

                setLocation({
                  address: place.formatted_address,
                  latitude: lat,
                  longitude: lng,
                  regionLevel1: region1,
                  regionLevel2: region2,
                  regionLevel3: region3,
                });
              }
            }}
          >
            <input
              type="text"
              placeholder="위치 입력 (예: 서교동)"
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </Autocomplete>

          {/* 지도 표시 */}
          <GoogleMap
            center={{
              lat: location.latitude || 37.5665,
              lng: location.longitude || 126.978,
            }}
            zoom={14}
            mapContainerStyle={{
              width: '100%',
              height: '200px',
              marginTop: '8px',
              borderRadius: '8px',
            }}
          >
            <Marker
              position={{
                lat: location.latitude || 37.5665,
                lng: location.longitude || 126.978,
              }}
            />
          </GoogleMap>
        </LoadScript>

        {/* 이미지 업로드+미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md">
            {imagePreviews.map((preview, index) => (
              <div key={preview.id || index} className="relative">
                <img
                  src={preview.url}
                  alt={`preview ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)} //
                  className="absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* (새) 이미지 추가 */}
        <input
          type="file"
          multiple
          onChange={handleImageChange} //
          accept="image/*" // 이미지 파일만 선택하도록
        />

        {/* 완료 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-semibold"
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </button>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
