// src/pages/community/CommunityUpload.jsx
/* 커뮤니티 게시글 작성 페이지
- 제목(회색 연하게, 글자입력하면 제목 표시글자사라짐)
- 내용
- [사진 첨부]
- [등록] 버튼 누르면 글 올려짐
- 왼쪽 상단 '<'버튼으로 뒤로가기(커뮤니티 메인 페이지로)
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// API 함수
import { createBoard } from '../../api/boards';
// 아이콘
import { ArrowLeft, Image as ImageIcon, XCircle } from 'lucide-react';

export default function CommunityUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  // 사용자가 파일을 선택하면, 브라우저가 임시 주소를 만들어주는데 그 주소를 여기에 담음
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사진 첨부
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 기존 이미지와 새로 추가된 이미지 합치기
    const newImages = [...images, ...files];
    setImages(newImages);

    // 이미지 미리보기 URL 생성
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 사진 삭제
  const handleRemoveImage = (indexToRemove) => {
    // images state에서 제거
    setImages(images.filter((_, index) => index !== indexToRemove));

    // imagePreviews state에서 제거
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(newPreviews);
    
    // 메모리 누수 방지를 위해 사용이 끝난 URL 해제
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };

  // 게시글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    const boardDto = {
      title: title,
      category: '기타', // '기타'로 기본값 설정 (API 명세 참고)
      isbn: null, // '나눔' 카테고리가 아니므로 null
      boardPic: null, // API 명세 예시 참고
      content: content,
    };
    
    const formData = new FormData();

    formData.append(
      'boards',
      new Blob([JSON.stringify(boardDto)], { type: 'application/json' })
    );

    images.forEach((image) => {
      formData.append('newImages', image);
    });

    try {
      await createBoard(formData);

      // 성공 시 커뮤니티 메인으로 이동
      navigate('/community');
    } catch (err) {
      // API 호출 실패 시 (인증 에러 포함) 에러 처리
      const status = err.message.match(/HTTP (\d+):/)?.[1];
      if (status === '401' || status === '403') {
        setError('글을 작성하려면 로그인이 필요합니다.');
      } else {
        setError('게시글 등록에 실패했습니다. 다시 시도해주세요.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between mb-6 relative">
        <button onClick={() => navigate('/community')} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">
          새 글 작성
        </h1>
        <div /> {/* 오른쪽 공간 맞추기용 빈 div */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 입력 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full text-lg border-b px-2 py-2 focus:outline-none focus:border-pistachio"
          />
        </div>
        {/* 내용 입력 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows="10"
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-pistachio"
          ></textarea>
        </div>
        {/* 사진 첨부 */}
        <div>
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          >
            <ImageIcon className="w-5 h-5" />
            <span>사진 첨부</span>
          </label>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
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
        {/* 에러 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* 등록 버튼 */}       {' '}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pistachio text-gray-800 font-bold py-3 rounded-md hover:bg-pistachio-dark transition disabled:bg-gray-300"
        >
                    {loading ? '등록 중...' : '등록'}       {' '}
        </button>
      </form>
    </div>
  );
}
