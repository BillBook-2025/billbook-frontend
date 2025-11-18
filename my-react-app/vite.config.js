import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    // server.proxy 옵션을 추가합니다.
    proxy: {
      // 웹소켓용 설정
      '/api/ws': {
        target: 'http://13.209.17.126:8080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      },

      // '/api'로 시작하는 모든 요청을 프록시(중계)합니다.
      '/api': {
        target: 'http://13.209.17.126:8080', // 실제 백엔드 서버 주소
        changeOrigin: true, // Cross-Origin 요청을 위해 true로 설정

        // websocket
        ws: true,
        
        // 쿠키 서버로 보내는 거(인증)를 위한 설정
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 백엔드에서 온 응답(proxyRes)에 'set-cookie' 헤더가 있는지 확인
            if (proxyRes.headers['set-cookie']) {
              // 'set-cookie' 헤더에서 Domain 속성을 localhost로 변경
              const cookies = proxyRes.headers['set-cookie'].map((cookie) =>
                cookie
                  .replace(/; domain=[^;]+/, '; domain=localhost') // 도메인 변경
                  .replace(/; Secure/, '') // 'Secure' 속성 제거 (http 환경 테스트용)
                  .replace(/; SameSite=(Strict|Lax|None)/, '')
              );
              proxyRes.headers['set-cookie'] = cookies;
            }
          });
        },
      },
    },
  },
});
/**브라우저 (React): "http://localhost:3000/api/books로 요청 보낼게! (여기 localhost용 쿠키도 같이 줄게)"

Vite 개발 서버 (at localhost:3000): "(요청을 가로채며) 오케이, /api 요청이네. vite.config.js 보니까 13.209.17.126으로 중계하라고 되어 있군."

Vite 개발 서버 (중계): "(브라우저에서 받은 요청 그대로) http://13.209.17.126:8080/api/books야, 이 요청 좀 처리해줘."

백엔드 서버 (at 13.209...): "(Vite 서버로부터 요청을 받음) 어, 쿠키(JSESSIONID)도 잘 들어있네. 로그인 됐군. 자, 여기 데이터(JSON) 줄게."

Vite 개발 서버 (중계): "(백엔드에서 JSON 받음) 오케이, 이걸 다시 브라우저한테 전달해야지."

브라우저 (React): "와! localhost:3000에서 데이터를 보내줬다! 성공!" */
