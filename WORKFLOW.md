# ReTether 프로젝트 워크플로우 및 진행 상황

## 📋 프로젝트 개요
**ReTether** - 제휴 거래소 페이백 관리 및 셀퍼럴 리워드 플랫폼
- Next.js 16 (App Router) + TypeScript + TailwindCSS + Prisma + NextAuth
- PostgreSQL 데이터베이스
- AWS S3 파일 업로드 지원

---

## ✅ 완료된 기능

### 1. 인증 및 권한 관리
- ✅ NextAuth 기반 인증 시스템
- ✅ Credentials Provider (이메일/비밀번호 로그인)
- ✅ Email Provider (이메일 링크 로그인)
- ✅ 역할 기반 접근 제어 (USER, OPERATOR, ADMIN)
- ✅ JWT 세션 관리
- ✅ 사용자 등록 API (`/api/auth/register`)
- ✅ 관리자 계정 생성 스크립트 (`scripts/create-admin.ts`)
- ✅ 로그인/로그아웃 UI (`/auth/signin`)

### 2. 데이터베이스 모델
- ✅ User 모델 (이메일, 비밀번호, 역할)
- ✅ Exchange 모델 (거래소 정보)
- ✅ Event 모델 (이벤트 정보)
- ✅ PaybackRule 모델 (페이백 규칙)
- ✅ NextAuth 관련 모델 (Account, Session, VerificationToken)
- ✅ Prisma 마이그레이션 완료

### 3. 거래소 관리 (Admin)
- ✅ 거래소 목록 조회 (`/admin/exchanges`)
- ✅ 거래소 등록 (`/admin/exchanges/new`)
- ✅ 거래소 수정 (`/admin/exchanges/[id]`)
- ✅ 거래소 삭제 (ADMIN만 가능)
- ✅ 거래소 API (`/api/exchanges`)
  - GET: 활성 거래소 목록 조회
  - POST: 거래소 생성 (ADMIN/OPERATOR)
  - PATCH: 거래소 수정 (ADMIN/OPERATOR)
  - DELETE: 거래소 삭제 (ADMIN만)

### 4. 이벤트 관리 (Admin)
- ✅ 이벤트 목록 조회 (`/admin/events`)
- ✅ 이벤트 등록 (`/admin/events/new`)
- ✅ 이벤트 수정 (`/admin/events/[id]`)
- ✅ 이벤트 API (`/api/events`)
  - GET: 활성 이벤트 목록 조회
  - POST: 이벤트 생성 (ADMIN/OPERATOR)
  - PATCH: 이벤트 수정 (ADMIN/OPERATOR)

### 5. 사용자 페이지
- ✅ 홈페이지 (`/`)
- ✅ 제휴 거래소 목록 (`/exchanges`)
- ✅ 이벤트 목록 (`/events`)
- ✅ 페이백 테스트 페이지 (`/payback`)
- ✅ 소개 페이지 (`/about`)

### 6. 페이백 시스템
- ✅ 페이백 계산 API (`/api/payback/test`)
  - 거래소별 페이백율 적용
  - 거래량 기반 예상 페이백 계산
  - 통화별 환율 적용 (KRW, USD, USDT)
  - PaybackRule 기반 커미션 및 파트너 쉐어 계산

### 7. 파일 업로드
- ✅ AWS S3 파일 업로드 (`/api/upload`)
- ✅ Presigned URL 생성
- ✅ FileUploader 컴포넌트
- ✅ 거래소 로고 업로드 지원

### 8. 관리자 대시보드
- ✅ 관리자 대시보드 (`/admin`)
- ✅ 통계 카드 (거래소 수, 이벤트 수)
- ✅ 빠른 링크 (거래소/이벤트 관리)

### 9. UI 컴포넌트
- ✅ Header 컴포넌트 (네비게이션, 로그인 상태)
- ✅ Footer 컴포넌트
- ✅ shadcn/ui 기반 UI 컴포넌트
- ✅ 반응형 디자인

### 10. 데이터베이스 안전성
- ✅ `db-safe.ts` - 안전한 쿼리 실행 유틸리티
- ✅ Prisma 에러 처리
- ✅ 연결 오류 fallback 처리

---

## 🚧 미완성/개선 필요 기능

### 1. 페이백 시스템 개선
- ❌ **실제 페이백 데이터 저장 및 관리**
  - 현재는 테스트 계산만 가능
  - 사용자별 페이백 히스토리 저장 필요
  - 거래소 API 연동 필요 (실제 거래 데이터)
  
- ❌ **PaybackRule 관리 UI**
  - 현재 PaybackRule 모델은 있지만 관리 UI 없음
  - 거래소별 페이백 규칙 설정 페이지 필요
  
- ❌ **실제 환율 API 연동**
  - 현재는 하드코딩된 환율 사용 (KRW: 1350)
  - 실시간 환율 API 연동 필요

### 2. 사용자 기능
- ❌ **사용자 프로필 페이지**
  - 사용자 정보 수정
  - 내 페이백 내역 조회
  
- ❌ **사용자별 거래소 UID 등록**
  - 사용자가 자신의 거래소 UID를 등록/관리
  - UID별 페이백 추적

- ❌ **페이백 내역 조회**
  - 사용자별 페이백 히스토리
  - 거래소별/기간별 필터링
  - 페이백 통계

### 3. 관리자 기능 개선
- ❌ **PaybackRule 관리**
  - 거래소별 페이백 규칙 설정 UI
  - baseRate, partnerShare, floorAmount 설정
  
- ❌ **사용자 관리**
  - 사용자 목록 조회
  - 사용자 역할 변경
  - 사용자 삭제/비활성화

- ❌ **통계 및 리포트**
  - 거래소별 페이백 통계
  - 사용자별 페이백 통계
  - 기간별 리포트 생성

- ❌ **이벤트 배너 업로드**
  - 현재는 URL만 입력 가능
  - FileUploader를 이벤트 등록에도 적용

### 4. 데이터 모델 확장 필요
- ❌ **UserExchange 모델**
  - 사용자별 거래소 UID 저장
  - 사용자-거래소 연결 정보
  
- ❌ **PaybackHistory 모델**
  - 페이백 내역 저장
  - 거래소, 사용자, 금액, 날짜 등

- ❌ **Transaction 모델** (선택사항)
  - 실제 거래 데이터 저장
  - 거래소 API에서 가져온 거래 내역

### 5. API 개선
- ❌ **거래소 API 연동**
  - 실제 거래소 API와 연동하여 거래 데이터 가져오기
  - 주기적으로 거래 데이터 동기화
  
- ❌ **페이백 계산 자동화**
  - 주기적으로 거래 데이터를 기반으로 페이백 계산
  - 배치 작업 스케줄링

### 6. 보안 및 검증
- ❌ **입력 검증 강화**
  - 클라이언트/서버 양쪽 검증
  - XSS, SQL Injection 방지 확인
  
- ❌ **권한 검증 미들웨어**
  - 관리자 페이지 접근 제어
  - API 엔드포인트 보호

### 7. UI/UX 개선
- ❌ **로딩 상태 개선**
  - 스켈레톤 UI
  - 더 나은 에러 메시지 표시
  
- ❌ **다국어 지원** (선택사항)
  - i18n 설정

### 8. 테스트
- ❌ **단위 테스트**
- ❌ **통합 테스트**
- ❌ **E2E 테스트**

---

## 📝 다음 단계 우선순위

### 높은 우선순위
1. **PaybackRule 관리 UI 구현**
   - 거래소 수정 페이지에 PaybackRule 설정 추가
   - baseRate, partnerShare, floorAmount 입력 필드

2. **사용자별 거래소 UID 등록 기능**
   - UserExchange 모델 추가
   - 사용자 프로필 페이지에서 UID 관리

3. **페이백 내역 저장 및 조회**
   - PaybackHistory 모델 추가
   - 사용자별 페이백 내역 페이지

### 중간 우선순위
4. **실제 환율 API 연동**
   - 환율 API 서비스 연동
   - 실시간 환율 적용

5. **관리자 사용자 관리**
   - 사용자 목록 페이지
   - 역할 변경 기능

6. **이벤트 배너 업로드**
   - FileUploader를 이벤트 등록에도 적용

### 낮은 우선순위
7. **거래소 API 연동**
   - 실제 거래소 API 연동 (복잡도 높음)
   - 배치 작업 스케줄링

8. **통계 및 리포트**
   - 대시보드 통계 개선
   - 리포트 생성 기능

---

## 🔧 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: TailwindCSS
- **UI 컴포넌트**: shadcn/ui
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **인증**: NextAuth.js
- **파일 스토리지**: AWS S3
- **폼 검증**: Zod + React Hook Form

---

## 📁 주요 디렉토리 구조
```
retether/
├── app/
│   ├── admin/          # 관리자 페이지
│   ├── api/            # API 라우트
│   ├── auth/           # 인증 페이지
│   ├── components/     # 공통 컴포넌트
│   ├── events/         # 이벤트 페이지
│   ├── exchanges/      # 거래소 페이지
│   ├── lib/            # 유틸리티 (db-safe, prisma)
│   └── payback/        # 페이백 페이지
├── components/ui/       # shadcn/ui 컴포넌트
├── prisma/             # Prisma 스키마 및 마이그레이션
└── scripts/            # 유틸리티 스크립트
```

---

## 🚀 실행 방법
1. 환경 변수 설정 (`.env`)
2. 데이터베이스 마이그레이션: `npx prisma migrate dev`
3. 개발 서버 실행: `npm run dev`
4. 관리자 계정 생성: `npm run create-admin`

---

## 📌 참고사항
- 모든 데이터베이스 쿼리는 `safeQuery`를 통해 안전하게 처리됨
- 관리자 기능은 ADMIN 또는 OPERATOR 역할 필요
- 파일 업로드는 AWS S3 설정이 필요함 (선택사항)
- 페이백 계산은 현재 테스트용이며, 실제 데이터 연동 필요

