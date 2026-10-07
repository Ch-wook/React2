# 202130433 최현욱 수업기록

---

## 2026-09-30 (Week 5)

### 1. How Navigation Works

Next.js의 네비게이션은 다음 네 가지 기능이 함께 동작하는 구조다.

- Server Rendering
- Prefetching
- Streaming
- Client-side Transition

---

#### 1.1 Server Rendering

App Router의 `layout`과 `page`는 기본적으로 React Server Component다. 서버에서 만든 RSC Payload를 클라이언트에 전달하며, 화면을 준비하는 시점에 따라 렌더링 방식을 구분한다.

- **Static Rendering**: 빌드 또는 재검증 과정에서 결과를 준비해 캐시한다.
- **Dynamic Rendering**: 요청이 들어오면 해당 요청에 맞춰 결과를 만든다.

서버에서 화면을 준비하는 동안 새 경로의 표시가 늦어질 수 있다. Next.js는 프리페칭과 클라이언트 측 전환을 함께 사용해 이 대기를 줄인다.

##### Initial Visit

CSR만 사용하는 앱에서는 브라우저가 JavaScript를 실행한 뒤 본문을 구성한다. Next.js는 첫 방문에 HTML도 제공하므로 JavaScript가 모두 실행되기 전부터 내용을 표시할 수 있다.

이후 hydration을 통해 클라이언트 컴포넌트의 상호작용이 연결된다. 초기 콘텐츠 표시와 검색 엔진의 내용 확인에 도움이 된다.

---

#### 1.2 Prefetching

사용자가 이동할 가능성이 있는 경로를 미리 가져오는 작업이다. 링크를 누를 때 필요한 결과가 준비되어 있으면 더 빠르게 페이지를 전환할 수 있다.

```tsx
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/blog">Blog</Link>
      <a href="/contact">Contact</a>
    </nav>
  );
}
```

- `Link`: Next.js의 프리페칭과 클라이언트 측 전환을 지원한다.
- `a`: 일반 링크이며 Next.js의 자동 프리페칭을 제공하지 않는다.
- 정적 경로는 전체 경로를 미리 가져올 수 있다.
- 동적 경로는 프리페칭을 생략하거나 `loading.tsx`가 있으면 일부를 가져올 수 있다.

방문하지 않을 동적 경로까지 모두 처리하지 않도록 서버 작업량을 줄이는 방식이다. 자동 프리페칭은 프로덕션 환경에서 확인한다.

---

#### 1.3 Streaming

스트리밍은 전체 작업이 끝날 때까지 기다리지 않고 먼저 준비된 UI를 보내는 방식이다. 일부 데이터가 늦게 준비되어도 공통 화면이나 로딩 UI를 먼저 사용할 수 있다.

동적 경로에서 먼저 전달할 수 있는 요소는 다음과 같다.

- 공유 레이아웃
- 로딩 안내
- 콘텐츠 형태를 미리 보여주는 스켈레톤

##### loading.tsx

```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

라우트 폴더에 `loading.tsx`를 만들면 Next.js가 페이지와 그 아래의 콘텐츠를 Suspense 경계로 처리한다. 준비가 끝나면 로딩 UI를 실제 내용으로 교체한다. 화면 일부에만 적용하려면 직접 `<Suspense>`를 사용할 수도 있다.

##### Shared Layouts / Interruptible Navigation

- 새 페이지가 준비되는 동안 공유 레이아웃을 유지한다.
- 메뉴나 사이드바 등 공유 UI를 계속 사용할 수 있다.
- 로딩이 끝나기 전 다른 경로로 이동할 수 있다.
- 이동을 바꾸는 것과 서버에서 이미 시작한 모든 작업을 취소하는 것은 구분한다.

##### 웹 성능 지표

| 지표 | 의미 |
| --- | --- |
| TTFB | 요청 후 첫 응답 바이트까지 걸리는 시간 |
| FCP | 첫 콘텐츠가 화면에 표시되는 시점 |
| TTI | 상호작용 가능한 시점을 설명하는 기존 성능 지표 |
| LCP | 가장 큰 콘텐츠가 화면에 표시되는 시점 |
| CLS | 예상치 못한 레이아웃 이동 정도 |
| INP | 사용자 입력에 화면이 반응하는 지연 |

수업 자료에 등장하는 FID는 첫 입력의 응답 지연을 측정한 지표다. 현재 Core Web Vitals에서는 FID 대신 INP를 사용하며, LCP·INP·CLS를 함께 본다.

---

#### 1.4 Client-side Transition

일반적인 문서 이동에서는 페이지 전체를 새로 불러오므로 기존 화면의 상태가 초기화될 수 있다. Next.js의 `Link`는 공유 UI를 유지하고 바뀐 경로에 필요한 화면을 갱신한다.

- 공유 레이아웃과 메뉴 유지
- 미리 받아 둔 페이지 또는 로딩 UI 표시
- 준비된 콘텐츠로 화면 교체

서버 렌더링을 사용하면서도 SPA와 같은 자연스러운 이동 경험을 제공할 수 있다. 다만 모든 페이지의 상태나 스크롤을 항상 보존한다는 뜻은 아니다.

---

### 2. 전환을 느리게 만드는 요인

#### 2.1 loading.tsx가 없는 동적 경로

요청 시점에 렌더링하는 경로는 서버 응답이 도착하기 전까지 변화가 없어 보일 수 있다. `loading.tsx`를 추가하면 로딩 상태를 먼저 표시하고 부분 프리페칭을 활용할 수 있다.

공유 레이아웃을 유지하면서 준비 중임을 알려 주는 것이 핵심이다.

#### 2.2 generateStaticParams가 없는 동적 세그먼트

블로그 글처럼 주소 값을 미리 알 수 있는 데이터는 `generateStaticParams`로 빌드할 경로를 지정한다.

```tsx
import { posts } from "../posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

반환값은 slug 문자열 배열이 아니라 `{ slug: 값 }` 형태의 객체 배열이다. 동적 세그먼트라도 사전 생성할 수 있으며, 요청 정보가 필요한 경우에는 사용하는 API와 설정에 따라 동적 렌더링한다.

---

### 3. Route 방식 비교

| 구분 | React의 일반적인 라우팅 구성 | Next.js |
| --- | --- | --- |
| 경로 정의 | 라우터 라이브러리 등으로 직접 구성 | 폴더와 파일로 정의 |
| 예시 | 경로와 컴포넌트를 코드로 연결 | `app/about/page.tsx` → `/about` |

| 구분 | Pages Router | App Router |
| --- | --- | --- |
| 기준 폴더 | `pages` | `app` |
| 페이지 예시 | `pages/about.tsx` | `app/about/page.tsx` |
| 주요 기능 | `getStaticProps` 등 | 중첩 레이아웃, 서버 컴포넌트, 로딩·에러 UI, 병렬 라우트 |

수업은 App Router를 기준으로 진행한다. 기존 Pages Router 프로젝트는 해당 방식의 문서와 API를 구분해서 읽는다.

---

## 2026-09-23 (Week 4)

### 1. Link Component

`Link`는 HTML 링크를 확장해 페이지 전환과 프리페칭을 제공한다. `next/link`에서 가져오며 `href`로 이동할 위치를 지정한다.

```tsx
import Link from "next/link";

export default function Page() {
  return <Link href="/blog">Blog</Link>;
}
```

#### 1.1 href

문자열 경로뿐 아니라 경로와 쿼리를 분리한 객체도 전달할 수 있다.

```tsx
<Link href="/products?id=1&name=keyboard">상품</Link>

<Link href={{ pathname: "/products", query: { id: "1", name: "keyboard" } }}>
  상품
</Link>
```

---

### 2. Creating a Layout

루트 레이아웃은 전체 화면을 감싸며 `html`, `body`를 포함한다. `children`에는 해당 경로의 페이지나 중첩 레이아웃이 들어간다.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header>Root Layout Header</header>
        <main>{children}</main>
        <footer>Root Layout Footer</footer>
      </body>
    </html>
  );
}
```

하위 경로의 레이아웃은 필요할 때 추가한다. 루트에 쓰는 `RootLayout`이라는 함수 이름 자체가 필수 규칙인 것은 아니다.

---

### 3. Creating a Nested Route

중첩 라우트는 여러 URL 구간으로 구성된 경로다. 폴더를 중첩해 주소 구조를 만들고 `page.tsx`로 해당 위치의 화면을 정의한다.

```text
app/
├─ layout.tsx
├─ page.tsx                 → /
└─ blog/
   ├─ layout.tsx           → 블로그 공통 영역
   ├─ page.tsx             → /blog
   ├─ posts.tsx            → 예제 데이터
   └─ [slug]/
      └─ page.tsx          → /blog/nextjs 등
```

`blog/layout.tsx`는 목록 페이지와 글 상세 페이지를 함께 감싼다.

#### 3.1 문서의 예제를 복사했을 때 발생하는 오류

공식 문서의 `@/lib/posts`, `@/ui/post`는 예제에서 가정한 파일이다. 실제 프로젝트에 없다면 import 오류가 난다. 우선 정적인 목록을 작성하거나 필요한 데이터와 컴포넌트 파일을 만들어야 한다.

```tsx
export default function BlogPage() {
  return (
    <ul>
      <li>Post 1</li>
      <li>Post 2</li>
      <li>Post 3</li>
    </ul>
  );
}
```

---

### 4. Dynamic Segments와 slug

폴더 이름을 `[slug]`처럼 대괄호로 감싸면 URL에서 해당 위치의 값을 전달받는다. slug는 페이지를 식별하기 위한 읽기 쉬운 문자열이다.

- `/blog/nextjs` → `params.slug`는 `nextjs`
- `/blog/routing` → `params.slug`는 `routing`
- `[id]`로 만들었다면 `params.id`로 접근

동적 폴더명은 params의 키를 결정한다. 데이터의 필드 이름은 조회 코드에서 연결할 수 있다.

#### 4.1 게시글 데이터와 상세 페이지

```tsx
// app/blog/posts.tsx
export const posts = [
  { slug: "nextjs", title: "Next.js 소개", content: "React 기반 프레임워크" },
  { slug: "routing", title: "App Router", content: "파일과 폴더 기반 라우팅" },
];
```

```tsx
// app/blog/[slug]/page.tsx
import { posts } from "../posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) return <h1>게시글을 찾을 수 없습니다</h1>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

#### 4.2 params와 async / await

Next.js 15부터 params가 Promise로 제공된다. 바로 `params.slug`를 읽으면 버전에 따라 비동기 접근 관련 오류가 발생하므로 `await params`로 값을 얻는다.

- `async`: 함수 안에서 await를 사용하도록 선언한다.
- `{ params }`: props 중 params만 구조 분해해 받는다.
- `Promise<{ slug: string }>`: 비동기 결과의 형태를 지정한다.
- `.find()`: 배열에서 slug와 일치하는 항목을 찾는다.

`.find()`는 데이터 수에 비례해 탐색하는 O(n) 방식이다. 작은 더미 데이터에서는 간단하며, 데이터가 커지면 DB 조회 등으로 필요한 항목을 가져오는 방법을 검토한다.

---

### 5. Rendering with Search Params

쿼리 문자열은 `?` 뒤에 오는 검색 조건이다. 필터링이나 페이지 번호처럼 같은 경로에서 다른 결과를 보여줄 때 사용한다.

```text
/products?id=1&name=keyboard
/products?category=shoes&page=2
```

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id = "non id", name = "non name" } = await searchParams;

  return (
    <div>
      <p>id: {id}</p>
      <p>name: {name}</p>
    </div>
  );
}
```

| 방식 | 사용하는 상황 |
| --- | --- |
| 서버 페이지의 `searchParams` | 조회·필터·페이지네이션에 검색 조건이 필요할 때 |
| `useSearchParams` | 클라이언트 컴포넌트에서 쿼리를 읽을 때 |
| `new URLSearchParams(window.location.search)` | 브라우저 이벤트나 콜백에서 현재 값을 읽을 때 |

`params`는 경로의 동적 구간, `searchParams`는 쿼리 문자열을 읽는다. 서버 페이지의 searchParams는 일반 객체이며, 요청에 따라 달라지므로 이를 읽는 부분은 요청 시점의 처리가 필요하다.

### 6. Route 방식

React에서는 라우터 라이브러리 등으로 경로를 구성하고, Next.js에서는 파일 기반 라우팅을 사용한다. App Router는 중첩 레이아웃과 서버 컴포넌트, 구간별 로딩·에러 UI를 함께 구성할 수 있다. 이 비교는 다음 주차의 네비게이션 동작으로 이어진다.

---

## 2026-09-16 (Week 3)

### 1. Folder and File Conventions

#### 1.1 Route Groups / Private Folders

- `(group)`: URL을 바꾸지 않고 폴더와 레이아웃을 묶는다.
- `_folder`: 해당 폴더와 하위 폴더를 라우팅에서 제외한다.
- 일반 폴더도 page나 route 파일이 없으면 그 자체로 공개 경로를 만들지 않는다.

`app/(marketing)/about/page.tsx`의 주소는 `/about`이다. 그룹 이름이 빠지기 때문에 다른 위치에 같은 `/about` 경로를 중복해서 만들지 않도록 주의한다.

#### 1.2 Parallel / Intercepting Routes

여러 슬롯을 가진 화면이나 목록 위에 상세 모달을 여는 UI에 활용한다.

| 표기 | 의미 |
| --- | --- |
| `@folder` | 부모 레이아웃에서 표시하는 이름 있는 슬롯 |
| `(.)folder` | 같은 레벨의 경로 가로채기 |
| `(..)folder` | 한 단계 위의 경로 가로채기 |
| `(..)(..)folder` | 두 단계 위의 경로 가로채기 |
| `(...)folder` | app 루트 기준 경로 가로채기 |

가로채기 라우트는 현재 화면의 맥락 안에서 다른 경로의 내용을 표시하는 데 사용한다.

---

### 2. Open Graph Protocol

링크 공유 시 미리보기 제목·설명·이미지 등을 전달하는 규칙이다. Facebook에서 시작해 여러 SNS와 메신저에서 사용하지만 플랫폼마다 표시 방식은 다를 수 있다.

```html
<meta property="og:title" content="Next.js 수업 정리" />
<meta property="og:description" content="라우팅과 레이아웃 학습 기록" />
<meta property="og:type" content="website" />
```

- `og:title`: 제목
- `og:description`: 설명
- `og:image`: 미리보기 이미지 주소
- `og:url`: 페이지 주소
- `og:type`: 콘텐츠 유형

---

### 3. Organizing Your Project

UI 로직과 라우팅 로직을 구분하고, 관련 파일을 일관된 기준으로 배치한다. 라우팅 규칙을 지키면서 컴포넌트나 데이터 파일은 app 안팎으로 구성할 수 있다.

#### 3.1 Colocation

함께 사용하는 파일을 같은 기능 폴더 가까이에 두는 방식이다. 예를 들어 블로그 페이지와 게시글 데이터를 같은 폴더에 두면 관련 내용을 찾기 쉽다.

#### 3.2 Component Hierarchy

수업에서 다룬 특수 파일의 기본 계층은 다음과 같다.

```text
layout
└─ template
   └─ error 경계
      └─ loading 경계
         └─ not-found 경계
            └─ page 또는 하위 layout
```

각 경계는 해당 상태일 때 대체 UI를 표시한다. 중첩 라우트에도 같은 구조가 반복되므로 부모의 공통 UI 안에서 하위 페이지의 로딩과 오류를 나누어 처리할 수 있다.

#### 3.3 Layout vs Template

| 구분 | layout | template |
| --- | --- | --- |
| 공유 구간 이동 | 기존 인스턴스 유지 | 템플릿 키가 바뀌면 새 인스턴스 생성 |
| 클라이언트 상태 | 유지 가능 | 재마운트되는 부분은 초기화 |
| 사용 예 | 헤더, 메뉴, 사이드바 | 진입마다 초기화가 필요한 UI |

정적·동적 페이지 여부보다 인스턴스와 상태를 유지할지에 따라 구분한다.

#### 3.4 src Directory

`src`는 애플리케이션 소스를 설정 파일과 분리하기 위한 선택적 폴더다. `app`을 루트에 둘 수도 있고 `src/app`으로 구성할 수도 있다.

---

### 4. Creating Pages and Nested Layouts

`page.tsx`는 해당 경로의 화면, `layout.tsx`는 하위 화면의 공통 틀이다. layout의 `children` 자리에 페이지 또는 더 안쪽 레이아웃이 들어간다.

```text
src/app/
├─ layout.tsx
├─ page.tsx
└─ (marketing)/
   ├─ layout.tsx
   └─ about/
      ├─ layout.tsx
      └─ page.tsx
```

`/about`의 화면은 Root Layout → Marketing Layout → About Layout → About Page 순서로 감싸진다. 루트만 `html`, `body`를 포함하고 하위 레이아웃은 필요한 공통 UI를 작성한다.

```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Marketing Layout Header</header>
      {children}
      <footer>Marketing Layout Footer</footer>
    </div>
  );
}
```

---

### 5. Loading Skeleton 실습

특정 경로에 `loading.tsx`를 만들고 페이지에 3초 지연을 넣어 로딩 UI를 관찰하는 예제다.

```tsx
// loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

```tsx
// page.tsx
export default async function BlogPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <div>Blog 페이지</div>;
}
```

`await`는 Promise가 완료된 결과를 기다린다. 위 코드는 지연을 관찰하기 위한 수업 예제이며, 사전 렌더링·캐시 여부에 따라 매 방문마다 지연이 생기는 것은 아니다.

---

## 2026-09-09 (Week 2)

### 1. Manual Installation

프로젝트에 필요한 패키지와 파일을 직접 만들면서 기본 구성을 확인한다.

```bash
mkdir foo
cd foo
pnpm init
pnpm add next react react-dom
pnpm add -D typescript @types/node @types/react @types/react-dom
```

| 설치 방법 | 등록 위치 | 용도 |
| --- | --- | --- |
| `pnpm add` | dependencies | 앱 실행에 필요한 패키지 |
| `pnpm add -D` | devDependencies | 타입 검사, 빌드, 린트 등 개발 도구 |

#### 1.1 루트 레이아웃과 페이지

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

`/`에 접속하면 루트 레이아웃 안에 page의 내용이 들어간다. 두 파일을 `src/app`에 구성할 수도 있다.

#### 1.2 scripts와 개발 서버

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```bash
pnpm dev
```

`dev` 명령을 찾을 수 없다는 오류가 나면 package.json의 scripts를 확인한다. JSX 타입 오류가 나면 React 타입 패키지와 TypeScript 구성을 확인한다. Next.js는 TypeScript 파일을 감지해 필요한 설정을 안내하거나 생성한다.

자료의 예전 `next lint` 명령은 버전 차이에 주의한다. Next.js 16에서는 별도로 설정한 ESLint 명령을 사용한다.

---

### 2. create-next-app

```bash
pnpm create next-app@latest my-app
```

TypeScript, ESLint, Tailwind CSS, src 폴더, App Router, import 별칭 등을 선택해 기본 프로젝트를 생성한다.

```bash
pnpm create next-app@latest my-app --yes
```

`--yes`를 사용하면 기본값이나 저장된 설정을 이용해 질문을 건너뛴다.

---

### 3. Folder and File Conventions

#### 3.1 Top-level Folders

| 폴더 | 역할 |
| --- | --- |
| `app` | App Router |
| `pages` | Pages Router |
| `public` | 이미지·폰트 등 정적 리소스 |
| `src` | 애플리케이션 소스를 구분하는 선택적 폴더 |

`public/profile.png`는 `/profile.png`로 접근한다. `next/image`를 사용하면 이미지 크기 정보와 대체 텍스트를 함께 작성할 수 있다.

#### 3.2 Top-level Files

| 파일 | 역할 |
| --- | --- |
| `next.config.js` / `next.config.ts` | Next.js 설정 |
| `package.json` | 의존성과 실행 명령 |
| `instrumentation.ts` | 계측·모니터링 연동 |
| `proxy.ts` | 요청 프록시 처리 |
| `.env`, `.env.local` 등 | 환경 변수 |
| `.gitignore` | Git 제외 목록 |
| `next-env.d.ts` | 자동 생성되는 Next.js 타입 선언 |
| `tsconfig.json` / `jsconfig.json` | 타입 및 모듈 경로 설정 |
| `eslint.config.mjs` | ESLint flat config |

이 파일이 프로젝트 생성 시 모두 만들어지는 것은 아니다.

#### 3.3 Routing Files

| 파일 | 역할 |
| --- | --- |
| `page` | 해당 경로의 UI |
| `layout` | 공유 레이아웃 |
| `loading` | 로딩 UI |
| `not-found` | 찾을 수 없음 UI |
| `error` | 구간의 오류 경계 |
| `global-error` | 루트 수준 오류 UI |
| `route` | HTTP 요청 처리 |
| `template` | 새 인스턴스로 감싸는 UI |
| `default` | 병렬 라우트 슬롯의 기본 UI |

UI 파일에는 `.js`, `.jsx`, `.tsx`, 요청 처리 파일에는 `.js`, `.ts` 등을 사용한다. 폴더의 중첩이 URL 구간의 중첩으로 이어진다.

---

### 4. Dynamic Routes

| 폴더 표기 | 처리 범위 | 예시 값 |
| --- | --- | --- |
| `[slug]` | 한 구간 | `"abc"` |
| `[...slug]` | 하나 이상의 구간 | `["abc", "def"]` |
| `[[...slug]]` | 구간이 없는 경우도 포함 | `undefined` 또는 배열 |

`/posts/[slug]`는 `/posts/abc`를 처리하지만 `/posts`나 `/posts/abc/def`까지 처리하지 않는다. 허용할 경로 깊이와 기본 경로 포함 여부에 따라 표기를 선택한다.

---

### 5. 개발 환경 설정

#### 5.1 ESLint 설정 파일

`.eslintrc.json`은 JSON 설정, `eslint.config.mjs`는 JavaScript 모듈 형태의 flat config다. mjs에서는 import, 변수, 조건문 등을 이용한 설정 구성이 가능하다.

#### 5.2 Path Aliases

깊은 상대 경로 대신 `@/` 같은 별칭을 사용한다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

자료의 `baseUrl`과 버전별 경고 설정을 그대로 섞기보다 실제 TypeScript 버전을 확인한다. 위처럼 경로를 직접 지정할 수 있다.

#### 5.3 VS Code 편집기 레이블

여러 `page.tsx`가 열려 있을 때 폴더명도 표시하면 구분하기 쉽다.

```json
{
  "workbench.editor.customLabels.patterns": {
    "**/app/**/page.tsx": "${dirname(1)}/${dirname} - page.tsx",
    "**/app/**/layout.tsx": "${dirname(1)}/${dirname} - layout.tsx"
  }
}
```

---

### 6. pnpm과 링크 구조 복습

pnpm은 공용 패키지 저장소의 파일을 재사용해 중복 저장을 줄인다. pnpm 설치 상태는 `pnpm-lock.yaml`에 기록한다.

하드 링크는 같은 데이터를 가리키는 이름을 추가하는 방식이고, 심볼릭 링크는 대상 경로를 가리킨다. 같은 프로젝트에서 패키지 관리자를 바꿀 때는 잠금 파일과 설치 상태를 함께 확인한다.

---

## 2026-09-02 (Week 1)

### 1. Next.js

Next.js는 React를 기반으로 웹 애플리케이션을 구성하는 프레임워크다. UI뿐 아니라 라우팅, 서버 렌더링, 번들러·컴파일러 설정 등의 기능을 함께 제공한다. React 위에서 앱 구성 기능을 제공한다는 의미에서 메타 프레임워크라고도 설명한다.

### 2. Getting Started

| 공식 문서 영역 | 읽는 목적 |
| --- | --- |
| Getting Started | 설치와 핵심 기능을 순서대로 학습 |
| Guides | 특정 사용 사례와 구현 방법 확인 |
| API Reference | 개별 기능의 인자·옵션·동작 확인 |

HTML, CSS, JavaScript와 React의 컴포넌트·props·state를 먼저 이해하면 예제를 따라가기 쉽다. 기초를 익힌 뒤에는 공식 Learn 과정으로 실습할 수 있다.

### 3. App Router / Pages Router

- **App Router**: app 디렉터리와 서버 컴포넌트, 중첩 레이아웃 등의 기능을 사용한다.
- **Pages Router**: pages 디렉터리를 사용하는 기존 라우터이며 계속 지원된다.
- 문서에서 라우터와 버전을 선택해 사용하는 프로젝트에 맞는 예제를 읽는다.
- `page`는 경로의 화면, `layout`은 공유 구조를 담당한다.

### 4. Server / Client Components

서버 컴포넌트는 서버에서 처리하고, 상태·이벤트·브라우저 기능이 필요한 부분에는 클라이언트 컴포넌트를 사용한다. `'use client'`는 클라이언트 컴포넌트의 진입 경계를 선언한다.

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>클릭: {count}</button>;
}
```

React 자체에도 서버 렌더링 기능이 있으므로 React는 항상 CSR만 가능하다고 구분하지 않는다.

### 5. Accessibility

접근성은 다양한 사용자가 콘텐츠와 기능을 이용할 수 있게 만드는 것이다. 수업 자료에서는 화면 판독기 사용 조합으로 Firefox·NVDA, Safari·VoiceOver를 소개한다.

화면을 시각적으로 보는 상황만 가정하지 않고 문서 구조, 이미지 대체 텍스트, 키보드 조작도 고려한다.

### 6. pnpm

Performant NPM이라는 이름의 패키지 관리자로, 저장 공간과 설치 속도·의존성 관리를 개선하는 데 초점을 둔다.

- 이미 받은 패키지 파일 재사용
- 중복 저장을 줄여 디스크 공간 절약
- 의존성 관계를 엄격하게 관리
- 프로젝트별 잠금 파일로 설치 상태 기록

#### 6.1 Hard Link

Unix 계열 파일 시스템을 설명할 때 파일을 다음 요소로 나눌 수 있다.

- **Directory Entry**: 파일 이름과 inode를 연결한다.
- **inode**: 권한, 소유자, 크기, 데이터 위치 등의 정보를 가진다.
- **Data Blocks**: 실제 데이터를 저장한다.

하드 링크는 같은 inode에 대한 다른 이름이다. 한 이름을 지워도 다른 링크가 남아 있으면 데이터를 사용할 수 있다.

#### 6.2 Symbolic Link

심볼릭 링크는 별도의 링크 파일에 대상 경로를 기록한다. 대상이 이동하거나 삭제되면 연결이 끊어질 수 있다. 하드 링크처럼 같은 inode를 공유하는 방식과 구분한다.

### 7. 내장 최적화와 배포

- `next/image`: 크기·형식 등 이미지 제공을 최적화한다.
- `next/font`: 폰트 로딩과 자체 호스팅을 지원하고 레이아웃 이동을 줄이는 데 도움을 준다.
- `build`, `start` 등의 실행 명령으로 배포용 결과를 만들고 실행한다.
- Vercel 등의 호스팅 서비스를 사용할 수 있으며 플랫폼별 지원 기능을 확인한다.

### 8. Installation

```bash
pnpm create next-app@latest my-app
```

`--yes`를 붙이면 기본값이나 저장된 설정으로 질문을 건너뛴다. 지원 브라우저와 필요한 폴리필도 설치 문서에서 확인한다.

---

참고한 저장소: [wpexq](https://github.com/wpexq/React2), [wlswodnjs](https://github.com/wlswodnjs/react-02), [jinwooorp](https://github.com/jinwooorp/React2), [gkfg](https://github.com/gkfg/Daelim-React2), [onejae17](https://github.com/onejae17/React2), [imdohyeon](https://github.com/imdohyeon/React2), [umteahoon](https://github.com/umteahoon/React2)

[날짜별 원본 대조 기록](docs/SOURCES.md) · [프로젝트 실행 방법](my-next-app/README.md)
