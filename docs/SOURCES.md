# 수업 자료 비교 및 반영 기록

확인일: **2026-10-07 (Asia/Seoul)**. 사용자가 제공한 7개 저장소의 기본 브랜치를 가져와 커밋과 파일을 비교했다. 한 링크에 붙어 있던 `gkfg/Daelim-React2`와 `onejae17/React2`는 별도 저장소로 분리했다.

## 저장소별 최신 상태

모든 자료의 가장 최근 수업 범위는 **2026-09-30, 5주차**다. 아래 시각은 한국 시간이며 커밋 날짜와 실제 수업 날짜는 구분한다.

| 저장소 | 최신 커밋 | 커밋 시각 (KST) | 확인 및 활용 |
| --- | --- | --- | --- |
| [wpexq/React2](https://github.com/wpexq/React2) | [41f59a9](https://github.com/wpexq/React2/commit/41f59a99f506d4eb84a914e896d2fb4dc0884947) | 10/04 18:42:15 | 5주차 내비게이션·프리페칭 정리 비교 |
| [wlswodnjs/react-02](https://github.com/wlswodnjs/react-02) | [4dce7bb](https://github.com/wlswodnjs/react-02/commit/4dce7bb2c20c25e12be81e846bd19d752bfbdca5) | 09/30 12:49:59 | 라우팅 구조와 스트리밍 설명 비교 |
| [jinwooorp/React2](https://github.com/jinwooorp/React2) | [16852c9](https://github.com/jinwooorp/React2/commit/16852c943cce74b11fd6281827106fcf2844e267) | 09/30 12:53:00 | 블로그·상품 예제 및 레이아웃 설명 비교 |
| [gkfg/Daelim-React2](https://github.com/gkfg/Daelim-React2) | [852b410](https://github.com/gkfg/Daelim-React2/commit/852b4109851b5b4348e00c230acff3e32cc1f69b) | 09/30 12:42:23 | 지연·loading 예제를 스트리밍 실습에 반영 |
| [onejae17/React2](https://github.com/onejae17/React2) | [178ba76](https://github.com/onejae17/React2/commit/178ba768a09151cb9f240e8c7434d69b680664b6) | 09/30 12:49:15 | README만 있는 저장소. 라우터·주차별 개념 비교 |
| [imdohyeon/React2](https://github.com/imdohyeon/React2) | [a271038](https://github.com/imdohyeon/React2/commit/a271038cb0458eff7c2708c726144f621f0a64ce) | 10/05 16:00:53 | 1–5주차 목차와 정적 경로 생성 설명 보완 |
| [umteahoon/React2](https://github.com/umteahoon/React2) | [c4bddfd](https://github.com/umteahoon/React2/commit/c4bddfd39735f22c433b9d31fbe4db62889d2934) | **10/07 10:40:30** | 재확인한 최신 커밋. README 내용은 94ae932의 5주차 기록과 동일 |

## 날짜별 원본 대조

7개 원격 저장소를 다시 fetch하고 기본 브랜치의 README를 읽어 대조했다. `jinwooorp`의 문서 이름은 `readme.md`, 나머지는 `README.md`다. 아래 항목은 원본에 적힌 날짜를 기준으로 묶었다. 같은 날짜의 중복 설명은 합치고, 원본에 없는 개인 프로젝트용 설명은 수업 본문에서 제외했다.

| 수업 날짜 | 원본에서 확인한 내용 | 대조한 저장소 |
| --- | --- | --- |
| 09/30 · Week 5 | Server Rendering, 초기 HTML·hydration, Prefetching, Streaming, loading, 공유 레이아웃, 중단 가능한 이동, Client-side Transition, generateStaticParams, 라우터 비교, 성능 지표 | 7개 전체 |
| 09/23 · Week 4 | Link·href, 루트·중첩 레이아웃, 중첩 라우트, 문서의 예제 import 오류, slug·더미 게시글, Promise params·await, 배열 탐색, searchParams, 라우팅 방식 | 7개 전체 |
| 09/16 · Week 3 | 라우트 그룹·비공개 폴더, 병렬·가로채기 라우트, Open Graph, Colocation, 컴포넌트 계층, layout/template, src, 다중 레이아웃, 3초 지연과 loading 예제 | 7개 전체. 계층은 wlswodnjs·umteahoon, 3초 지연은 gkfg·onejae17에서 보완 |
| 09/09 · Week 2 | 수동 설치·기본 app 파일, public, 타입 패키지·scripts 오류, 개발 서버, create-next-app, 폴더·예약 파일·동적 경로, ESLint 설정, 경로 별칭, 편집기 레이블, pnpm·링크 구조 | wpexq, gkfg, onejae17, imdohyeon, umteahoon |
| 09/02 · Week 1 | Next.js·문서 구성·라우터·사전 지식·접근성, pnpm·하드 링크·심볼릭 링크, 서버·클라이언트 컴포넌트, 이미지·폰트 최적화, 배포, 설치 옵션 | onejae17, imdohyeon, umteahoon |

`RENAMED.md`는 날짜 → 수업 주제 → 세부 설명·목록·예제 코드 순서다. GitHub 첫 화면에서도 같은 내용을 바로 읽을 수 있도록 루트 `README.md`에 동일한 본문을 넣었다. 현재 프로젝트의 실행 안내는 `my-next-app/README.md`에서 관리한다.

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
- `RENAMED.md`, `README.md`: 7개 저장소를 다시 확인해 위 날짜별 대조표의 내용으로 재작성했다. 원본의 수업 명령·블로그 예제·3초 로딩 예제를 해당 날짜에 배치했다. 이전 문서의 개인 프로젝트 실습 안내는 수업 본문에서 제외했다. 기존 자료의 작성자 이름이나 학번을 본인 정보로 옮기지 않았다.

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
