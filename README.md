# 계산모아 (calcmoa)

애드센스 수익화를 목표로 하는 생활·금융 계산기 모음 사이트. Next.js App Router + Tailwind CSS, 완전 정적(SSG) 배포.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 현재 구현된 계산기 (MVP 5+1)

| 경로 | 계산기 | 카테고리 |
| --- | --- | --- |
| `/salary` | 연봉 실수령액 계산기 | 급여/세금 |
| `/severance` | 퇴직금 계산기 | 급여/세금 |
| `/income-tax` | 종합소득세 계산기 | 급여/세금 |
| `/vat` | 부가세 계산기 | 급여/세금 |
| `/loan` | 대출 원리금 상환 계산기 | 대출/금융 |
| `/age` | 만나이 계산기 | 생활 |

새 계산기를 추가하려면: `src/lib/calculators/*.ts`에 순수 계산 함수 작성 → `src/components/calculators/*.tsx`에 클라이언트 UI 작성 → `src/app/<slug>/page.tsx`에서 `ToolPageShell`로 조립 → `src/lib/tools.ts`에 메타데이터 등록.

## 환경변수

`.env.example` 참고. 로컬 개발에는 필요 없으며, Vercel 배포 시 아래 값을 설정합니다.

- `NEXT_PUBLIC_SITE_URL`: sitemap/robots/OG 태그에 사용되는 배포 도메인
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 측정 ID (없으면 GA 미삽입)
- `NEXT_PUBLIC_ADSENSE_CLIENT`: 애드센스 승인 후 설정 (자동 광고 방식, 없으면 광고 스크립트 미삽입)

## 배포 (무료 플랜 기준)

1. GitHub에 이 저장소를 public repo로 푸시
2. [vercel.com](https://vercel.com)에서 GitHub 저장소 Import → Framework Preset은 Next.js 자동 인식 → 배포
   - 무료 서브도메인(`프로젝트명.vercel.app`)으로 우선 운영, 수익 발생 후 커스텀 도메인(.com/.kr) 구매 권장
3. [Google Search Console](https://search.google.com/search-console)에 배포된 도메인 등록 후 `/sitemap.xml` 제출
4. [Google Analytics](https://analytics.google.com)에서 속성 생성 → 측정 ID를 Vercel 환경변수 `NEXT_PUBLIC_GA_ID`에 등록
5. 트래픽 발생 확인 후 [Google 애드센스](https://www.google.com/adsense/) 신청 → 사이트 소유권 확인 후 `NEXT_PUBLIC_ADSENSE_CLIENT` 등록, 대시보드에서 자동 광고 활성화

## 스택

- Next.js 16 (App Router, 전 페이지 정적 생성)
- Tailwind CSS 4
- 서버 불필요 — 모든 계산 로직은 클라이언트 사이드 JS
