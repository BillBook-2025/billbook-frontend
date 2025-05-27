# 📚 BillBook API 명세서

---

## ✨ 기능 개요

- 회원 가입: 아이디, 비밀번호, 이름, 전화번호, 이메일 (전화번호 본인 인증 포함)
- 커뮤니티 게시글에 책 정보 연동 (인기검색어 클릭 → 책 상세 페이지로 이동)
- 이미지 업로드 기능
  - POST `/api/users/{userId}/profile-image`
  - POST `/api/bookboards/{boardId}/images`

---

## 🌐 URI 구조도

```text
/api
  ├── /websocket
  │   ├── /ws-chat              → 클라이언트 웹소켓 연결
  │   ├── /app/chat.send        → 서버로 메시지 전송
  │   └── /topic/{chatroom_id}  → 채팅방 메시지 전파
  ├── /auth
  │   ├── /login [POST, DELETE]
  │   ├── /refresh [POST]
  │   └── /find
  │       ├── /id [POST]
  │       └── /password
  │           ├── [POST]
  │           ├── /choice [POST]
  │           └── /change [POST]
  │   └── /signup [POST, DELETE]
  ├── /books
  │   ├── [GET]
  │   ├── /{book_id}
  │   │   ├── [GET, PATCH]
  │   │   ├── /chatroom [POST]
  │   │   ├── /like [GET, POST, DELETE]
  │   │   ├── /upload-images [POST]
  │   │   └── /borrow [POST]
  │   └── /search
  │       ├── [GET]
  │       └── /history
  │           ├── [GET, DELETE]
  │           └── /{history_id} [DELETE]
  │   └── /register
  │       ├── /new [POST]
  │       ├── /existing [POST]
  │       └── /{book_id} [PATCH, DELETE]
  ├── /my
  │   ├── [GET, PATCH]
  │   ├── /register [GET]
  │   ├── /borrow [GET]
  │   ├── /like [GET]
  │   ├── /point [GET, POST]
  │   ├── /temporature [GET]
  │   ├── /boards [GET]
  │   ├── /profile-image [POST]
  │   ├── /follower [GET]
  │   └── /following [GET]
  ├── /profile/{user_id}
  │   ├── [GET]
  │   ├── /follow [GET, POST, DELETE]
  │   ├── /temporature [GET, POST]
  │   ├── /borrow [GET]
  │   ├── /register [GET]
  │   └── /history [GET]
  ├── /chatrooms
  │   ├── [GET, DELETE]
  │   └── /{chat_id}
  │       ├── [GET]
  │       ├── /chat [GET, POST]
  │       ├── /picture [GET, POST]
  │       ├── /deal [POST]
  │       └── /deadline [GET, POST]
  └── /boards
      ├── [GET, POST]
      ├── /{user_id} [GET]
      └── /{board_id}
          ├── [GET, PATCH, DELETE]
          ├── /like [GET, POST, DELETE]
          └── /comments
              ├── [GET, POST, DELETE]
              └── /{comment_id} [POST]
````

## 🌐 URI 구조

---

### 📡 WebSocket

- `/api/websocket/ws-chat`  
  → 클라이언트 웹소켓 연결
- `/api/websocket/app/chat.send`  
  → 서버로 메시지 전송
- `/api/websocket/topic/{chatroom_id}`  
  → 채팅방 메시지 전파

---

### 🔐 Auth

- `/api/auth/login`  
  `POST`: 로그인  
  `DELETE`: 로그아웃

- `/api/auth/refresh`  
  `POST`: access token 재발급

- `/api/auth/find/id`  
  `POST`: 아이디 찾기 요청

- `/api/auth/find/password`  
  - `POST`: 비밀번호 찾기 요청  
  - `/choice`  
    `POST`: 본인인증 API 요청  
  - `/change`  
    `POST`: 비밀번호 변경

- `/api/auth/signup`  
  `POST`: 회원가입 요청  
  `DELETE`: 회원 탈퇴

---

### 📚 Books

- `/api/books`  
  `GET`: 등록된 책 목록 불러오기

- `/api/books/{book_id}`  
  `GET`: 책 상세 정보  
  `PATCH`: 게시글 수정  
  - `/chatroom`  
    `POST`: 채팅방 생성  
  - `/like`  
    `GET`: 좋아요 개수  
    `POST`: 좋아요 누르기  
    `DELETE`: 좋아요 취소  
  - `/upload-images`  
    `POST`: 사진 업로드  
  - `/borrow`  
    `POST`: 책 대출하기

- `/api/books/search`  
  `GET`: 책 검색  
  - `/history`  
    `GET`: 검색 기록 조회  
    `DELETE`: 검색 기록 삭제  
    - `/{history_id}`  
      `DELETE`: 특정 기록 삭제

- `/api/books/register`  
  - `/new`  
    `POST`: 책 등록하기  
  - `/existing`  
    `POST`: 반납 완료 후 자동 게시글 생성  
  - `/{book_id}`  
    `PATCH`: 게시글 수정  
    `DELETE`: 등록된 책 취소  
    - `/upload-images`  
      `POST`: 사진 업로드  
    - `/borrow`  
      `POST`: 책 대출하기

---

### 👤 내 정보 (`/api/my`)

- `GET`: 개인정보 조회  
- `PATCH`: 개인정보 수정

- `/register`  
  `GET`: 등록한 책 목록

- `/borrow`  
  `GET`: 빌린 책 목록

- `/like`  
  `GET`: 좋아요한 책 목록

- `/point`  
  `GET`: 마이포인트 조회  
  `POST`: 포인트 충전

- `/temporature`  
  `GET`: 매너온도 조회

- `/boards`  
  `GET`: 내가 쓴 게시물

- `/profile-image`  
  `POST`: 프로필 이미지 등록

- `/follower`  
  `GET`: 내 팔로워 목록

- `/following`  
  `GET`: 내 팔로잉 목록

---

### 👥 다른 유저 프로필 (`/api/profile/{user_id}`)

- `GET`: 유저 프로필 조회

- `/follow`  
  `GET`: 팔로워 조회  
  `POST`: 팔로우 하기  
  `DELETE`: 팔로우 취소

- `/temporature`  
  `GET`: 매너온도  
  `POST`: 매너평가

- `/borrow`  
  `GET`: 유저가 대여한 책 목록

- `/register`  
  `GET`: 유저가 등록한 책 목록

- `/history`  
  `GET`: 해당 유저의 책 거래 횟수

---

### 💬 채팅방

- `/api/chatrooms`  
  `GET`: 채팅 목록  
  `DELETE`: 채팅방 나가기

- `/api/chatrooms/{chat_id}`  
  `GET`: 채팅방 상세  
  - `/chat`  
    `GET`: 메시지 가져오기  
    `POST`: 메시지 보내기  
  - `/picture`  
    `GET`: 사진 가져오기  
    `POST`: 사진 올리기  
  - `/deal`  
    `POST`: 송금하기  
  - `/deadline`  
    `GET`: 기한 확인  
    `POST`: 기한 설정 (날짜/시간 포함)

---

### 📝 게시판

- `/api/boards`  
  `GET`: 게시글 목록  
  `POST`: 게시글 작성

- `/api/boards/{user_id}`  
  `GET`: 특정 유저의 게시글 목록

- `/api/boards/{board_id}`  
  `GET`: 게시글 조회  
  `PATCH`: 수정  
  `DELETE`: 삭제  
  - `/like`  
    `GET`: 좋아요 수 + 내 좋아요 여부  
    `POST`: 좋아요  
    `DELETE`: 좋아요 취소  
  - `/comments`  
    `GET`: 댓글 조회  
    `POST`: 댓글 작성  
    `DELETE`: 댓글 삭제  
    - `/{comment_id}`  
      `POST`: 대댓글 작성

---

## 🔐 /auth

### 🔸 /auth/login

* **POST** 로그인

```http
POST /api/auth/login
```

#### 요청

```json
{
  "id": "whwnsdus",
  "password": "1234"
}
```

#### 응답

* 성공 (200)

```json
{
  "userId": 1,
  "username": "조준연",
  "email": "test@example.com",
  "profilePic": "https://your-s3-url.com/profile.jpg",
  "temperature": 36.5,
  "isPhoneVerified": true
}
```

* 실패:

  * 400 잘못된 요청
  * 409 로그인 실패
  * 500 서버 오류

---

* **DELETE** 로그아웃

```http
DELETE /api/auth/login
```

* 세션 ID를 이용해 세션 무효화

---

### 🔸 /auth/refresh

* **POST** Access Token 재발급

```http
POST /api/auth/refresh
```

* 응답 예시

```json
{
  "accessToken": "new.jwt.access.token"
}
```

---

### 🔸 /auth/find/id

* **POST** 아이디 찾기

```http
POST /api/auth/find/id
```

#### 요청

```json
{
  "email": "abcd1234@naver.com"
}
```

#### 응답

```json
{
  "message": "등록된 이메일로 아이디를 전송했습니다."
}
```

---

### 🔸 /auth/find/password

* **POST** 비밀번호 찾기 요청

```http
POST /api/auth/find/password
```

#### 요청

```json
{
  "id": "whwnsdus11"
}
```

#### 응답

```json
{
  "can_authenticate": true,
  "message": "휴대폰 인증을 진행하세요."
}
```

---

### 🔸 /auth/find/password/choice

* **POST** 본인 인증

```http
POST /api/auth/find/password/choice
```

#### 요청

```json
{
  "name": "조준연",
  "birth_date": "19990101",
  "carrier": "SKT",
  "phone_number": "01012345678"
}
```

#### 응답

```json
{
  "tx_id": "abcdef123456",
  "ci": "고유값",
  "name": "조준연",
  "phone_number": "01012345678",
  "birth_date": "19990101",
  "success": true
}
```

---

### 🔸 /auth/find/password/change

* **POST** 비밀번호 교체

```http
POST /api/auth/find/password/change
```

#### 요청

```json
{
  "password": "1q2w3e4r@",
  "re-password": "1q2w3e4r@"
}
```

#### 응답

```json
{
  "message": "비밀번호가 변경되었습니다."
}
```

---

### 🔸 /auth/signup

* **POST** 회원가입

```http
POST /api/auth/signup
```

#### 요청

```json
{
  "id": "whwnsdus",
  "password": "1q2w3e4r@",
  "re-password": "1q2w3e4r@",
  "name": "조준연",
  "phone": "01012345678",
  "email": "abcd1234@naver.com"
}
```

#### 응답

```json
{
  "userId": 1,
  "message": "회원가입이 완료되었습니다."
}
```


