# Next.js 수업 실습

[날짜별 수업 정리](../RENAMED.md) · [자료 출처](../docs/SOURCES.md) · [저장소 안내](../README.md)

## 실행

이 폴더에서 실행합니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

기본 주소는 http://localhost:3000 입니다.

## 실습 파일

| 파일 | 역할 |
| --- | --- |
| `src/app/layout.tsx` | 한국어 루트 레이아웃, 메타데이터, 공통 메뉴 |
| `src/app/(marketing)/about/` | 라우트 그룹과 중첩 레이아웃 |
| `src/app/blog/posts.tsx` | 수업용 게시글 데이터 |
| `src/app/blog/[slug]/page.tsx` | Promise params, generateStaticParams, 없는 글 처리 |
| `src/app/blog2/` | 6주차: generateStaticParams 없는 동적 경로 |
| `src/app/blog3/` | 6주차: generateStaticParams로 글 4개 사전 생성 |
| `src/app/ui/loading-indicator.tsx` | useLinkStatus로 링크 이동 상태 표시 |
| `src/app/ui/hover-prefetch-link.tsx` | 호버·키보드 포커스 후 프리페칭 활성화 |
| `src/app/contact/page.tsx` | 일반 a 태그의 문서 이동 비교 |
| `src/app/products/page.tsx` | 검색 매개변수 읽기, 중복 키·누락 값 처리 |
| `src/app/streaming/` | 요청 시점 렌더링과 로딩 화면 관찰 |

`/streaming`의 2초 지연은 수업 실습용입니다. 경로가 이미 캐시되면 로딩 표시가 짧아질 수 있습니다. 기본 Link 자동 프리페칭은 프로덕션 실행에서 확인하세요.

## 검사

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

App Router, TypeScript, Tailwind CSS 4를 사용합니다. `@/*`는 `src/*`를 가리킵니다. npm과 `package-lock.json`을 기준으로 설치합니다.

## 6주차 비교 실습

- `/blog2` → 글: 프리페칭을 끈 링크로 요청 시점 페이지에 이동합니다. 개발자 도구에서 느린 네트워크를 설정하면 링크 옆의 이동 표시를 관찰하기 쉽습니다. 캐시된 이동은 표시가 짧거나 생략될 수 있습니다.
- `/blog3` → 글: 호버 또는 포커스 후 프리페칭을 활성화합니다. 프로덕션 빌드에서는 글 4개가 사전 생성됩니다.
- 상단 Contact: 일반 a 태그로 이동하며 전체 문서 요청을 Link와 비교합니다.
- 기존 `/blog`는 이전 주차의 공통 레이아웃 예제로 유지합니다.

## 번들 분석

Next.js, eslint-config-next, @next/bundle-analyzer는 16.3.8로 맞췄습니다. 분석 플러그인은 Webpack용이므로 아래 명령을 사용합니다.

```powershell
$env:ANALYZE = "true"
try { npm.cmd run build -- --webpack }
finally { Remove-Item Env:ANALYZE }
```

`.next/analyze/client.html`과 서버 분석 보고서를 생성합니다. 보고서는 자동으로 브라우저를 열지 않으며 Git에 포함하지 않습니다. 평소 빌드는 `npm.cmd run build`를 사용합니다.
