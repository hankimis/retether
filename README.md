# ReTether - Referral & Payback Management Platform

Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui + Prisma + NextAuth + PostgreSQL

## Getting Started

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 연결 (필수)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retether?schema=public"

# NextAuth (필수)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-to-a-random-secret-key"

# Email (SMTP) - NextAuth Email provider용
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="no-reply@retether.io"

# AWS S3 / R2 (선택사항 - 파일 업로드용)
AWS_S3_REGION="ap-northeast-2"
AWS_S3_BUCKET="your-bucket-name"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

### 2. 데이터베이스 설정

**옵션 A: Neon (클라우드 PostgreSQL) - 추천**
1. [Neon](https://neon.tech)에서 무료 계정 생성
2. 프로젝트 생성 후 Connection String 복사
3. `.env`의 `DATABASE_URL`에 붙여넣기

**옵션 B: 로컬 PostgreSQL**
1. PostgreSQL 설치 및 실행
2. 데이터베이스 생성: `CREATE DATABASE retether;`
3. `.env`의 `DATABASE_URL` 설정

### 3. Prisma 마이그레이션

```bash
npx prisma migrate dev
```

### 4. 개발 서버 실행

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
