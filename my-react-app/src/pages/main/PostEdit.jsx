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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>

      {/* 책 검색 섹션 */}
      <div className="mb-4">
        <div className="flex gap-2">
            <input
            type="text"
            placeholder="책 다시 검색 (변경 시)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
            />
            <button
            onClick={handleSearch}
            type="button"
            className="px-4 py-2 bg-pistachio rounded whitespace-nowrap"
            >
            검색
            </button>
        </div>
        
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 책 상태 */}
        <div className="mb-2">
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
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
          className="w-full p-2 border rounded min-h-[100px]"
        />

        {/* 구글맵 */}
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="거래 희망 장소 변경"
              className="w-full border p-2 rounded mb-2"
            />
          </Autocomplete>

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

        {/* 이미지 관리 */}
        <div className="flex flex-col gap-2">
            <label className="font-medium">이미지 수정</label>
            
            {/* 기존 이미지 리스트 */}
            <div className="flex flex-wrap gap-2">
                {existingImages.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                        <img 
                            src={img.url} 
                            alt="existing" 
                            className="w-full h-full object-cover rounded border" 
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx, img.fileName)} 
                            className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                        >
                            <XCircle className="w-6 h-6 text-red-500" />
                        </button>
                    </div>
                ))}

                {/* 새 이미지 프리뷰 */}
                {newImagePreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-24 h-24">
                        <img src={url} alt="new" className="w-full h-full object-cover rounded border border-blue-400" />
                        <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="absolute -top-2 -right-2 bg-white rounded-full shadow"
                        >
                            <XCircle className="w-6 h-6 text-blue-500" />
                        </button>
                    </div>
                ))}
            </div>
            
            <input type="file" multiple onChange={handleImageChange} className="text-sm" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-semibold mt-4"
        >
          {isSubmitting ? '수정 중...' : '수정 완료'}
        </button>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}