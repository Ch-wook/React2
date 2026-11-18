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
| `src/app/[id]/page.tsx`, `src/lib/data.ts` | 7·9주차: 글 조회, 초기 좋아요를 props로 전달 |
| `src/ui/LikeButton.tsx` | 로컬 좋아요, 중복 클릭 방지, 지연 타이머 정리 |
| `src/components/Counter.tsx`, `src/app/counter/` | 상태와 클릭 이벤트 |
| `src/components/ClientLayout.tsx`, `ServerContent.tsx` | 10주차: 클라이언트 슬롯에 서버 UI 전달 |
| `src/app/interleaved/` | 서버 fetch 결과를 children으로 조합 |
| `src/components/ThemeProvider.tsx`, `ThemeStatus.tsx` | 10·11주차: Context와 테마 전환 |
| `src/components/gallery/`, `src/app/gallery/` | 11주차: items·조건부 렌더링·이미지 캐러셀 |
| `src/components/Carousel.tsx`, `src/app/carousel/` | 첨부 ZIP의 개념 카드 추가 예제 |

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

Next.js, eslint-config-next, @next/bundle-analyzer는 16.4.6으로 맞췄습니다. React와 React DOM은 19.2.8입니다. 분석 플러그인은 Webpack용이므로 아래 명령을 사용합니다.

```powershell
$env:ANALYZE = "true"
try { npm.cmd run build -- --webpack }
finally { Remove-Item Env:ANALYZE }
```

`.next/analyze/client.html`과 서버 분석 보고서를 생성합니다. 보고서는 자동으로 브라우저를 열지 않으며 Git에 포함하지 않습니다. 평소 빌드는 `npm.cmd run build`를 사용합니다.

## 7·9·10·11주차 실습

- `/counter`: 초기 12에서 Click me를 누르면 1씩 증가합니다.
- `/nextjs`, `/routing`, `/ssr-ssg`, `/dynamic-routes`: 서버가 글과 초기 좋아요를 전달합니다. 좋아요는 즉시 증가하고 300ms 동안 반복 클릭을 막습니다. DB 저장은 하지 않으며 새로고침하면 초기값으로 돌아갑니다. 없는 id는 404입니다.
- `/interleaved`: 서버에서 JSONPlaceholder의 제목을 읽어 ClientLayout의 children에 넣습니다. 외부 API 실패·5초 시간 초과에는 대체 문구를 표시합니다.
- 공통 헤더의 테마 버튼: Context의 light/dark 상태를 전환하고 HTML의 data-theme와 CSS를 연결합니다. Link 이동 중에는 공통 Provider가 유지됩니다. 저장소를 사용하지 않아 새로고침하면 light로 시작합니다.
- `/carousel`: 개념 카드의 이전·다음 이동입니다.
- `/gallery`: View pictures로 이미지 캐러셀을 열고 이전·다음·페이지 선택을 실행합니다. 자동 재생은 버튼으로 시작·정지하며, 기본값은 정지입니다. 사진 주소는 picsum.photos이므로 이미지 로드에는 인터넷이 필요합니다.

갤러리는 첨부 ZIP의 `LocalCarousel`을 통합한 학습용 구현입니다. `acme-carousel` 패키지는 설치하지 않았으며 패키지의 전체 API를 제공하지 않습니다. 외부 패키지 래퍼·items·CSS·export 문제는 날짜별 수업 문서에 정리했습니다.

## 첨부 자료와 업데이트 ZIP

[원본 강의 정리](../docs/lecture-materials/nov11/)를 보관하고 [통합 기록](../docs/SOURCES.md)에 변경 이유와 검증 범위를 적었습니다. 첨부 문서가 언급하는 강의 영상은 이번 작업에서 직접 확인한 자료가 아닙니다.

업데이트 ZIP의 최상위에는 날짜별 `README.md`·`RENAMED.md`, `docs`, 이 `my-next-app` 폴더가 들어 있습니다. 압축을 푼 뒤 `my-next-app`에서 `npm.cmd ci`를 실행합니다. `node_modules`·`.next`·`.git`은 포함하지 않습니다.
