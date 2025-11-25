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
import {
  bookDetail,
  modifyBook,
  searchBook,
  deleteImage, 
} from '../../api/books';
import { XCircle } from 'lucide-react';
// 구글맵 api
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';

export default function PostEdit() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('GOOD');
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]); 
  const [newImagePreviews, setNewImagePreviews] = useState([]); 

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

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await bookDetail(bookId);
        
        // 책 정보 세팅
        setSelectedBook({
          title: post.title,
          author: post.author,
          publisher: post.publisher,
          category: post.category,
          isbn: post.isbn,
          authors: post.author ? [post.author] : [], 
        });
        setSearchQuery(`${post.title} - ${post.author}`);
        setDescription(post.content);
        setCondition(post.cond || 'GOOD');

        const loc = post.locate || {};
        setLocation({
          address: loc.address || '',
          latitude: loc.latitude ? Number(loc.latitude) : 37.5665,
          longitude: loc.longitude ? Number(loc.longitude) : 126.978,
          regionLevel1: loc.regionLevel1 || '',
          regionLevel2: loc.regionLevel2 || '',
          regionLevel3: loc.regionLevel3 || '',
        });

        if (post.bookPic && Array.isArray(post.bookPic)) {
            setExistingImages(post.bookPic);
        }
      } catch (err) {
        console.error(err);
        setError('게시글 정보를 불러오는데 실패했습니다.');
      }
    }
    fetchPost();
  }, [bookId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const books = await searchBook({ keyword: searchQuery });
      setSearchResults(books);
    } catch (err) {
      console.error('책 검색 실패', err);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setSearchQuery(`${book.title} - ${book.author}`);
    setSearchResults([]);
  };

  // 구글맵 핸들 -정확한 주소 파싱
  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        let regionLevel1 = '';
        let regionLevel2 = '';
        let regionLevel3 = '';

        if (place.address_components) {
          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes('administrative_area_level_1')) {
              regionLevel1 = component.long_name;
            }
            if (
              types.includes('sublocality_level_1') ||
              types.includes('locality') ||
              types.includes('administrative_area_level_2')
            ) {
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

        setLocation({
          address: place.formatted_address || '',
          latitude: lat,
          longitude: lng,
          regionLevel1,
          regionLevel2,
          regionLevel3,
        });
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...newPreviews]);
  };

  // 새 이미지 삭제
  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  // 기존 이미지 삭제
  const handleRemoveExistingImage = async (index, filename) => {
    if(!window.confirm('이 이미지를 삭제하시겠습니까?')) return;
    
    try {
        let targetFilename = filename;
        if (!targetFilename && existingImages[index].url) {
            targetFilename = existingImages[index].url.split('/').pop();
        }

        if (targetFilename) {
            await deleteImage(bookId, targetFilename);
        } else {
            console.warn('파일명을 찾을 수 없어 API 호출 없이 UI에서만 제거합니다.');
        }
        setExistingImages(existingImages.filter((_, i) => i !== index));
    } catch (err) {
        console.error('이미지 삭제 실패', err);
        alert('이미지를 삭제하지 못했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBook) return setError('책 정보가 없습니다.');
    if (!description.trim()) return setError('상세 설명을 입력해주세요.');
    if (!location.address) return setError('지역을 선택해주세요.');

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const bookPatchDto = {
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
          : selectedBook.author,
        cond: condition || 'GOOD',
        publisher: selectedBook.publisher,
        category: selectedBook?.category || '사회',
        isbn: selectedBook.isbn,
      };

      const jsonBlob = new Blob([JSON.stringify(bookPatchDto)], {
        type: 'application/json',
      });

      formData.append('book', jsonBlob);

      // 새로 추가된 이미지만 전송
      newImages.forEach((file) => formData.append('images', file));

      await modifyBook(bookId, formData);
      
      alert('게시글 수정 완료');
      navigate(`/post/${bookId}`); 

    } catch (err) {
      console.error('수정 실패:', err);
      setError('수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // src/pages/main/PostEdit.jsx

// ... (이전 코드 생략)

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-xl mx-auto p-4">
        
        {/* Header (수정 페이지는 오렌지색 강조) */}
        <h1 className="text-3xl font-extrabold text-darkbrown mb-6 border-b-4 border-orange-500 inline-block pb-1">
          게시글 수정
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
            {/* 책 검색 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  책 정보 (변경 시 검색)
                </h2>
                <div className="flex gap-2">
                    <input
                    type="text"
                    placeholder="책 다시 검색 (변경 시)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pistachio transition"
                    />
                    <button
                    onClick={handleSearch}
                    type="button"
                    className="px-6 py-3 bg-pistachio text-white font-semibold rounded-lg hover:bg-darkbrown transition flex-shrink-0 whitespace-nowrap"
                    >
                    검색
                    </button>
                </div>
                
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
                
                {/* 현재/선택된 책 정보 표시 */}
                {selectedBook && (
                    <div className="mt-4 p-3 bg-pistachio bg-opacity-10 border-l-4 border-pistachio rounded-r-lg">
                        <p className="font-bold text-darkbrown">현재 책:</p>
                        <p className="text-gray-800 text-sm">{selectedBook.title} - {selectedBook.author}</p>
                    </div>
                )}
            </div>
            
            {/* 상태 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  책 상태 및 상세 설명
                </h2>

                {/* 책 상태 */}
                <div className="mb-4">
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-700 mb-1">
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

            {/*위치 설정 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  거래 희망 위치 변경
                </h2>
                
                {/* 구글맵 자동완성 + 지도 */}
                <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="거래 희망 장소 변경"
                      className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-pistachio"
                    />
                  </Autocomplete>

                  {/* 지도 표시 */}
                  <div className="text-sm text-gray-600 mb-3">현재 주소: {location.address || '장소를 검색해주세요.'}</div>
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
            
            {/* 이미지 */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  이미지 수정 (삭제/추가)
                </h2>
                
                {/* 기존 이미지 리스트 (빨간색 X: 삭제 버튼) */}
                <div className="mb-4 p-3 border-b pb-4">
                    <p className="font-semibold text-gray-700 mb-2">기존 이미지 ({existingImages.length}개) - <span className="text-red-500">클릭 시 즉시 삭제</span></p>
                    <div className="flex flex-wrap gap-3">
                        {existingImages.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 shadow-md">
                                <img 
                                    src={img.url} 
                                    alt="기존 이미지" 
                                    className="w-full h-full object-cover rounded border-2 border-red-400 opacity-80" 
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(idx, img.fileName)} 
                                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg p-[2px] transition hover:scale-110"
                                    aria-label="기존 이미지 삭제"
                                >
                                    <XCircle className="w-6 h-6 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 새 이미지 프리뷰 (파란색 X: 로컬 삭제 버튼) */}
                <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">새로 추가된 이미지 ({newImages.length}개)</p>
                    <div className="flex flex-wrap gap-3">
                        {newImagePreviews.map((url, idx) => (
                            <div key={`new-${idx}`} className="relative w-24 h-24 shadow-md">
                                <img 
                                    src={url} 
                                    alt="새 이미지" 
                                    className="w-full h-full object-cover rounded border-2 border-blue-400" 
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveNewImage(idx)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg p-[2px] transition hover:scale-110"
                                    aria-label="새 이미지 삭제"
                                >
                                    <XCircle className="w-6 h-6 text-blue-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 파일 선택 버튼 */}
                <input 
                    type="file" 
                    multiple 
                    onChange={handleImageChange} 
                    className="text-sm block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pistachio file:text-white hover:file:bg-darkbrown" 
                />
            </div>
            
            {/* 완료 */}
            {error && <p className="text-red-500 text-center font-medium mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-darkbrown font-extrabold text-lg mt-4 shadow-xl transition disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? '수정 중...' : '게시글 수정 완료'}
            </button>
        </form>
      </div>
    </div>
  );
}