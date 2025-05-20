# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
  
    
      
# BillBook Frontend  
  
## 초기 세팅 관련 참고사항  
- https://velog.io/@my_suwan/프론트엔드-개인프로젝트-및-협업시-초기세팅  
  
### gitignore 파일 생성하기  
- https://www.toptal.com/developers/gitignore/  
  
### 폴더 구조 예시  
```
my-app/
├─ public/              --> 정적 파일 및 HTML 파일이 저장되는 폴더
├─ src/                 --> 앱의 소스코드가 저장되는 폴더
│   ├─ api/             --> API 요청과 관련된 코드를 저장하는 폴더
│   ├─ assets/          --> 이미지, CSS, 글꼴과 같은 리소스를 저장하는 폴더
│   │   ├─ images/  
│   │   └─ css/      
│   ├─ components/      --> 리액트 컴포넌트가 저장되는 폴더 
│   │   ├─ App/         --> 앱 전체 레이아웃 또는 주요 뷰 컴포넌트
│   │   ├─ Navbar/      --> 네비게이션 바 컴포넌트
│   │   └─ Footer/      --> 푸터 컴포넌트
│   ├─ containers/      --> 상태관리와 같은 로직이 포함된 컨테이너 컴포넌트 저장
│   ├─ hooks/           --> 사용자 정의 Custom Hook 저장
│   ├─ pages/           --> 각 페이지에 대한 레이아웃 및 로직 담당
│   ├─ utils/           --> 유틸리티 함수 등 자주 쓰이는 코드 저장
│   ├─ routes/          --> 라우팅 정보 저장
│   └─ store/           --> 상태 관리(Redux, MobX 등) 관련 코드 저장
│       ├─ actions/
│       ├─ reducers/
│       └─ types/
├─ .env
├─ .gitignore
├─ package.json
└─ README.md
```
  