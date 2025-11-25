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

  // src/pages/main/PostUpload.jsx

// ... (이전 코드 생략)

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-xl mx-auto p-4">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-darkbrown mb-6 border-b-4 border-pistachio inline-block pb-1">
          거래글 업로드
        </h1>

        {/* 1. 책 검색 섹션 */}
        <div className="bg-white p-5 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            1. 등록할 책 정보 검색
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="책 제목 또는 저자로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pistachio transition"
            />
            <button
              onClick={handleSearch}
              type="button"
              className="px-6 py-3 bg-pistachio text-white font-semibold rounded-lg hover:bg-darkbrown transition flex-shrink-0"
            >
              검색
            </button>
          </div>
          
          {/* 검색 결과 리스트 */}
          {searchResults.length > 0 && (
            <ul className="border border-pistachio mt-3 rounded-lg max-h-48 overflow-auto shadow-inner">
              {searchResults.map((book, index) => (
                <li
                  key={book.id || index}
                  onClick={() => handleSelectBook(book)}
                  className="p-3 hover:bg-pistachio hover:text-white text-gray-800 cursor-pointer border-b last:border-b-0 transition flex justify-between items-center"
                >
                  <span className="font-medium truncate">{book.title}</span>
                  <span className="text-sm opacity-80 ml-4">{book.author}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 선택된 책 정보 표시 */}
          {selectedBook && (
              <div className="mt-4 p-3 bg-pistachio bg-opacity-10 border-l-4 border-pistachio rounded-r-lg">
                  <p className="font-bold text-darkbrown">선택된 책:</p>
                  <p className="text-gray-800 text-sm">{selectedBook.title} - {selectedBook.author}</p>
              </div>
          )}
        </div>
        
        {/* 2. 폼 상세 정보 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* 상태 및 설명 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  2. 책 상태 및 상세 설명
                </h2>

                {/* 책 상태 */}
                <div className="mb-4">
                  <label
                    htmlFor="condition"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    책 상태
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-pistachio appearance-none"
                  >
                    <option value="GOOD">좋음 (Good)</option>
                    <option value="FAIR">보통 (Fair)</option>
                    <option value="POOR">나쁨 (Poor)</option>
                  </select>
                </div>

                {/* 상세 설명 */}
                <div className="mb-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                        상세 설명
                    </label>
                    <textarea
                      id="description"
                      placeholder="책의 상태, 거래 방식 등 상세 설명을 입력해주세요."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px] focus:ring-2 focus:ring-pistachio"
                    />
                </div>
            </div>

            {/* 3. 위치 설정 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  3. 거래 희망 위치 설정
                </h2>
                <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="거래 희망 장소를 검색하세요"
                      className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-pistachio"
                    />
                  </Autocomplete>

                  {/* 지도 표시 */}
                  <div className="text-sm text-gray-600 mb-3">선택된 주소: {location.address || '장소를 검색해주세요.'}</div>
                  <GoogleMap
                    center={{
                      lat: location.latitude || 37.5665,
                      lng: location.longitude || 126.978,
                    }}
                    zoom={14}
                    mapContainerStyle={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
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
            </div>
            
            {/* 4. 이미지 업로드 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                 사진 등록
                </h2>
                
                {/* 이미지 미리보기 */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {imagePreviews.map((previewUrl, index) => (
                      <div key={index} className="relative w-24 h-24 shadow-md">
                        <img
                          src={previewUrl}
                          alt={`preview ${index}`}
                          className="w-full h-full object-cover rounded-md border-2 border-pistachio"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg p-[2px] transition hover:scale-110"
                          aria-label="이미지 삭제"
                        >
                          <XCircle className="w-6 h-6 text-red-500" />
                        </button>
                      </div>
                    ))}
                </div>
                <input 
                    type="file" 
                    multiple 
                    onChange={handleImageChange} 
                    className="text-sm block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pistachio file:text-white hover:file:bg-darkbrown" 
                />
            </div>

            {/* 등록 */}
            {error && <p className="text-red-500 text-center font-medium mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-darkbrown font-extrabold text-lg mt-4 shadow-xl transition disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? '등록 중...' : '게시글 등록 완료'}
            </button>
        </form>
      </div>
    </div>
  );
}