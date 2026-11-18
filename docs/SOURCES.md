# 수업 자료 비교 및 반영 기록

확인일: **2026-11-18 (Asia/Seoul)**. 사용자가 전달한 7개 GitHub 저장소의 기본 브랜치를 새로 내려받아 README와 실행 코드를 확인했다. 웹 검색의 이전 캐시 대신 실제 Git 커밋을 기준으로 비교했다. 사용자 저장소의 기존 커밋은 `cea8c8c`이며, 이번 작업 시작 시 원격과 일치했다.

## 2026-11-18 저장소 확인

| 저장소 | 확인한 커밋 | 커밋 시각 (KST) | 최근 수업과 변경 |
| --- | --- | --- | --- |
| [wpexq/React2](https://github.com/wpexq/React2) | [b7c0568](https://github.com/wpexq/React2/commit/b7c056847614600c4bb7864c25f8a6e36cd12481) | 11/11 13:51:43 | 7·9·10·11주차 노트, Context 동작 순서 |
| [wlswodnjs/react-02](https://github.com/wlswodnjs/react-02) | [ae1be8a](https://github.com/wlswodnjs/react-02/commit/ae1be8a76bb503f9c51c37b5e428fe400d2d5365) | 11/11 12:48:52 | 7·9·10·11주차, Counter·LikeButton·Interleaving·ThemeProvider 실행 코드 |
| [jinwooorp/React2](https://github.com/jinwooorp/React2) | [ae28831](https://github.com/jinwooorp/React2/commit/ae28831c31b7cc7fa2ecfa80f43f10dbd4a833ea) | 11/04 12:52:10 | 10/28 번들 최적화, 11/04 Context. 10/14 추가 내용 일부가 기존 1007 제목 아래에 있음 |
| [gkfg/Daelim-React2](https://github.com/gkfg/Daelim-React2) | [ed23978](https://github.com/gkfg/Daelim-React2/commit/ed23978ddd3e01d8156e6c449c5803fe92801768) | 11/11 12:48:32 | 10/07 뒤늦은 정리, 7·9·10·11주차, 외부 컴포넌트와 Context 코드 |
| [onejae17/React2](https://github.com/onejae17/React2) | [8faf0fe](https://github.com/onejae17/React2/commit/8faf0fe2c2508ebbf1800102468503437299629b) | 11/04 12:45:10 | 7·9·10주차 상세 노트와 코드 블록 |
| [imdohyeon/React2](https://github.com/imdohyeon/React2) | [5ee790d](https://github.com/imdohyeon/React2/commit/5ee790d97c0ed3aff17e08c9bb2a636dddda525b) | 11/11 12:48:03 | 7·9·11주차, Context 코드 해설과 외부 컴포넌트 CSS |
| [umteahoon/React2](https://github.com/umteahoon/React2) | [0f3884e](https://github.com/umteahoon/React2/commit/0f3884ebfa93e47253a587b8d9099005739b8fe4) | 11/11 11:44:00 | 7·9·10·11주차, Counter·LikeButton·Interleaving·ThemeProvider 코드 |

확인된 최신 수업은 **2026-11-11 (Week 11)**이다. 10/21(Week 8)과 11/18(Week 12)은 확인한 자료에 해당 날짜의 수업 본문이 없다. 시험·휴강 여부도 추정하지 않고 날짜별 수업 항목을 추가하지 않았다.

## 2026-11-18 첨부 ZIP 확인

- 원본 파일: `nextjs_nov11_context_thirdparty_project.zip` (33,350 bytes).
- SHA-256: `38ea129ea20f60c851bc5a7b87639d5c7d580a20e5be1fb3ebd8376370dc0f18`.
- 내부 프로젝트: `nextjs_nov11_project`. Next.js 15.5.3 / React 19.1.1 기반이며 잠금 파일은 없었다.
- Context, Counter, LikeButton, Server/Client 조합, 동적 게시글, 개념 카드, 이미지 갤러리 코드가 들어 있다.
- ZIP 문서의 원본은 [lecture-materials/nov11](lecture-materials/nov11/)에 보관했다. 이 문서가 언급하는 MP4는 이번에 첨부되지 않았으므로 영상을 직접 확인하거나 음성을 검증한 것은 아니다. 문서 안의 명령·학습 과제는 자료로 읽었으며 별도의 사용자 지시로 취급하지 않았다.
- 기존 앱을 구버전으로 되돌리지 않고 `my-next-app`에 실습 소스를 통합했다. 기존 블로그·검색 매개변수·스트리밍 경로는 유지한다.

## 2026-11-18 날짜별 대조

| 수업 날짜 | 종합한 내용 | 대조한 자료 |
| --- | --- | --- |
| 11/11 · Week 11 | Context 기본값, 유니온 타입, useEffect·data-theme, 속성 선택자, ThemeStatus, Provider 위치·갱신 순서, 외부 컴포넌트 래퍼, items·CSS·export 오류 | wpexq·wlswodnjs·gkfg·imdohyeon·umteahoon, ZIP 11/11 문서·코드 |
| 11/04 · Week 10 | 서버→클라이언트 props와 직렬화, children 슬롯으로 인터리빙, Context·Props Drilling, ThemeProvider/ThemeStatus 연결 | wpexq·wlswodnjs·jinwooorp·gkfg·onejae17·umteahoon, ZIP 11/04 문서·코드 |
| 10/28 · Week 9 | 작은 Client 경계로 번들 크기 줄이기, Counter, [id]와 LikeButton, 데이터·내비게이션 연결 | 7곳 전체의 노트, wlswodnjs·gkfg·umteahoon 실행 코드, ZIP 복습 코드 |
| 10/14 · Week 7 | 서버·클라이언트 역할, count/isLiking, Falsy·??, 낙관적·비관적 업데이트, RSC·hydration·use client | 7곳 전체. jinwooorp의 10/14 커밋으로 추가된 내용은 다수 자료의 날짜와 대조 |
| 10/07 · Week 6 보충 | 네이티브 History API, params 구조 분해와 타입 표기 | gkfg의 뒤늦은 10/07 정리. 기존 6주차 본문에 보충 |

`README.md`와 `RENAME.md`에는 같은 본문을 둔다. 사용자의 제목 `202130433 최현욱 수업기록`과 기존 1~6주차 내용을 유지하며 새 수업을 최신 날짜부터 앞에 추가했다.

## 2026-11-18 코드 반영

| 현재 파일·경로 | 근거 및 통합 방식 |
| --- | --- |
| `src/components/ThemeProvider.tsx`, `ThemeStatus.tsx` | ZIP 소스를 기반으로 wlswodnjs·gkfg·umteahoon 코드와 대조. 토글에 한국어 이름·상태 제공 |
| `src/app/layout.tsx`, `globals.css` | 기존 메뉴·레이아웃을 유지하고 body 안에 Provider, 헤더에 테마 버튼. CSS 변수를 data-theme와 연결 |
| `src/components/Counter.tsx`, `src/app/counter/` | ZIP의 초기값 12와 클릭 실습을 유지 |
| `src/lib/data.ts`, `src/ui/LikeButton.tsx`, `src/app/[id]/` | ZIP의 문자열 id·초기 likes를 사용. 0 보존, 없는 글 404, 중복 클릭 방지, 타이머 정리, 글 id별 state 초기화 |
| `src/components/ClientLayout.tsx`, `ServerContent.tsx`, `src/app/interleaved/` | ZIP과 3개 저장소의 children 조합. 서버 fetch에 5초 시간 제한·응답 확인·대체 화면, server-only 표시 |
| `src/components/Carousel.tsx`, `src/app/carousel/` | ZIP의 추가 개념 카드 예제 유지. 강의 원본 외부 Carousel 구현이라고 주장하지 않음 |
| `src/components/gallery/`, `src/app/gallery/` | ZIP의 로컬 대체 캐러셀 유지. items·페이지 선택·이전/다음·빈 배열, 자동 재생 시작/정지, 배열 길이 감소 처리 |
| `src/app/page.tsx` | 새 실습 카드와 동적 게시글 목록 연결 |
| `package.json`, `package-lock.json` | Next.js·eslint-config-next·bundle-analyzer 16.4.6으로 통일. npm 잠금 파일 유지 |

캐러셀의 외부 이미지 주소와 `items` 형태는 ZIP과 같다. `next/image`에 크기와 `unoptimized`를 지정해 이 외부 샘플 이미지는 브라우저에서 직접 불러온다. 실제 `acme-carousel` 패키지는 ZIP에도 포함되지 않았으며 이번에도 설치하지 않았다. 패키지 예제는 수업 문서에, 동작 가능한 로컬 구현은 앱에 둔다.

좋아요는 실습용 로컬 상태다. 서버 저장 API나 DB를 구현한 것으로 표시하지 않으며 화면에도 새로고침 시 초기화됨을 안내한다. 새 데이터의 문자열 id를 사용해 umteahoon의 일부 숫자 id 데이터와 메뉴 href가 서로 어긋나는 문제를 가져오지 않았다.

## 2026-11-18 설명 보정

- Interleaving은 이 수업에서 서버 UI를 클라이언트의 children 슬롯에 넣는 조합이다. 통신의 오류 분산 기술 설명을 Next.js 동작 원리로 사용하지 않았다.
- `use client`의 import 경계와 서버에서 children으로 전달한 UI를 구분했다.
- Context는 그 값을 소비하는 Client Component에 전달된다. Provider 하위의 모든 Server Component가 클라이언트로 바뀐다는 설명은 제외했다.
- 렌더링·커밋 뒤 Effect가 실행되는 순서로 정리했다. `useEffect`는 서버에서 실행되지 않는다.
- 낙관적 업데이트의 rollback은 직접 구현해야 한다. 단순 지연·로컬 숫자 증가는 실제 저장 성공을 보장하지 않는다.
- RSC를 단순 JSON이나 항상 순수 바이너리라고 단정하지 않았다. Payload에 포함되는 렌더링 결과·모듈 참조·props를 설명했다.
- 로고를 Server Component로 두는 기준은 상호작용 필요 여부다. 중요도나 이미지 용량 자체가 기준이라는 설명을 수정했다.
- 외부 패키지의 `Slide` export와 CSS 경로는 첨부 문서의 예시로 구분했으며 현재 설치 API라고 단정하지 않았다.

기술 대조: 설치된 Next.js 16.4.6 동봉 문서, [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [useContext](https://react.dev/reference/react/useContext), [useEffect](https://react.dev/reference/react/useEffect).

## 2026-11-18 의존성 및 검증

기존 Next.js 16.3.8에 새 보안 공지가 확인되어 수정 버전 16.4.6으로 갱신했다. 관련 ESLint 설정과 분석 플러그인도 같은 버전으로 맞췄으며 React 19.2.8은 유지했다. 호환 범위의 `npm audit fix`를 적용했다. 운영 의존성 검사 `npm audit --omit=dev`는 **0건**이다.

전체 의존성 검사에는 **high 14건**이 남아 있다. 모두 개발 도구의 picomatch 관련 의존성 경로(ESLint, micromatch, tinyglobby 등)다. npm의 강제 수정 제안은 eslint-config-next를 이전 버전으로 되돌리므로 적용하지 않았다. 설치 중 기존 unrs-resolver의 스크립트 승인 경고가 있었으나 승인 설정을 바꾸지 않았고 린트·빌드는 통과했다.

- ESLint: 오류·경고 없이 통과.
- Next.js 16.4.6 Turbopack 프로덕션 빌드 및 TypeScript 검사: 통과.
- `ANALYZE=true` Webpack 빌드: 통과. client·nodejs·edge 분석 HTML 생성 확인. edge 번들은 없어 해당 보고서는 통계 기반 안내를 출력했다.
- 프로덕션 HTTP 34개: 기존 경로, 새 실습, 4개 동적 글, 검색 매개변수, 없는 글·중첩 경로 404 확인.
- prerender manifest: Blog3 글 4개 사전 생성, Blog2 상세의 동적 렌더링 유지 확인.
- 스트리밍: 첫 청크 약 23ms, 전체 약 2,027ms. 로컬 관찰값이다.
- JSDOM 컴포넌트 검사 26개: 테마 초기값·토글·자식 교체 후 유지, Counter, 좋아요 즉시 증가·반복 클릭 방지·재활성화·다른 글 초기화, 빈 캐러셀·이전/다음 순환·페이지 선택·자동 재생/정지·항목 감소, Gallery 열기/닫기, 개념 카드, 서버 조회 성공 및 오류 대체 화면.
- 문서 검사: 날짜 10개와 주차 매칭·최신순, README/RENAME 일치, 기존 1~6주차 본문 유지, 내부 파일 링크·UTF-8·코드 블록 확인.
- 연결된 브라우저가 없어 실제 브라우저의 hydration·화면 배치·외부 이미지 표시·키보드 탐색은 검증하지 못했다. JSDOM 검사는 실제 브라우저 시각 검증을 대신하지 않는다.

업데이트 배포본은 `nextjs_nov18_updated_project.zip`이다. 이번 커밋의 소스·날짜별 노트·자료 출처를 `React2/` 아래에 묶고, `.git`·`node_modules`·`.next`와 환경 변수 파일은 포함하지 않는다. 원래 전달받은 ZIP은 변경하지 않는다.

---

## 이전 반영 기록 (2026-10-13)

아래는 10월 13일 당시의 버전과 검사 결과다. 현재 상태는 위의 11월 18일 기록을 기준으로 한다.

확인일: **2026-10-13 (Asia/Seoul)**. 7개 저장소의 원격 기본 브랜치를 fetch해 이전 반영 커밋과 비교했다. GitHub 웹 검색 결과에는 이전 내용이 남아 있어, 최신 여부는 실제 원격 Git 커밋과 파일을 기준으로 확인했다.

## 저장소별 최신 상태

새 수업 범위는 **2026-10-07 (Week 6)**다. 가장 늦게 갱신된 문서는 wpexq의 10월 11일 커밋이지만 수업 날짜는 10월 7일이다. 10월 14일 수업은 아직 확인된 자료가 없다.

| 저장소 | 확인한 커밋 | 커밋 시각 (KST) | 이전 반영 이후 변경 |
| --- | --- | --- | --- |
| [wpexq/React2](https://github.com/wpexq/React2) | [fb552ef](https://github.com/wpexq/React2/commit/fb552ef777c80ddf613996f5e418b9d823750a52) | 10/11 16:05:26 | README에 Week 6 추가, 이전 주차는 구분선 정리 |
| [wlswodnjs/react-02](https://github.com/wlswodnjs/react-02) | [39ab8f4](https://github.com/wlswodnjs/react-02/commit/39ab8f4bfaeacc2cf6e56f689cb8fa590bdb8523) | 10/07 12:51:10 | Week 6, blog3 목록·상세·데이터, 분석 플러그인·설정·잠금 파일 |
| [jinwooorp/React2](https://github.com/jinwooorp/React2) | [a97e3ae](https://github.com/jinwooorp/React2/commit/a97e3ae2d1d91c70980e0d70392ac38ce868500c) | 10/07 13:22:09 | readme.md에 1007 수업 추가 |
| [gkfg/Daelim-React2](https://github.com/gkfg/Daelim-React2) | [852b410](https://github.com/gkfg/Daelim-React2/commit/852b4109851b5b4348e00c230acff3e32cc1f69b) | 09/30 12:42:23 | 변경 없음, 5주차까지 |
| [onejae17/React2](https://github.com/onejae17/React2) | [d600f03](https://github.com/onejae17/React2/commit/d600f03459e5c303f4d446271e47126e96f9700d) | 10/07 12:41:14 | 6주차, 정적 생성 비교, 스피너 CSS, hydration |
| [imdohyeon/React2](https://github.com/imdohyeon/React2) | [108bc5d](https://github.com/imdohyeon/React2/commit/108bc5de8624f0e84a708aa0edaabd11368fb16f) | 10/07 12:50:10 | 6주차, async·정적 생성·느린 네트워크·컴포넌트 구분 |
| [umteahoon/React2](https://github.com/umteahoon/React2) | [2a90450](https://github.com/umteahoon/React2/commit/2a90450ad1f0e30da9471dffcac27601716a676a) | 10/07 12:16:46 | Week 6 문서. 앞선 c4bddfd의 blog2·blog3·contact 코드도 이번 앱에 통합 |

## 2026-10-13 반영 파일

| 현재 파일 | 원본 및 반영 내용 |
| --- | --- |
| `RENAME.md`, `README.md` | 새 기록이 있는 6개 저장소의 10/07 수업을 같은 날짜 아래에 종합. 기존 1–5주차 본문 유지 |
| 두 문서의 제목 | 사용자 원격 커밋 50897e0의 `202130433 최현욱 수업기록` 유지·통일 |
| `src/app/blog2/[slug]/page.tsx` | umteahoon의 요청 시점 글 조회. 없는 데이터는 notFound 처리 |
| `src/app/blog2/page.tsx` | 원본 메뉴의 누락된 목록 경로를 보완. 프리페칭을 끈 링크에 이동 표시 연결 |
| `src/app/blog3/page.tsx`, `[slug]/page.tsx`, `posts.ts` | wlswodnjs의 정적 생성 예제 통합. 데이터는 기존 blog의 같은 4개 글을 공유 |
| `src/app/contact/page.tsx` | umteahoon의 contact 페이지 반영. wlswodnjs의 일반 a 이동 예제와 연결 |
| `src/app/ui/loading-indicator.tsx` | 6주차 문서의 useLinkStatus를 Link 하위 컴포넌트로 구현 |
| `src/app/ui/hover-prefetch-link.tsx` | 문서의 호버 프리페칭을 구현하고 키보드 포커스에도 적용 |
| `src/app/globals.css` | 스피너의 100ms 표시 지연, 고정 크기 영역, 동작 줄이기 설정 지원 |
| `src/app/layout.tsx`, `page.tsx` | 새 실습 메뉴와 6주차 경로 연결 |
| `next.config.ts` | wlswodnjs의 ANALYZE 설정, 자동 브라우저 열기 비활성화 |
| `package.json`, `package-lock.json` | npm 기준 analyzer 추가. Next.js 관련 패키지 16.3.8로 맞추고 호환 범위 내 의존성 수정 |
| `my-next-app/README.md` | 새 경로와 Webpack 번들 분석 실행 방법 |

이전 `/blog` 공통 레이아웃 예제는 유지했다. umteahoon의 blog3 목록은 blog2로 연결돼 있어, 정적 생성 상세 경로까지 갖춘 wlswodnjs의 blog3를 통합 기준으로 사용했다. 다른 저장소의 node_modules·pnpm 잠금 파일·개인 이름·에이전트 설정은 옮기지 않았다.

## 6주차 내용 대조와 보정

- **generateStaticParams**: umteahoon·onejae17·imdohyeon·jinwooorp의 빌드 순서와 유무 비교를 합쳤다. 반환값은 문자열 배열이 아니라 params 객체 배열이다.
- **async**: 새 기록이 있는 6개 저장소의 설명을 합쳤다. Server Component에서 사용할 수 있지만 모든 컴포넌트에 필수는 아니며 Client Component는 async 함수로 만들지 않는다.
- **느린 네트워크**: useLinkStatus는 Link 하위에서 사용하고, 미리 로드된 페이지에서는 표시가 생략될 수 있음을 명시했다.
- **프리페칭**: `prefetch={false}`와 호버 프리페칭을 구분했다. 원본의 `prefetch="{false}"` 표기는 수정했다. jinwooorp의 useEffect 반복 예제는 호버 전용이 아닌 수동 프리페칭으로 설명했다.
- **hydration**: 서버 HTML과 클라이언트 상호작용의 연결, 큰 JS의 영향을 정리했다. 분석 플러그인이 의존성을 자동 삭제한다는 식의 설명은 수정했다.
- **서버·클라이언트**: wpexq·wlswodnjs·jinwooorp·imdohyeon의 상태·이벤트·브라우저 API와 서버 조회·비밀 값 처리 기준을 종합했다.

공식 검증 자료: [useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status), [Prefetching](https://nextjs.org/docs/app/guides/prefetching), [서버·클라이언트 컴포넌트](https://nextjs.org/docs/app/getting-started/server-and-client-components), [번들 분석](https://nextjs.org/docs/app/guides/package-bundling). 설치된 Next.js 동봉 문서도 확인했다.

## 의존성 점검

기존 Next.js 16.3.5에 npm audit 보안 공지가 있어 16.3.8 패치로 갱신했다. eslint-config-next와 @next/bundle-analyzer도 같은 버전으로 맞췄다. 호환 가능한 수정은 `npm audit fix`로 적용했다.

운영 의존성 검사 `npm audit --omit=dev`는 0건이다. 전체 검사에는 ESLint의 braces → micromatch → fast-glob 의존성 경로 관련 high 5건이 남는다. npm이 제안한 강제 수정은 eslint-config-next 14.2.35로의 주요 버전 다운그레이드여서 적용하지 않았다.

## 2026-10-13 검증 결과

- ESLint: 오류·경고 없이 통과.
- Next.js 16.3.8 기본 Turbopack 빌드: TypeScript 검사 및 빌드 통과.
- `ANALYZE=true` Webpack 빌드: 통과. client·nodejs·edge HTML 분석 보고서 생성 확인. 실제 edge 번들은 없어 해당 보고서는 통계 기반 안내를 출력했다.
- 프로덕션 서버 HTTP 25개 요청: 홈·기존 경로·Blog2·Blog3의 글 4개씩·Contact·검색 매개변수 정상 응답, 각 블로그의 없는 글과 없는 일반 경로 404 확인.
- prerender manifest: Blog3의 글 4개 사전 생성과 Blog2 상세의 요청 시점 처리 확인.
- 기존 스트리밍: 약 14ms에 fallback, 약 2,017ms에 본문 도착 확인. 로컬 관찰값이다.
- 문서: 날짜 6개 내림차순, 내부 링크·코드 블록·UTF-8, README/RENAME 본문 일치, 사용자 제목 유지 확인.
- 연결된 자동화 브라우저가 없어 실제 클릭·호버·스피너의 시각적 동작은 검증하지 못했다. 관련 코드는 타입·빌드·서버 렌더링 검사까지 수행했다.

---

## 이전 반영 기록 (2026-10-07)

아래 기록은 최초 통합 시점의 내용이며, 현재 상태는 위 2026-10-13 표를 기준으로 한다.


## 날짜별 원본 대조

7개 원격 저장소를 다시 fetch하고 기본 브랜치의 README를 읽어 대조했다. `jinwooorp`의 문서 이름은 `readme.md`, 나머지는 `README.md`다. 아래 항목은 원본에 적힌 날짜를 기준으로 묶었다. 같은 날짜의 중복 설명은 합치고, 원본에 없는 개인 프로젝트용 설명은 수업 본문에서 제외했다.

| 수업 날짜 | 원본에서 확인한 내용 | 대조한 저장소 |
| --- | --- | --- |
| 09/30 · Week 5 | Server Rendering, 초기 HTML·hydration, Prefetching, Streaming, loading, 공유 레이아웃, 중단 가능한 이동, Client-side Transition, generateStaticParams, 라우터 비교, 성능 지표 | 7개 전체 |
| 09/23 · Week 4 | Link·href, 루트·중첩 레이아웃, 중첩 라우트, 문서의 예제 import 오류, slug·더미 게시글, Promise params·await, 배열 탐색, searchParams, 라우팅 방식 | 7개 전체 |
| 09/16 · Week 3 | 라우트 그룹·비공개 폴더, 병렬·가로채기 라우트, Open Graph, Colocation, 컴포넌트 계층, layout/template, src, 다중 레이아웃, 3초 지연과 loading 예제 | 7개 전체. 계층은 wlswodnjs·umteahoon, 3초 지연은 gkfg·onejae17에서 보완 |
| 09/09 · Week 2 | 수동 설치·기본 app 파일, public, 타입 패키지·scripts 오류, 개발 서버, create-next-app, 폴더·예약 파일·동적 경로, ESLint 설정, 경로 별칭, 편집기 레이블, pnpm·링크 구조 | wpexq, gkfg, onejae17, imdohyeon, umteahoon |
| 09/02 · Week 1 | Next.js·문서 구성·라우터·사전 지식·접근성, pnpm·하드 링크·심볼릭 링크, 서버·클라이언트 컴포넌트, 이미지·폰트 최적화, 배포, 설치 옵션 | onejae17, imdohyeon, umteahoon |

`RENAME.md`는 날짜 → 수업 주제 → 세부 설명·목록·예제 코드 순서다. GitHub 첫 화면에서도 같은 내용을 바로 읽을 수 있도록 루트 `README.md`에 동일한 본문을 넣었다. 현재 프로젝트의 실행 안내는 `my-next-app/README.md`에서 관리한다.

수업 본문에는 실제 자료에서 사용한 pnpm 명령과 예제 구조를 유지했다. 명백한 오타와 버전 차이(params의 Promise 전환, next lint, FID)는 잘못된 설명을 반복하지 않도록 보정했다. 원문 전체를 한 저장소에서 복제한 문서는 아니며, 같은 날짜의 내용을 종합한 정리다.

## 최신 자료 선택 방식

최초 통합 시 최신 커밋은 `umteahoon/React2`의 `94ae932`였으며, 5주차 노트를 갱신한 커밋이었다. 당시 `my-app0916/src`의 마지막 변경은 9월 23일 `62bb17d`였다. 문서 재작성 중 다시 확인한 최신 커밋은 `c4bddfd`로, 블로그·contact 관련 코드 변경이며 README 내용은 달라지지 않았다. 날짜별 정리는 이 재확인 결과까지 대조했다.

해당 저장소의 `my-app0916`은 현재 프로젝트와 Next.js·React 버전 및 `src/app` 구조가 같고, 중복 `/blog` 경로가 정리되어 있어 통합 기반으로 선택했다. 다른 저장소의 더 늦은 변경도 확인했다. `gkfg`의 9월 30일 TSX 변경은 내용이 없는 contact 파일이었고, `wlswodnjs`의 변경에는 블로그 예제 이동·삭제가 포함되어 있었다. 파일 날짜만으로 같은 경로를 덮어쓰지 않고 수업 기능과 실제 내용을 비교했다.

## 옮긴 경로와 보완 사항

아래 원본 경로는 [umteahoon/React2의 고정 스냅샷](https://github.com/umteahoon/React2/tree/94ae93200e784e367483269c8edb773baf4c733e/my-app0916/src/app)을 기준으로 한다.

| 원본 app 아래 경로 | 현재 my-next-app/src/app 아래 경로 | 반영 방식 |
| --- | --- | --- |
| `(marketing)/layout.tsx` | 동일 | 복사 후 레이아웃 단계 표시·한글 설명 정리 |
| `(marketing)/about/layout.tsx` | 동일 | 복사 후 구역 표시 정리 |
| `(marketing)/about/page.tsx` | 동일 | 복사 후 라우트 그룹 설명 보완 |
| `blog/layout.tsx` | 동일 | 복사 후 제목 링크와 접근성 이름 보완 |
| `blog/page.tsx` | 동일 | 복사 후 실제 글 목록으로 구성 |
| `blog/posts.tsx` | 동일 | 수업용 예제 데이터 유지 |
| `blog/[slug]/page.tsx` | 동일 | Promise params 유지, 정적 경로 생성·notFound 추가 |
| `products/page.tsx` | 동일 | Promise searchParams 유지, 누락·빈 값·중복 키 처리 |

5주차는 원본 문서에만 있고 실행 코드가 부족한 부분을 추가했다.

- `streaming/page.tsx`, `streaming/loading.tsx`: gkfg의 지연·loading 실습과 5주차 문서를 참고해 별도 경로로 구현했다. `connection()`과 2초 지연으로 요청 시점의 로딩을 관찰한다.
- `products/loading.tsx`: 검색 매개변수 페이지의 로딩 경계를 추가했다.
- `not-found.tsx`, `blog/[slug]/not-found.tsx`: 없는 경로와 데이터에 대한 안내를 추가했다.
- 루트 `layout.tsx`, `page.tsx`, `globals.css`: 기존 프로젝트를 바탕으로 실습 메뉴와 한국어 화면을 구성했다.
- `RENAME.md`, `README.md`: 7개 저장소를 다시 확인해 위 날짜별 대조표의 내용으로 재작성했다. 원본의 수업 명령·블로그 예제·3초 로딩 예제를 해당 날짜에 배치했다. 이전 문서의 개인 프로젝트 실습 안내는 수업 본문에서 제외했다. 기존 자료의 작성자 이름이나 학번을 본인 정보로 옮기지 않았다.

## 교차 확인하면서 바로잡은 부분

| 참고 자료에서 주의한 설명 | 이번 정리 기준 |
| --- | --- |
| layout은 정적, template은 동적 페이지용 | 공유 상태 유지와 재마운트 동작의 차이 |
| params의 Promise 전환을 14.2 이후로 설명 | 15부터 변경. 현재 16.3.5에서는 await 사용 |
| slug라는 데이터 필드가 반드시 필요 | 동적 폴더 이름은 params 키를 정함. 데이터 필드는 직접 매핑 가능 |
| await가 서버 지연 오류를 막는 용도 | Promise 결과를 얻기 위한 문법 |
| searchParams가 URLSearchParams와 같음 | 서버 페이지 prop은 일반 객체이며 반복 키는 배열 가능 |
| 동적 세그먼트는 항상 동적 렌더링 | generateStaticParams와 사용 API에 따라 사전 렌더링 가능 |
| FID를 현재 Core Web Vitals로 나열 | 현재 기준은 LCP·INP·CLS |
| 네비게이션 중단은 모든 서버 요청 취소 | 사용자는 다른 이동을 시작할 수 있지만 모든 서버 작업 취소를 보장하지 않음 |

버전 차이의 검증 기준은 설치된 Next.js 16.3.5의 공식 동봉 문서 `node_modules/next/dist/docs`와 [Next.js 공식 문서](https://nextjs.org/docs/app)이며, 웹 성능 지표는 [Web Vitals 공식 설명](https://web.dev/articles/vitals)을 확인했다. `package.json`과 `package-lock.json`은 현재 프로젝트의 버전을 유지했다.

출처를 추적할 수 있도록 원본 저장소와 커밋을 기록했다. 이 문서가 원본 코드에 새로운 라이선스를 부여하는 것은 아니다.

## 통합 후 검증

2026-10-07, Node.js 24.20.0 환경에서 확인했다.

- `npm.cmd run lint`: 통과.
- `npm.cmd run build`: TypeScript 검사 및 프로덕션 빌드 통과. 블로그 글 4개의 정적 생성 확인.
- 프로덕션 서버 HTTP 검사: 홈·소개·블로그 목록·상세 4개·검색 매개변수 페이지의 정상 응답 확인.
- 없는 slug와 없는 일반 경로: HTTP 404 확인.
- 검색 매개변수: 누락 값, 빈 문자열, 같은 키 반복, 한글 값 확인.
- 스트리밍: 로딩 문구는 약 16ms, 실제 본문은 약 2,021ms에 도착해 응답이 나뉘는 것을 확인. 이 수치는 로컬 관찰값이다.
- Markdown: 내부 파일 링크, 코드 블록 짝, 깨진 유니코드 여부 확인.
- 연결된 자동화 브라우저가 없어 시각적 화면 및 브라우저 클릭 동작 검사는 수행하지 못했다.
