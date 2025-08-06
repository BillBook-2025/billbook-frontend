# 구글 북스 API 사용법

## 1. 구글 북스 API 개요

- **기본 URL**: `https://www.googleapis.com/books/v1/volumes`
- **검색 쿼리**: `?q=검색어`
- **책 상세 조회**: `/{volumeId}` (특정 책 ID로 상세정보 조회)
- 인증키 없이도 호출 가능 (일부 제한 있음)

---

## 2. 검색 API 사용 예시

```http
GET https://www.googleapis.com/books/v1/volumes?q=harry+potter
```

- `q` 파라미터에 검색어를 넣으면, 관련 책 리스트를 JSON으로 반환합니다.

---

## 3. React에서 책 검색 호출 예시

```jsx
import { useState, useEffect } from "react";

function BookSearch({ keyword }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!keyword) return;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        // data.items가 책 리스트 배열
        setBooks(data.items || []);
      })
      .catch((err) => {
        console.error("구글북스 검색 실패", err);
        setBooks([]);
      });
  }, [keyword]);

  return (
    <div>
      <h2>검색 결과: {keyword}</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={`${book.volumeInfo.title} 표지`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 4. 특정 책 상세정보 조회

- 책 ID가 `bookId`라면:

```http
GET https://www.googleapis.com/books/v1/volumes/{bookId}
```

- React에서:

```jsx
useEffect(() => {
  fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(res => res.json())
    .then(data => {
      // data.volumeInfo에 상세정보가 있음
    });
}, [bookId]);
```

---

## 5. API 제한 및 참고사항

- 인증키 없이 사용 가능하지만, 하루 요청 제한이 있음 (1,000~1만회 정도)
- 큰 서비스면 [Google Cloud Console](https://console.cloud.google.com/)에서 API 키 받아서 사용하는 게 좋음
- API 키 발급 후, 요청 URL 뒤에 `&key=YOUR_API_KEY` 추가

---

# 구글 API 키 발급 방법

구글 클라우드 플랫폼(GCP)에서 API 키를 발급받는 절차입니다. 구글 북스 API를 안정적으로 사용하려면 인증 키를 사용하는 것이 좋습니다.

---

## 1. 구글 클라우드 콘솔 접속

- [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
- 구글 계정으로 로그인합니다.

---

## 2. 프로젝트 생성 또는 선택

- 좌측 상단의 **프로젝트 선택**을 클릭합니다.
- 새 프로젝트를 만들려면 **새 프로젝트**를 선택하고, 이름을 입력한 후 **만들기**를 클릭합니다.
- 기존 프로젝트가 있다면 원하는 프로젝트를 선택합니다.

---

## 3. API 사용 설정

- 좌측 메뉴에서 **API 및 서비스 > 라이브러리**로 이동합니다.
- 검색창에 `Books API`를 입력합니다.
- `Books API`를 선택하고, **사용 설정** 버튼을 클릭합니다.

---

## 4. API 키 생성

- 좌측 메뉴에서 **API 및 서비스 > 사용자 인증 정보**로 이동합니다.
- 상단에서 **사용자 인증 정보 만들기** 버튼을 클릭하고, **API 키**를 선택합니다.
- 새로운 API 키가 생성됩니다.
- 생성된 API 키를 복사하여 저장해 둡니다.

---

## 5. API 키 제한 설정 (선택 사항)

- 생성된 API 키 옆에 있는 **제한 사항 편집**을 클릭합니다.
- 필요에 따라 사용 가능한 API를 `Books API`로 제한하거나, 요청 출처(웹사이트, IP 등)를 제한할 수 있습니다.
- 저장을 클릭하여 설정을 완료합니다.

---

## 6. API 키 사용 예시

- API 요청 시 URL 끝에 `&key=YOUR_API_KEY`를 추가하여 사용합니다.

예시: https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=YOUR_API_KEY   



---

필요 시, API 사용량 모니터링과 결제 설정도 Google Cloud Console에서 관리할 수 있습니다.

---

