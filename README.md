## 프로젝트 소개
- 개요: 
  - 헬스 및 운동을 하는 사람들이 목표와 현재 수치를 설정한다.
  - 달성과정을 글과 사진, 현재 수치를 게시하여 공유하고 정보도 공유하고 서로 응원할 수 있는 SNS 
- 배포 url: [https://my-sns-healthtar.vercel.app/](https://my-sns-healthtar.vercel.app/)
- testId: 
  - dev.lsw91@gmail.com / gpftmxk@W
  - sp91lsu@gmail.com / gpftmxk@W

## 기술 스택
- Next.js 14
- Typescript
- Firebase 
  - Firebaes client SDK
  - Firebase admin SDK
  - firestore
- React-Query
- zustand
- zod
- react-hook-form
- tailwindCSS
- SCSS
- sharcn/ui
- antd

## 파일구조
- src
  - app
    - (protected)
      - @modal (모달 패러렐,인터셉트 경로)
      - main (메인페이지)
      - post (게시물: 추가,상세,수정 페이지)
      - profile (프로필페이지 중간경로)
      - users
        - [nickname] (프로필페이지)
    - (public)
      - signIn (로그인 페이지)
      - signUp (회원가입 페이지)
    - api (firebase admin sdk api)
    - client-api (firebase client sdk api)
  - assets
    - img
    - style
  - components
  - firebase (firebase config 파일들)
  - lib
    - hooks
    - auth.ts (파이어베이스 인증 관련 메서드들)
    - routes.ts (라우트 enum 변수들)
    - schemas.ts (여러 type 값들)
  - stores (zustand 스토어들, 설정파일)

## 주요기능
- 회원가입->이메일 인증->로그인 가능
- 프로필 편집: 현재, 목표
