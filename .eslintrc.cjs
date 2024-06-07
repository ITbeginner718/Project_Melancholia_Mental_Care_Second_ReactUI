module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn', // 경고로 설정
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],

    // ESLint가 firebase-messaging-sw.js 파일을 서비스 워커 스크립트로 인식하지 못해서 발생
    // firebase-messaging-sw.js 파일을 서비스 워커 컨텍스트로 인식하도록 설정을 추가
    overrides: [
      {
          files: ["public/firebase-messaging-sw.js"],
          env: {
              browser: true,
              serviceworker: true
          },
          globals: {
              importScripts: "readonly"
          }
      }
  ]

  },
}
