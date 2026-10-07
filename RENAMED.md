# Ch-wook의 Next.js 수업 노트

> 정리 기준: 2026-10-07 · 수업 범위: 2026-09-02 ~ 2026-09-30, 1–5주차
>
> 복습 순서는 **개념 한 줄 → 내 프로젝트에서 확인 → 헷갈릴 부분**으로 잡았다.
> 참고 자료의 문장을 그대로 이어 붙이지 않고, 현재 실행되는 코드와 연결해 다시 정리했다.

## 먼저 잡을 흐름

Next.js를 공부할 때는 세 가지를 나눠 생각한다. **어떤 주소를 만들지**, **그 주소에 어떤 화면을 보여줄지**, **화면을 언제 준비할지**다.

```text
폴더와 page.tsx → URL
layout.tsx → 여러 페이지가 공유하는 화면
params / searchParams → 주소에서 읽는 값
generateStaticParams → 미리 준비할 경로
Link / loading.tsx → 이동하고 기다리는 경험
```

현재 앱은 `my-next-app`에 있다. Next.js **16.3.5**, React **19.2.8**, TypeScript, Tailwind CSS 4, App Router를 사용한다. 패키지 설치 기준은 `package-lock.json`이며 npm으로 실행한다. 다른 저장소의 pnpm 잠금 파일을 함께 섞지 않았다.

## 1주차 · 09/02 · 개발 환경과 Next.js

### 개념 한 줄

React로 화면을 만들고, Next.js로 라우팅과 서버 렌더링 같은 애플리케이션 구조를 함께 구성한다.

React 자체가 특정 라우터를 정해 주지는 않는다. Next.js의 App Router는 `src/app`의 파일과 폴더로 주소를 정의한다. Pages Router의 `pages/about.tsx`와 App Router의 `app/about/page.tsx`는 둘 다 `/about`에 대응하지만, 파일 규칙과 데이터 처리 방식은 다르다. 이 프로젝트에서는 App Router 규칙으로 통일한다.

### 내 프로젝트에서 확인

```powershell
cd my-next-app
npm.cmd ci
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 연다. 처음 받을 때는 `npm.cmd ci`로 잠금 파일에 맞게 설치하고, 다음부터는 개발 서버를 실행하면 된다. 서버 종료는 `Ctrl+C`다.

### 헷갈릴 부분

- `npm run dev`는 개발용, `npm run build`는 배포용 빌드, `npm run start`는 빌드 결과 실행이다.
- pnpm도 패키지 관리자지만, 현재 프로젝트는 npm으로 맞춘다. 패키지 관리자를 바꾸는 것과 수업 코드를 옮기는 것은 별개의 작업이다.
- 하드 링크는 같은 파일 데이터에 대한 다른 이름이고, 심볼릭 링크는 다른 경로를 가리키는 링크다. 실제 pnpm 저장 방식은 버전과 설정에 따라 달라질 수 있다.
- 접근성은 처음부터 챙긴다. 이 앱은 `lang="ko"`, 메뉴 이름, 키보드 포커스, 본문 바로가기 링크를 둔다.

## 2주차 · 09/09 · 폴더와 파일을 주소로 읽기

### 개념 한 줄

폴더는 주소의 구간을 만들고, 예약된 파일 이름은 그 구간의 역할을 정한다.

| 위치 또는 이름 | 역할 | 기억할 점 |
| --- | --- | --- |
| `page.tsx` | 해당 주소의 화면 | 컴포넌트를 기본 내보내기한다 |
| `layout.tsx` | 하위 페이지를 감싸는 공통 UI | `children` 자리에 하위 화면이 들어간다 |
| `loading.tsx` | 준비 중인 화면 | 같은 구간의 페이지와 그 아래를 Suspense로 감싼다 |
| `not-found.tsx` | 없는 경로·데이터 안내 | `notFound()`와 연결할 수 있다 |
| `error.tsx` | 구간의 런타임 오류 처리 | Client Component로 작성한다 |
| `global-error.tsx` | 루트 수준 오류 처리 | 자체 `html`, `body`가 필요하다 |
| `template.tsx` | 이동 시 새 인스턴스를 만드는 틀 | 상태 초기화가 필요할 때 검토한다 |
| `route.ts` | HTTP 요청 처리 | 화면용 `page.tsx`와 구분한다 |
| `default.tsx` | 병렬 라우트 슬롯의 기본 화면 | 슬롯 상태를 복구할 수 없을 때 사용한다 |

### 내 프로젝트에서 확인

| 파일 | 브라우저 주소 |
| --- | --- |
| `src/app/page.tsx` | `/` |
| `src/app/blog/page.tsx` | `/blog` |
| `src/app/blog/[slug]/page.tsx` | `/blog/nextjs` 등 |
| `src/app/(marketing)/about/page.tsx` | `/about` |

### 헷갈릴 부분

`[slug]`는 동적 세그먼트다. `[...slug]`는 하나 이상의 구간, `[[...slug]]`는 구간이 없는 경우까지 포함하는 선택적 catch-all이다. `(marketing)`처럼 괄호로 감싼 그룹은 URL에서 빠진다. `_components`처럼 밑줄로 시작하는 폴더는 라우팅에서 제외된다.

`app` 안에 파일이 있다고 전부 공개 URL이 되는 것은 아니다. 예를 들어 `blog/posts.tsx`는 페이지 옆에 둔 데이터 파일이다. 이렇게 관련 파일을 가까이 두는 구성을 colocation이라고 부른다. 비공개 폴더는 라우팅 규칙이며, 비밀 값을 보호하는 보안 장치는 아니다.

`@slot`은 병렬 라우트 슬롯, `(.)`·`(..)` 등은 가로채기 라우트 규칙이다. 이번 앱은 기본 라우팅 복습에 집중하고 이 두 기능은 구현하지 않았다.

## 3주차 · 09/16 · 레이아웃과 프로젝트 구성

### 개념 한 줄

페이지가 바뀌어도 남아 있어야 할 UI는 공통 레이아웃에 둔다.

### 내 프로젝트에서 확인

`/about`을 열면 아래 순서로 화면이 감싸진다.

```text
src/app/layout.tsx                         Root: 전체 메뉴
└─ src/app/(marketing)/layout.tsx          Marketing: 그룹 테두리
   └─ src/app/(marketing)/about/layout.tsx About: 안쪽 테두리
      └─ page.tsx                         소개 본문
```

루트 레이아웃에는 `<html>`과 `<body>`가 있다. 하위 레이아웃은 필요한 UI와 `children`만 둔다. 컴포넌트의 함수 이름보다 파일의 위치와 기본 내보내기가 라우팅 규칙에 중요하다.

### 헷갈릴 부분

| 비교 | `layout.tsx` | `template.tsx` |
| --- | --- | --- |
| 이동 시 기준 | 공유되는 레이아웃을 유지 | 해당 템플릿의 키가 바뀌는 이동에서 새로 마운트 |
| 내부 클라이언트 상태 | 공유 부분의 상태를 유지할 수 있음 | 새로 마운트되는 부분은 초기화 |
| 예시 | 메뉴, 사이드바 | 진입 때 초기화해야 하는 폼 등 |

정적 페이지라서 layout, 동적 페이지라서 template을 고르는 것은 아니다. **상태와 인스턴스를 유지할지**가 기준이다.

라우트 그룹은 URL에서 제외되므로 `app/blog/page.tsx`와 `app/(marketing)/blog/page.tsx`를 함께 두면 `/blog`가 충돌한다. 현재 프로젝트는 `/blog`를 한 곳에만 둔다.

Open Graph는 링크를 공유할 때 제목·설명·이미지를 전달하는 메타데이터다. App Router에서는 `metadata`의 `openGraph` 항목이나 전용 이미지 파일로 관리할 수 있다. 현재 루트에는 기본 제목과 설명을 넣었고, 공유용 OG 이미지는 추가하지 않았다.

## 4주차 · 09/23 · Link, slug, 검색 매개변수

### 개념 한 줄

`params`는 주소 경로에서, `searchParams`는 물음표 뒤에서 값을 읽는다.

| 구분 | URL 예시 | 읽는 값 | 현재 파일 |
| --- | --- | --- | --- |
| `params` | `/blog/nextjs` | `slug: "nextjs"` | `blog/[slug]/page.tsx` |
| `searchParams` | `/products?id=1&name=keyboard` | `id`, `name` | `products/page.tsx` |

### 내 프로젝트에서 확인

```tsx
// src/app/blog/[slug]/page.tsx의 핵심 흐름
const { slug } = await params;
const post = posts.find((post) => post.slug === slug);
if (!post) notFound();
```

Next.js 15부터 `params`와 `searchParams`가 Promise 방식으로 바뀌었다. 이 프로젝트에서도 `Promise<...>`로 타입을 지정하고 `await`한 뒤 읽는다. `await`는 임의로 시간을 늦추는 장치가 아니라 Promise의 결과를 얻는 문법이다.

`[slug]`의 폴더 이름은 Next.js가 제공하는 **params의 키**를 정한다. 데이터베이스 필드명까지 반드시 `slug`여야 하는 것은 아니다. `[id]`를 만들고 그 값으로 다른 이름의 필드를 검색해도 된다.

페이지 사이 이동은 다음과 같이 작성한다.

```tsx
import Link from "next/link";

<Link href="/blog">블로그</Link>
<Link href={{ pathname: "/products", query: { id: "2", name: "마우스" } }}>
  마우스
</Link>
```

`Link`는 `<a>`의 기능에 Next.js의 페이지 전환과 프리페칭을 더한 컴포넌트다. 이 앱은 내부 이동에 `Link`를 사용한다.

### 헷갈릴 부분

- `/products`처럼 값이 없거나 빈 문자열이면 화면에 `미입력`으로 표시한다.
- `?id=1&id=2`처럼 키가 반복되면 값은 배열일 수 있다. 현재 실습은 첫 번째 값을 사용한다.
- 서버 페이지의 `searchParams`는 일반 객체다. `URLSearchParams` 인스턴스와 같지 않다.
- 이 앱의 `/products`는 요청의 검색 매개변수를 읽기 때문에 요청 시점에 렌더링된다.
- 클라이언트에서 검색 매개변수를 읽는 도구는 `useSearchParams`다. 이번 예제는 서버 페이지에서 처리하므로 필요하지 않다.
- 문서 예제의 `@/lib/posts`가 내 프로젝트에 없다면 직접 파일을 만들거나 실제 파일 경로로 바꿔야 한다. 여기서는 `blog/posts.tsx`를 가져온다.

## 5주차 · 09/30 · 화면을 준비하는 시점과 페이지 전환

### 개념 한 줄

미리 만들 수 있는 화면은 준비해 두고, 기다려야 하는 화면은 기다리는 상태부터 보여준다.

| 개념 | 기억할 기준 | 현재 예제 |
| --- | --- | --- |
| 정적 사전 렌더링 | 요청 전에 결과 준비 | 블로그 글 4개 |
| 동적 렌더링 | 요청이 들어온 뒤 값에 따라 준비 | `/products`, `/streaming` |
| 프리페칭 | 클릭하기 전에 이동에 필요한 결과를 가져오기 | 기본 `Link` |
| 스트리밍 | 준비된 UI를 먼저 보내고 나머지는 나중에 채우기 | `/streaming`의 로딩 화면 |
| 클라이언트 측 전환 | 공통 UI를 유지하며 경로 화면 교체 | 메뉴와 블로그 링크 |

처음 방문할 때는 서버가 준비한 HTML을 보여줄 수 있고, 상호작용이 필요한 클라이언트 컴포넌트는 hydration으로 연결된다. Server Component라는 분류와 정적·동적 렌더링 시점은 서로 다른 기준이다.

### 내 프로젝트에서 확인 · 정적 경로

```tsx
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
```

`generateStaticParams`는 미리 만들 경로에 필요한 매개변수 객체 배열을 반환한다. 현재는 `nextjs`, `routing`, `ssr-ssg`, `dynamic-routes` 네 글을 빌드할 때 준비한다. `dynamicParams = false`는 이 목록에 없는 slug를 허용하지 않는다는 뜻이다.

동적 **세그먼트**가 있다고 무조건 매 요청마다 동적 **렌더링**을 하는 것은 아니다. 반대로 `generateStaticParams`를 적었다고 요청 전용 데이터까지 전부 정적으로 바뀌는 것도 아니다. 사용하는 API와 설정을 함께 봐야 한다.

### 내 프로젝트에서 확인 · 스트리밍

`streaming/loading.tsx`는 기다리는 화면, `streaming/page.tsx`는 준비가 끝난 화면이다. `connection()` 뒤의 2초 지연은 로딩을 관찰하려고 추가한 수업용 코드다. 홈과 메뉴의 스트리밍 링크에는 `prefetch={false}`를 적용해 클릭 전에 본문이 준비되는 상황을 줄였다.

1. 홈에서 스트리밍 실습을 연다.
2. 본문을 준비한다는 메시지가 먼저 보이는지 확인한다.
3. 약 2초 뒤 실제 본문으로 바뀌는지 본다.
4. 다시 열고 로딩 중에 다른 메뉴를 눌러 이동해 본다.

응답이 빠르거나 이미 캐시된 경우 로딩 UI가 눈에 띄지 않을 수 있다. 기본 `Link`의 자동 프리페칭은 프로덕션 모드에서 확인한다. 개발 모드만 보고 동작 여부를 단정하지 않는다.

### 헷갈릴 부분

- 공유 레이아웃은 전환 중 사용할 수 있다. 페이지의 모든 state가 항상 유지된다는 뜻은 아니다.
- 다른 경로로 이동을 바꿀 수 있어도 이미 서버에서 시작한 모든 작업이 취소된다고 보장하지 않는다.
- `loading.tsx`는 같은 구간의 layout 자체를 감싸지 않는다. layout에서 오래 기다리면 페이지의 로딩 UI만으로 해결되지 않을 수 있다.
- 현재 설정에서 정적 경로는 전체 프리페칭, 요청 시점 경로는 건너뛰거나 로딩 경계까지 부분 프리페칭할 수 있다. 캐시·프리페칭 설정을 바꾸면 동작도 다시 확인한다.
- 성능 지표는 구분해서 적는다. 현재 Core Web Vitals는 **LCP, INP, CLS**이며 FID는 INP로 대체됐다. TTFB·FCP 등도 유용하지만 같은 지표 목록은 아니다. [Web Vitals 공식 설명](https://web.dev/articles/vitals)

## 직접 복습할 목록

| 실행 | 확인할 내용 |
| --- | --- |
| `/about` | 주소에는 marketing이 없고, 레이아웃은 3단계로 보이는가? |
| `/blog` → 글 선택 | slug에 맞는 제목과 본문이 나타나는가? |
| `/blog/not-a-post` | 없는 글을 정상 글처럼 보여주지 않는가? |
| `/products?id=1&name=keyboard` | id와 name이 따로 표시되는가? |
| `/products?id=1&id=2` | 첫 번째 값 1을 사용하는가? |
| `/products` | 누락 값이 미입력으로 표시되는가? |
| `/streaming` | 준비 중 화면 뒤에 본문이 나타나는가? |

```powershell
cd my-next-app
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

빌드 출력에서 블로그 상세 경로의 사전 생성과 `/products`, `/streaming`의 요청 시점 렌더링을 비교한다. `next build`와 ESLint 검사는 별도 명령이므로 둘 다 실행한다.

## 자료를 정리한 기준

참고한 7개 저장소의 최신 커밋·수업 날짜·반영 경로는 [자료 비교 기록](docs/SOURCES.md)에 남겼다. 가장 최근 커밋은 10월 7일이지만, 그 커밋이 정리한 수업은 9월 30일 5주차다. 날짜를 구분하고 확인되지 않은 6주차 내용을 덧붙이지 않았다.

설명이 엇갈린 부분은 설치된 Next.js의 `node_modules/next/dist/docs`와 공식 문서를 기준으로 다시 확인했다.

- [파일과 폴더 구성](https://nextjs.org/docs/app/getting-started/project-structure)
- [페이지와 레이아웃](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [page의 params·searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page)
- [링크와 내비게이션](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [loading 규칙](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [connection](https://nextjs.org/docs/app/api-reference/functions/connection)

다음 수업도 날짜, 한 줄 개념, 실제 파일, 확인 방법, 수정할 오해를 같은 순서로 이어서 적는다.
