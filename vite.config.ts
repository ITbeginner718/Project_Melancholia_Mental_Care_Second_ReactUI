import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'; // path 모듈 import  
import mkcert from 'vite-plugin-mkcert' 

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(), 
    mkcert(),
  ],

  // 웹 통신 시 https 사용  
  server:{
    https: {
      // 인증서와 키 파일을 지정하는 객체
      key: './.cert/key.pem',
      cert: './.cert/cert.pem', 
    },
  },

  resolve: {
    alias: [
      {
        find: '~bootstrap',
        replacement: path.resolve(__dirname, 'node_modules/bootstrap'),
      },

      {
        find: 'component',
        replacement: path.resolve(__dirname, 'src'),
      },

      {
        find: '@components',
        replacement: "/src/components",
      },

      {
        find: '@',
        replacement: "/src" ,
      },
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
}
)


