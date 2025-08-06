// src/pages/main/Post.jsx

// 같은 게시글을 눌렀을 때, 내가 올린 글이면 (게시자 입장)으로 보이고 남의 글이면(보는 입장)으로 보이도록...
/**### 거래글(보는 입장)

- 책 정보
- [찜하기]
- [채팅하기] - 제공자(빌려주는사람)-빌리는사람(대여자)간의 채팅 화면으로 연결
- 이 게시글 [신고하기]
 */
/**
 *  ### 거래글(게시자 입장)

- [수정]
- [삭제]
 */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Post() {
  // return <h1>게시글 보기 페이지</h1>;
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [myId, setMyId] = useState(null);   // 내 아이디
  const [isOwner, setIsOwner] = useState(false); // 내가 쓴 글인지 확인

  useEffect(() => {
    // 1. 내 정보 불러오기
    fetch("/api/my")
      .then(res => res.json())
      .then(data => setMyId(data.userId))
      .catch(err => console.error("내 정보 로드 실패", err));

    // 2. 게시글 정보 불러오기
    fetch(`/api/boards/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error("게시글 로드 실패", err));
  }, [postId]);

  useEffect(() => {
    if (post && myId !== null) {
      setIsOwner(post.userId === myId);
    }
  }, [post, myId]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>책 제목: {post.bookTitle}</p>
      <p>작성자: {post.username}</p>
      <img src={post.bookImageUrl} alt="책 이미지" width="200" />

      {isOwner ? ( // 본인이 올린 게시물이면
        <div>
          <button onClick={() => handleEdit(post.id)}>수정</button>
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </div>
      ) : ( // 남이 올린 게시물이면
        <div>
          <button onClick={() => handleLike(post.bookId)}>찜하기</button>
          <button onClick={() => handleChat(post.bookId)}>채팅하기</button>
          <button onClick={() => handleReport(post.id)}>신고하기</button>
        </div>
      )}
    </div>
  );
}

function handleEdit(postId) {
  window.location.href = `/edit/${postId}`;
}

function handleDelete(postId) {
  if (window.confirm("정말 삭제할까요?")) {
    fetch(`/api/boards/${postId}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          alert("삭제 완료!");
          window.location.href = "/boards";
        } else {
          alert("삭제 실패!");
        }
      })
      .catch(err => console.error("삭제 실패", err));
  }
}

function handleLike(bookId) {
  fetch(`/api/books/${bookId}/like`, {
    method: "POST",
  })
    .then(res => {
      if (res.ok) {
        alert("찜 완료!");
      } else {
        alert("찜 실패!");
      }
    })
    .catch(err => console.error("찜 실패", err));
}

function handleChat(bookId) {
  fetch(`/api/books/${bookId}/chatroom`, {
    method: "POST",
  })
    .then(res => res.json())
    .then(data => {
      const chatroomId = data.chatroomId;
      window.location.href = `/chat/${chatroomId}`;
    })
    .catch(err => console.error("채팅방 생성 실패", err));
}

function handleReport(postId) {
  alert(`신고 기능은 아직 구현되지 않았습니다. (게시글 ID: ${postId})`);
}