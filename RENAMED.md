# Ch-wook

## 2026-09-30 (5주차)

### 1. 네비게이션이 동작하는 과정

페이지 이동을 이해할 때는 화면을 만드는 시점과 이동하는 방식을 나누어 생각한다.

| 개념 | 하는 일 |
| --- | --- |
| Server Rendering | 서버에서 화면에 필요한 결과를 만든다 |
| Prefetching | 이동할 가능성이 있는 경로를 클릭 전에 가져온다 |
| Streaming | 먼저 준비된 화면부터 보내고 나머지를 이어서 보낸다 |
| Client-side Transition | 문서 전체를 새로 받는 대신 필요한 화면을 바꾼다 |

이 기능들이 함께 동작해서 서버의 응답을 기다리는 시간을 줄이거나, 기다리는 동안에도 화면을 사용할 수 있게 한다.

### 2. 서버 렌더링과 최초 방문

App Router의 `page.tsx`와 `layout.tsx`는 기본적으로 Server Component다. 서버 렌더링은 **언제 결과를 만드는지**에 따라 구분한다.

- **정적 렌더링**: 빌드 시점이나 재검증 시점에 결과를 미리 만들고 재사용한다.
- **동적 렌더링**: 요청이 들어온 뒤 요청 정보에 맞춰 결과를 만든다.

처음 접속할 때는 서버가 만든 HTML을 먼저 보여줄 수 있다. 이후 클라이언트 컴포넌트에 필요한 JavaScript가 연결되면서 상호작용이 가능해지는데, 이 과정을 hydration이라고 한다.

Server Component인지와 정적·동적으로 렌더링되는지는 별개의 기준이다. 서버 컴포넌트도 요청마다 렌더링할 수 있다.

### 3. Prefetching

프리페칭은 사용자가 링크를 누르기 전에 다음 경로에 필요한 내용을 가져오는 기능이다. `next/link`의 `Link`는 이 기능을 지원한다.

```tsx
import Link from "next/link";

export default function Menu() {
  return (
    <nav>
      <Link href="/blog">블로그</Link>
      <Link href="/streaming" prefetch={false}>스트리밍 실습</Link>
    </nav>
  );
}
```

- 기본 자동 프리페칭은 프로덕션 모드에서 확인한다.
- 정적 경로는 전체 내용을 미리 가져올 수 있다.
- 동적 경로는 프리페칭을 건너뛰거나 `loading.tsx` 경계까지 일부를 가져올 수 있다.
- `prefetch={false}`는 해당 링크의 프리페칭을 끈다.
- 일반 `<a>`에는 Next.js의 자동 프리페칭이 적용되지 않는다.

실습에서는 로딩 화면을 관찰하기 위해 `/streaming` 링크의 프리페칭을 껐다. 캐시와 프리페칭 설정에 따라 실제 동작은 달라질 수 있다.

### 4. Streaming과 loading.tsx

페이지 전체가 준비될 때까지 빈 화면으로 기다리는 대신, 공통 레이아웃이나 로딩 화면을 먼저 보여준다. 본문이 준비되면 로딩 화면을 실제 내용으로 바꾼다.

```text
src/app/streaming/
├─ loading.tsx  → 기다리는 동안 표시
└─ page.tsx     → 준비가 끝나면 표시
```

```tsx
// loading.tsx
export default function Loading() {
  return <p role="status">본문을 준비하고 있습니다…</p>;
}
```

`loading.tsx`를 두면 Next.js가 해당 페이지와 하위 구간을 Suspense 경계로 감싼다. 같은 폴더의 `layout.tsx` 자체를 감싸는 것은 아니다. 레이아웃에서 오래 걸리는 작업을 수행하면 별도의 Suspense 경계가 필요할 수 있다.

현재 프로젝트의 `streaming/page.tsx`에는 동작을 관찰하기 위한 보완 예제를 넣었다.

```tsx
import { connection } from "next/server";

export default async function StreamingPage() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return <h1>준비된 화면부터 보여주기</h1>;
}
```

`connection()` 이후는 요청이 들어온 뒤 실행한다. 2초 지연은 실습용이며, 실제 서비스에서 불필요한 지연을 추가할 이유는 없다.

### 5. 클라이언트 측 페이지 전환

`Link`로 이동하면 공유되는 레이아웃을 유지하면서 바뀐 경로의 화면을 표시할 수 있다. `/blog`에서 글 상세 페이지로 이동할 때 블로그 메뉴가 공통으로 남는 것이 이 예다.

- 공유 레이아웃의 클라이언트 상태와 상호작용을 유지할 수 있다.
- 로딩 중에도 다른 메뉴를 선택해 이동을 바꿀 수 있다.
- 모든 페이지의 상태가 무조건 유지되는 것은 아니다.
- 이동을 바꿀 수 있다는 것이 이미 시작한 모든 서버 작업의 취소를 보장하지는 않는다.

### 6. 이동이 느릴 때 확인할 부분

| 상황 | 확인할 내용 |
| --- | --- |
| 동적 페이지가 응답할 때까지 화면 변화가 없음 | `loading.tsx`를 적절한 경로에 두었는지 확인 |
| 미리 만들 수 있는 글도 요청마다 준비함 | `generateStaticParams`로 경로를 사전 생성할 수 있는지 확인 |
| loading 파일이 있는데도 로딩 화면이 안 나옴 | 오래 걸리는 작업이 같은 구간의 layout에 있는지 확인 |
| 개발 모드에서 프리페칭 요청이 안 보임 | 빌드 후 프로덕션 모드에서 확인 |

### 7. generateStaticParams

동적 세그먼트에 들어갈 값을 미리 알고 있다면 빌드 시 생성할 경로를 반환한다.

```tsx
// src/app/blog/[slug]/page.tsx
import { posts } from "../posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
```

현재 프로젝트는 `nextjs`, `routing`, `ssr-ssg`, `dynamic-routes` 네 경로를 만든다. `dynamicParams = false`이므로 목록에 없는 slug는 허용하지 않는다.

`[slug]`처럼 동적 세그먼트를 사용해도 정적 생성이 가능하다. 다만 요청 전용 API를 사용하는지에 따라 렌더링 방식이 달라지므로, 함수 하나만 추가하면 항상 정적 페이지가 된다고 생각하면 안 된다.

### 8. 웹 성능 지표

| 지표 | 살펴보는 내용 |
| --- | --- |
| LCP | 화면에서 가장 큰 콘텐츠가 표시되는 시점 |
| INP | 사용자 상호작용에 화면이 반응하는 지연 |
| CLS | 콘텐츠가 예상치 않게 움직이는 정도 |
| TTFB | 첫 응답 바이트를 받기까지의 시간 |
| FCP | 첫 콘텐츠가 화면에 표시되는 시점 |

Core Web Vitals는 LCP·INP·CLS다. 예전 자료의 FID는 현재 INP로 대체됐다. TTFB와 FCP는 별도의 성능 지표로 구분한다. [공식 Web Vitals 설명](https://web.dev/articles/vitals)

**실습 확인**: `/streaming`에서 로딩 화면과 본문 교체를 확인하고, `npm.cmd run build` 출력에서 블로그 글의 정적 생성을 확인한다.

참고: [링크와 내비게이션](https://nextjs.org/docs/app/getting-started/linking-and-navigating), [loading 규칙](https://nextjs.org/docs/app/api-reference/file-conventions/loading), [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

---

## 2026-09-23 (4주차)

### 1. Link 컴포넌트

`Link`는 HTML의 `<a>`를 바탕으로 프리페칭과 클라이언트 측 페이지 전환을 제공하는 Next.js 컴포넌트다. 이동할 주소를 `href`에 전달한다.

```tsx
import Link from "next/link";

export default function Menu() {
  return (
    <nav>
      <Link href="/blog">블로그</Link>
      <Link href={{ pathname: "/products", query: { id: "2", name: "마우스" } }}>
        상품 보기
      </Link>
    </nav>
  );
}
```

문자열 주소를 넣을 수도 있고, `pathname`과 `query`를 가진 객체를 넣을 수도 있다.

### 2. 중첩 라우트

폴더를 중첩하면 주소도 단계별로 구성된다. 폴더는 경로 구간을 정하고 `page.tsx`는 그 주소에 표시할 화면을 정한다.

```text
src/app/
├─ layout.tsx
├─ page.tsx                 → /
└─ blog/
   ├─ layout.tsx           → 목록과 상세가 공유
   ├─ page.tsx             → /blog
   ├─ posts.tsx            → 예제 데이터
   └─ [slug]/
      └─ page.tsx          → /blog/nextjs 등
```

`blog/layout.tsx`는 `/blog`와 `/blog/[slug]`를 함께 감싼다. 각 하위 폴더마다 layout을 반드시 만들 필요는 없다.

### 3. slug와 동적 세그먼트

slug는 사람이 읽을 수 있는 페이지 식별 문자열이다. `[slug]` 폴더를 만들면 해당 위치의 주소 값이 `params.slug`로 전달된다.

| 요청 주소 | params에서 얻는 값 |
| --- | --- |
| `/blog/nextjs` | `{ slug: "nextjs" }` |
| `/blog/routing` | `{ slug: "routing" }` |

폴더 이름을 `[id]`로 바꾸면 `params.id`로 읽는다. 이것은 params의 키를 정하는 규칙이며, 데이터 파일이나 DB의 필드 이름을 똑같이 강제하는 규칙은 아니다.

### 4. Promise params와 await

Next.js 15부터 `params`와 `searchParams`는 Promise 방식으로 바뀌었다. 현재 실습 버전에서도 값을 읽기 전에 `await`한다.

```tsx
import { notFound } from "next/navigation";
import { posts } from "../posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

`async` 함수 안에서 `await`로 Promise의 결과를 얻고, 그 결과의 `slug`를 사용해 글을 찾는다. `Promise` 타입은 await 없이 잘못 접근하는 실수를 발견하는 데도 도움이 된다.

`posts.find()`는 작은 예제 데이터에서 사용하기 쉽다. 데이터가 커지면 필요한 항목을 DB에서 조회하는 등의 방법을 검토한다. 없는 글은 본문처럼 출력하지 않고 `notFound()`로 처리한다.

### 5. searchParams로 검색 조건 읽기

`params`는 경로에 들어간 값을 읽고, `searchParams`는 URL의 `?` 뒤에 있는 값을 읽는다.

| 구분 | 예시 | 값 |
| --- | --- | --- |
| `params` | `/blog/nextjs` | slug가 nextjs |
| `searchParams` | `/products?id=1&name=keyboard` | id가 1, name이 keyboard |

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[]; name?: string | string[] }>;
}) {
  const query = await searchParams;
  const id = Array.isArray(query.id) ? query.id[0] : query.id;
  const name = Array.isArray(query.name) ? query.name[0] : query.name;

  return (
    <div>
      <p>id: {id || "미입력"}</p>
      <p>name: {name || "미입력"}</p>
    </div>
  );
}
```

- `?id=1&id=2`처럼 같은 키가 반복되면 배열이 될 수 있다. 이 실습에서는 첫 번째 값을 사용한다.
- 서버 페이지의 `searchParams`는 일반 객체이며 `URLSearchParams` 인스턴스가 아니다.
- 현재 앱에서 검색 매개변수를 읽는 `/products`는 요청 시점에 렌더링된다.
- 클라이언트 컴포넌트에서 읽을 때는 `useSearchParams`를 사용할 수 있다.
- 브라우저 이벤트에서 값을 읽는 경우에는 `new URLSearchParams(window.location.search)`를 사용할 수 있다. 서버에서 `window`를 사용하지 않는다.

### 6. 문서 예제를 옮길 때

예제의 `@/lib/posts`, `@/ui/post`가 내 프로젝트에 실제로 있는 파일인지 먼저 확인한다. 없는 파일을 import하면 실행되지 않는다. 현재 앱은 예제 데이터를 `src/app/blog/posts.tsx`에 두고 상대 경로로 가져온다.

**실습 확인**: `/blog/nextjs`, `/blog/not-a-post`, `/products?id=1&name=keyboard`, `/products?id=1&id=2`에 접속해 값과 없는 글 처리를 비교한다.

참고: [페이지와 레이아웃](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [params와 searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page)

---

## 2026-09-16 (3주차)

### 1. Open Graph Protocol

Open Graph는 링크를 공유할 때 표시할 제목, 설명, 이미지 등의 정보를 전달하는 방식이다.

| 속성 | 의미 |
| --- | --- |
| `og:title` | 공유 카드 제목 |
| `og:description` | 공유 카드 설명 |
| `og:image` | 미리보기 이미지 |
| `og:url` | 대상 페이지 주소 |
| `og:type` | website, article 등의 종류 |

Next.js App Router에서는 `metadata`로 관리할 수 있다. 아래는 작성 방법 예시다.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 수업 기록",
  description: "라우팅과 레이아웃을 정리한 수업 노트",
  openGraph: {
    title: "Next.js 수업 기록",
    description: "라우팅과 레이아웃을 정리한 수업 노트",
    type: "website",
  },
};
```

현재 프로젝트의 루트에는 기본 title과 description을 적용했다. 공유용 이미지와 Open Graph 설정은 위 예시로 구분해 기록한다.

### 2. Colocation과 비공개 폴더

Colocation은 관련 파일을 사용하는 위치 가까이에 두는 방식이다. `blog` 폴더 안에 `posts.tsx`를 두면 블로그 코드와 데이터를 함께 찾기 쉽다.

`app` 안의 모든 파일이 URL로 공개되는 것은 아니다. UI 경로는 `page.tsx`, HTTP 요청 처리는 `route.ts` 같은 예약 파일로 정해진다.

`_components`처럼 폴더 앞에 `_`를 붙이면 해당 폴더와 하위 폴더가 라우팅 대상에서 제외된다. 내부 구현을 구분하는 규칙이며, 비밀 정보를 보호하는 기능은 아니다.

### 3. Route Groups

`(marketing)`처럼 괄호로 묶은 폴더는 파일을 그룹으로 정리하면서 URL에는 이름을 넣지 않는다.

```text
src/app/(marketing)/about/page.tsx → /about
```

그룹마다 레이아웃을 둘 수 있다. 다만 `app/blog/page.tsx`와 `app/(marketing)/blog/page.tsx`를 동시에 만들면 같은 `/blog`에 대응하므로 충돌한다.

### 4. 루트 레이아웃과 중첩 레이아웃

루트 레이아웃에는 `html`과 `body`가 필요하다. `children`에는 하위 페이지 또는 하위 레이아웃이 들어간다.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header>공통 메뉴</header>
        <main>{children}</main>
        <footer>공통 하단 영역</footer>
      </body>
    </html>
  );
}
```

현재 `/about`의 적용 순서는 다음과 같다.

```text
app/layout.tsx                         Root Layout
└─ (marketing)/layout.tsx              Marketing Layout
   └─ about/layout.tsx                About Layout
      └─ about/page.tsx               페이지 본문
```

하위 레이아웃은 필요한 영역과 `children`을 반환한다. `html`과 `body`를 다시 넣지 않는다.

### 5. layout과 template의 차이

| 구분 | layout | template |
| --- | --- | --- |
| 역할 | 여러 페이지의 공통 UI 유지 | 하위 화면을 새로운 인스턴스로 감싸기 |
| 이동 시 동작 | 공유 구간을 유지 | 해당 템플릿의 키가 바뀌면 재마운트 |
| 클라이언트 상태 | 공유 부분의 상태 유지 가능 | 재마운트되는 부분의 상태 초기화 |
| 사용 예 | 메뉴, 사이드바 | 진입마다 초기화할 폼 등 |

정적 페이지에는 layout, 동적 페이지에는 template을 쓰는 식으로 구분하지 않는다. 화면 이동 시 무엇을 유지하고 초기화할지가 기준이다.

### 6. 병렬 라우트·가로채기 라우트와 src 폴더

- `@slot`: 여러 화면 영역을 독립적인 슬롯으로 구성하는 병렬 라우트 표기다.
- `(.)`, `(..)` 등: 다른 경로의 화면을 현재 맥락에서 표시하는 가로채기 라우트 표기다.
- `src/`: 애플리케이션 코드를 설정 파일과 구분하기 위한 폴더다. 이 앱은 `src/app`을 사용한다.
- `@/*`: 현재 `tsconfig.json`에서 `src/*`로 연결한 import 별칭이다.

병렬·가로채기 라우트는 수업 개념으로 기록하며, 현재 실습 앱에는 별도로 구현하지 않았다.

**실습 확인**: `/about`에서 Root → Marketing → About 레이아웃을 확인한다. 주소에 `(marketing)`이 나타나지 않는지도 확인한다.

참고: [프로젝트 구조](https://nextjs.org/docs/app/getting-started/project-structure), [레이아웃](https://nextjs.org/docs/app/api-reference/file-conventions/layout)

---

## 2026-09-09 (2주차)

### 1. 프로젝트 생성과 실행

`create-next-app`을 사용하면 프로젝트 생성과 기본 설정을 함께 진행할 수 있다.

```powershell
# 새 프로젝트를 만들 때 사용하는 명령 예시
npx create-next-app@latest my-next-app
```

현재 프로젝트는 이미 만들어져 있으므로 복습할 때는 다시 생성하지 않고 해당 폴더에서 실행한다.

```powershell
cd my-next-app
npm.cmd ci
npm.cmd run dev
```

수동 구성에서는 `next`, `react`, `react-dom`을 설치하고 package.json에 개발·빌드·실행 명령을 등록한다. 현재 앱의 주요 명령은 다음과 같다.

| 명령 | 목적 |
| --- | --- |
| `npm.cmd run dev` | 개발 서버 실행 |
| `npm.cmd run build` | 프로덕션 빌드 |
| `npm.cmd run start` | 빌드 결과 실행 |
| `npm.cmd run lint` | ESLint 코드 검사 |

### 2. 최상위 폴더와 설정 파일

| 이름 | 역할 |
| --- | --- |
| `src/app` | App Router의 페이지와 레이아웃 |
| `public` | 정적 파일 |
| `package.json` | 의존성과 실행 명령 |
| `package-lock.json` | npm 설치 버전 고정 |
| `next.config.ts` | Next.js 설정 |
| `tsconfig.json` | TypeScript 및 import 경로 설정 |
| `eslint.config.mjs` | 코드 검사 규칙 |
| `postcss.config.mjs` | CSS 처리 설정 |
| `.gitignore` | Git 추적에서 제외할 파일 |

현재 프로젝트는 ESLint flat config 형식인 `eslint.config.mjs`를 사용한다. 예전 자료의 `.eslintrc.json`을 같은 설정 파일로 생각하고 그대로 덮어쓰지 않는다.

### 3. 예약된 파일 이름

| 파일 | 역할 |
| --- | --- |
| `page.tsx` | 해당 주소에 표시할 화면 |
| `layout.tsx` | 하위 화면을 감싸는 공통 영역 |
| `loading.tsx` | 준비 중인 화면 |
| `not-found.tsx` | 없는 경로나 데이터 안내 |
| `error.tsx` | 해당 구간과 하위의 런타임 오류 처리 |
| `global-error.tsx` | 루트 수준 오류 처리 |
| `template.tsx` | 이동 시 재마운트가 필요한 공통 틀 |
| `route.ts` | GET·POST 등의 HTTP 요청 처리 |
| `default.tsx` | 병렬 라우트 슬롯의 기본 화면 |

`error.tsx`는 Client Component로 작성한다. 같은 구간의 layout에서 발생한 오류는 상위 오류 경계에서 처리한다. `global-error.tsx`는 루트 레이아웃을 대신하므로 자체 `html`, `body`를 포함해야 한다.

### 4. 동적 경로의 폴더 표기

| 표기 | 받는 주소 구간 | params 값 예시 |
| --- | --- | --- |
| `[slug]` | 한 구간 | `"nextjs"` |
| `[...slug]` | 하나 이상의 구간 | `["guide", "install"]` |
| `[[...slug]]` | 구간이 없는 경우까지 허용 | `undefined` 또는 문자열 배열 |

예를 들어 `app/docs/[...slug]/page.tsx`는 `/docs/guide/install`을 처리할 수 있다. `/docs` 자체까지 처리하려면 선택적 catch-all인 `[[...slug]]`를 검토한다.

### 5. 설치 파일과 Git 관리

`node_modules`는 설치된 의존성, `.next`는 Next.js가 생성한 결과다. 원격 저장소에는 소스와 잠금 파일을 올리고, 이 폴더들은 `.gitignore`로 제외한다.

현재 앱은 npm과 `package-lock.json`을 사용한다. 참고 저장소에서 pnpm을 사용하더라도 잠금 파일을 한 프로젝트에 섞지 않는다.

**실습 확인**: `src/app/page.tsx`가 `/`에 대응하는지 확인하고, `package.json`의 scripts와 실제 실행 명령을 비교한다.

참고: [프로젝트 구조와 파일 규칙](https://nextjs.org/docs/app/getting-started/project-structure)

---

## 2026-09-02 (1주차)

### 1. Next.js란?

React로 UI를 만들면서 라우팅, 서버 렌더링, 빌드 등 애플리케이션에 필요한 기능을 함께 사용할 수 있는 프레임워크다.

React가 화면을 컴포넌트로 구성하는 기반이라면, Next.js는 그 화면을 어떤 URL에서 어떤 방식으로 제공할지도 구성한다.

### 2. App Router와 Pages Router

| 구분 | App Router | Pages Router |
| --- | --- | --- |
| 기준 폴더 | `app` 또는 `src/app` | `pages` 또는 `src/pages` |
| `/about`의 파일 | `app/about/page.tsx` | `pages/about.tsx` |
| 공통 화면 | 중첩 `layout.tsx` | `_app` 및 별도 레이아웃 구성 |
| 주요 학습 내용 | 서버 컴포넌트, 로딩 UI, 중첩 라우트 | `getStaticProps` 등 기존 데이터 처리 방식 |

이 수업 프로젝트는 App Router를 사용한다. 공식 문서를 볼 때도 App Router용 예제인지 확인한다. Pages Router를 지원하지 않는다고 생각하거나 두 방식의 파일 규칙을 섞지 않는다.

### 3. 공식 문서를 읽기 위한 기초

- HTML: 화면 구조와 의미 있는 태그.
- CSS: 배치, 간격, 색상, 반응형 스타일.
- JavaScript: 배열, 객체, 함수, 모듈, Promise, async/await.
- React: 컴포넌트, props, state, Hook.
- TypeScript: 값과 props의 타입 표현.

공식 문서의 Getting Started에서 프로젝트 생성 → 구조 → 레이아웃과 페이지 → 링크와 내비게이션 순서로 학습한다.

### 4. 접근성

접근성은 키보드 사용자나 보조 기술 사용자도 화면을 이용할 수 있게 만드는 일이다.

- 제목은 내용 계층에 맞춰 `h1`, `h2` 등으로 작성한다.
- 이동에는 링크, 동작에는 버튼을 사용한다.
- 이미지에는 용도에 맞는 대체 텍스트를 제공한다.
- 키보드 포커스가 보이도록 하고 메뉴 이름을 구분한다.
- 한국어 문서는 `html`의 `lang`을 `ko`로 지정한다.

현재 앱에는 본문 바로가기 링크와 메뉴의 접근성 이름을 적용했다.

### 5. npm과 pnpm

npm과 pnpm은 프로젝트에서 사용할 패키지를 설치하고 관리하는 도구다. pnpm은 패키지 저장소와 링크를 활용해 디스크 사용과 의존성 관리를 효율적으로 처리한다. 실제 저장·연결 방식은 버전과 설정에 따라 달라질 수 있다.

| 개념 | 의미 |
| --- | --- |
| 하드 링크 | 같은 파일 데이터를 가리키는 다른 파일 이름 |
| 심볼릭 링크 | 다른 파일이나 폴더의 경로를 가리키는 링크 |
| 잠금 파일 | 의존성 버전을 기록해 설치 결과를 맞추는 파일 |

수업 자료의 pnpm 명령을 읽을 수는 있어도, 현재 프로젝트 실행은 npm으로 통일한다. 설치와 실행 안내는 [README.md](README.md)에 정리했다.

**실습 확인**: 프로젝트가 App Router 구조인지 확인하고, 개발 서버를 실행해 첫 페이지를 연다.

참고: [Next.js App Router 시작하기](https://nextjs.org/docs/app/getting-started)
