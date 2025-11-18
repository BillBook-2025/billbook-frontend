// src/pages/main/PostUpload.jsx
/**### 거래글 업로드

- [사진 등록]
- 제목은 자동으로 책 제목과 동일하게 설정
- 책 선택 ? (이름 검색으로 리스트중에 정해서 선택하면. 그 책 정보가 api를통해 자동으로 들어오게)
- [상세 설명]
- [지역 설정하기] - 구글맵 api 를 프런트에서 가져와서 백으로 위치를 넘겨주기
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// API 함수
import { registerBook, fetchBookInfo } from '../../api/books';
import { XCircle } from 'lucide-react';
// 구글맵 api
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';

export default function PostUpload() {
  const navigate = useNavigate();
  // 구글맵 api
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [bookPoint, setBookPoint] = useState(1000);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState({
    address: '',
    latitude: null,
    longitude: null,
    regionLevel1: '',
    regionLevel2: '',
    regionLevel3: '',
  });

  const autocompleteRef = useRef(null);

  // 책 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // 이름 기준으로 검색, API에서 이름 정확도 순으로 정렬
      const books = await fetchBookInfo({ keyword: searchQuery });
      setSearchResults(books);
    } catch (err) {
      console.error('책 검색 실패', err);
    }
  };

  // 책 선택
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    // 제목-저자 표시
    setSearchQuery(`${book.title} - ${book.author}`);
    setSearchResults([]);
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // 새로 추가된 파일만
    const newImages = [...images, ...files];
    setImages(newImages);

    // 새로 추가된 파일에 대한 미리보기 URL 생성
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // 구글맵 주소 -> 한국 주소 체계 반영
  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      console.log('Google Maps API 선택 결과:', place);

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        let regionLevel1 = ''; // 시/도
        let regionLevel2 = ''; // 구/군/시
        let regionLevel3 = ''; // 동/읍/면

        // 주소 구성 요소 파싱 (한국 주소 체계 반영)
        if (place.address_components) {
          place.address_components.forEach((component) => {
            const types = component.types;

            if (types.includes('administrative_area_level_1')) {
              regionLevel1 = component.long_name;
            }

            // '구' 정보 찾기 (sublocality_level_1이 가장 정확함)
            if (
              types.includes('sublocality_level_1') ||
              types.includes('locality') ||
              types.includes('administrative_area_level_2')
            ) {
              // 이미 값이 있어도 sublocality_level_1이면 덮어쓰기
              if (!regionLevel2 || types.includes('sublocality_level_1')) {
                regionLevel2 = component.long_name;
              }
            }

            if (
              types.includes('sublocality_level_2') ||
              types.includes('neighborhood')
            ) {
              regionLevel3 = component.long_name;
            }
          });
        }

        // 상태 업데이트
        setLocation({
          address: place.formatted_address || '',
          latitude: lat,
          longitude: lng,
          regionLevel1,
          regionLevel2,
          regionLevel3,
        });

        console.log('업데이트된 위치 정보:', {
          regionLevel1,
          regionLevel2,
          regionLevel3,
        });
      }
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (indexToRemove) => {
    // images state에서 제거
    setImages(images.filter((_, index) => index !== indexToRemove));

    // imagePreviews state에서 제거
    const newPreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    setImagePreviews(newPreviews);

    // 메모리 누수 방지를 위해 사용이 끝난 URL 해제
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };

  // 게시글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('선택된 책 정보 확인:', selectedBook);
    console.log('handleSubmit 시작 - 현재 location state:', location);

    setError('');

    if (!selectedBook) return setError('책을 선택해주세요.');
    if (!description.trim()) return setError('상세 설명을 입력해주세요.');
    if (!location.address) return setError('지역을 선택해주세요.');

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const bookPostRequestDto = {
        bookpoint: 1000,
        locate: {
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          regionLevel1: location.regionLevel1 || '',
          regionLevel2: location.regionLevel2 || '',
          regionLevel3: location.regionLevel3 || '',
        },
        content: description,
        title: selectedBook.title,
        author: Array.isArray(selectedBook.authors)
          ? selectedBook.authors.join(', ')
          : selectedBook.authors,
        cond: condition || 'GOOD',
        publisher: selectedBook.publisher,
        category: selectedBook?.category || '사회',
        isbn: selectedBook.isbn,
      };

      const jsonBlob = new Blob([JSON.stringify(bookPostRequestDto)], {
        type: 'application/json',
      });

      formData.append('book', jsonBlob);

      images.forEach((file) => formData.append('images', file));

      // ==================================================================
      console.group('🚀 [최종 전송 데이터 확인]');

      for (let [key, value] of formData.entries()) {
        // 1. JSON 데이터인 경우 (키 이름으로 확인)
        if (key === 'book' || key === 'request' || key === 'dto') {
          const text = await value.text(); // 내용을 강제로 읽음
          console.log(`📄 JSON DATA [${key}]:`, JSON.parse(text));
        }
        // 2. 이미지 파일인 경우
        else if (value instanceof File) {
          console.log(
            `📁 IMAGE [${key}]: ${value.name} (${(value.size / 1024).toFixed(
              2
            )} KB)`
          );
        }
        // 3. 그 외
        else {
          console.log(`📝 TEXT [${key}]:`, value);
        }
      }
      console.groupEnd();
      // ==================================================================

      await registerBook(formData);
      alert('게시글 등록 완료');

      navigate(`/home`);
    } catch (err) {
      console.error('거래글 등록 실패:', err);
      setError(`등록에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">거래글 업로드</h1>
      {/* 책 검색 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="책 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-pistachio rounded"
        >
          검색
        </button>

        {/* 검색 결과 리스트 */}
        {searchResults.length > 0 && (
          <ul className="border mt-2 max-h-40 overflow-auto">
            {searchResults.map((book, index) => (
              <li
                key={book.id || index}
                onClick={() => handleSelectBook(book)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{book.title}</span>
                <span className="text-gray-500 text-sm">{book.author}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <textarea
          placeholder="상세 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {/* 구글맵 자동완성 + 지도 */}
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="거래 희망 장소를 검색하세요"
              className="w-full border p-2 rounded mb-2"
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

        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md">
            {imagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={previewUrl}
                  alt={`preview ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleImageChange} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-semibold"
        >
          {isSubmitting ? '등록 중...' : '게시글 등록'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
