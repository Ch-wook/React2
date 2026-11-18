# 202130433 최현욱 수업기록

## 2026-11-11 (Week 11)

### 1. Context Provider 복습

테마 상태는 ThemeProvider에서 관리한다. 하위 컴포넌트는 Context로 현재 테마와 변경 함수를 받아서 사용한다.

#### 1.1 타입과 기본값

```tsx
type Theme = 'light' | 'dark';
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});
```

- `'light' | 'dark'`: light와 dark 중 하나만 넣을 수 있는 유니온 타입
- `toggleTheme: () => void`: 인자 없이 호출하며 반환값을 사용하지 않음
- `createContext`의 기본값은 Provider가 없을 때 사용한다. Provider가 있으면 `value`를 읽는다.
- 기본값의 빈 함수는 아무 동작도 하지 않는다. 실제 토글 함수는 ThemeProvider에서 전달한다.

```tsx
const [theme, setTheme] = useState<Theme>('light');
const toggleTheme = () => {
  setTheme((current) => current === 'dark' ? 'light' : 'dark');
};
```

처음에는 light로 시작한다. `setTheme`에 함수를 넘기면 이전 테마를 기준으로 다음 값을 정할 수 있다.

#### 1.2 useEffect와 data-theme

```tsx
useEffect(() => {
  if (typeof window !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
}, [theme]);
```

| 코드 | 의미 |
| --- | --- |
| `useEffect` | 렌더링 후 theme을 DOM에 반영 |
| `typeof window !== 'undefined'` | 브라우저 환경인지 확인 |
| `document.documentElement` | 현재 문서의 `<html>` 요소 |
| `.dataset.theme = theme` | `data-theme` 속성 변경 |
| `[theme]` | 최초 마운트와 theme 값이 바뀐 뒤 Effect 실행 |

`theme`이 dark면 HTML에 `data-theme="dark"`가 붙는다. Effect는 처음 마운트될 때와 theme이 바뀔 때 실행되며, 서버 렌더링 중에는 실행되지 않는다.

#### 1.3 CSS 속성 선택자

```css
html[data-theme='light'] {
  --background: #ffffff;
  --foreground: #171717;
}

html[data-theme='dark'] {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

`html[data-theme='dark']`는 data-theme이 dark인 html을 선택한다. 테마를 바꿔도 색이 그대로라면 CSS가 이 속성을 사용하고 있는지 확인해야 한다.

### 2. ThemeStatus와 Provider 배치

```tsx
'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function ThemeStatus() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="다크 모드"
      aria-pressed={theme === 'dark'}
    >
      Theme: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

`useContext`는 가장 가까운 Provider의 값을 읽는다. 버튼을 누르면 받아 온 `toggleTheme`이 실행된다.

- `aria-label`: 화면 낭독기에 전달할 버튼 이름
- `aria-pressed`: 토글이 켜져 있는지 표시

RootLayout은 Server Component로 두고, body 안에 ThemeProvider를 넣는다.

```tsx
<html lang="ko" data-theme="light">
  <body>
    <ThemeProvider>
      <header><ThemeStatus /></header>
      <main>{children}</main>
      <footer>수업 기록</footer>
    </ThemeProvider>
  </body>
</html>
```

테마를 사용할 컴포넌트는 Provider 안에 있어야 한다. Provider가 html의 속성을 바꾸더라도 바깥 컴포넌트까지 Context를 읽을 수 있는 것은 아니다.

### 3. Context Provider 동작 순서

1. RootLayout에서 ThemeProvider를 렌더링한다.
2. Provider가 theme과 toggleTheme을 value로 넘긴다.
3. ThemeStatus에서 useContext로 값을 읽는다.
4. 버튼 클릭 → toggleTheme → setTheme 실행.
5. Provider와 Context를 읽는 컴포넌트가 새 값으로 렌더링된다.
6. Effect가 html의 data-theme을 바꾼다.
7. 바뀐 속성에 맞춰 CSS가 적용된다.

```text
버튼 클릭 → toggleTheme → setTheme
                         ↓
                 Provider value 변경
                         ↓
                 Consumer의 UI 갱신
                         ↓
                 useEffect → data-theme → CSS
```

Provider 안에 넣었다고 Server Component까지 브라우저에서 다시 실행되지는 않는다.

### 4. 외부(Third-party) Component

`acme-carousel`처럼 useState를 쓰는 외부 컴포넌트에 `'use client'`가 없다면 Client Component 안에서 불러온다. 아래처럼 래퍼 파일을 하나 만들어도 된다.

```tsx
// 외부 패키지가 설치되어 있고 해당 export를 제공할 때의 래퍼 예시
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

서버 페이지에서는 이 파일을 import하면 된다. 페이지 전체에 `'use client'`를 붙일 필요는 없다.

#### 4.1 설치 후 확인할 오류

| 오류 | 확인할 부분 |
| --- | --- |
| `Cannot find module 'acme-carousel'` | 패키지 설치 여부, import 경로 |
| `Property 'items' is missing` | 필수 props인 items 전달 여부 |
| export를 찾을 수 없음 | default / named export 구분 |
| 동작하지만 이미지 배치가 깨짐 | 패키지 스타일 import와 CSS 경로 |

패키지를 설치한 뒤에도 items를 넘기지 않으면 타입 오류가 난다. 설치 문제와 props 누락을 따로 확인해야 한다.

#### 4.2 items와 조건부 렌더링

```tsx
'use client';

import { useState } from 'react';
import LocalCarousel from './LocalCarousel';
import './styles.css';

const items = [
  { id: '1', src: 'https://picsum.photos/id/1015/800/600', alt: 'Landscape 1' },
  { id: '2', src: 'https://picsum.photos/id/1016/800/600', alt: 'Landscape 2' },
  { id: '3', src: 'https://picsum.photos/id/1018/800/600', alt: 'Landscape 3' },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <button onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        {isOpen ? '사진 닫기' : 'View pictures'}
      </button>
      {isOpen && <LocalCarousel items={items} />}
    </section>
  );
}
```

- `id`: 항목 구분
- `src`: 이미지 주소
- `alt`: 이미지 대체 텍스트

버튼을 누르면 isOpen이 바뀌고, true일 때 캐러셀이 나온다. 여기서는 같은 items 형태를 받는 로컬 실습 컴포넌트 `LocalCarousel`을 사용했다.

#### 4.3 CSS와 export 확인

`acme-carousel/dist/styles.css`를 가져오지 못하면 패키지의 CSS 경로를 확인한다. 스타일을 로컬 파일로 두는 경우에는 컴포넌트에서 직접 import한다.

```tsx
import './styles.css';
```

Named export는 중괄호를 붙이고, default export는 붙이지 않는다.

```tsx
// 패키지가 제공하는 export 형태를 먼저 확인한다.
import { Carousel } from 'acme-carousel';
import Slide from 'acme-carousel';
```

위 import는 강의 예제 기준이다. 설치한 버전의 export와 CSS 경로가 다를 수 있으니 타입 선언도 같이 확인한다.

---

## 2026-11-04 (Week 10)

### 1. Server에서 Client로 데이터 전달

서버 페이지에서 글을 찾고 `post.likes`를 LikeButton에 넘긴다. 버튼은 이 값을 state의 초기값으로 사용한다.

```tsx
// Server Component 내부
const post = posts.find((item) => item.id === id);
if (!post) notFound();

return <LikeButton key={post.id} likes={post.likes} />;
```

서버에서 클라이언트로 넘기는 props는 React가 직렬화할 수 있어야 한다. 직렬화는 객체 같은 데이터를 전송할 수 있는 형태로 바꾸는 과정이다.

- 문자열, 숫자, 불리언, 지원되는 배열·객체 등을 전달할 수 있다.
- 일반 onClick 함수는 서버에서 만들어 넘기지 않고 Client Component 안에 작성한다.
- React가 전달할 수 있는 값의 범위와 JSON의 범위는 다르다. Server Function 참조에도 별도 규칙이 있다.
- Promise를 넘겨 `use`로 읽는 방식도 있다. 이번 예제는 조회한 값을 props로 넘긴다.

### 2. Server / Client Component Interleaving

서버에서 만든 UI를 Client Component의 `children`에 넣어 함께 보여주는 방식.

```tsx
// src/components/ClientLayout.tsx
'use client';

import type { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="client-layout">
      <h2>클라이언트 레이아웃</h2>
      <div className="client-content">{children}</div>
    </div>
  );
}
```

`children`이 서버에서 만든 내용을 넣을 자리다.

```tsx
// src/components/ServerContent.tsx — 핵심 흐름
export default async function ServerContent() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('게시글 조회 실패');
  const data = await response.json();
  return <p>서버에서 가져온 제목: {data.title}</p>;
}
```

```tsx
// src/app/interleaved/page.tsx
import ClientLayout from '@/components/ClientLayout';
import ServerContent from '@/components/ServerContent';

export default function InterleavedPage() {
  return (
    <ClientLayout>
      <ServerContent />
    </ClientLayout>
  );
}
```

`page.tsx`에서 두 컴포넌트를 import하고 조합한다. ClientLayout은 children을 받아 출력하고, ServerContent의 fetch는 서버에서 실행된다. 서버 전용 파일을 ClientLayout 안에서 직접 import하지 않도록 주의.

### 3. Context와 Props Drilling

Props Drilling: 아래쪽 컴포넌트에 값을 전달하려고 중간 컴포넌트들이 쓰지 않는 props까지 계속 넘기는 것.

Context를 쓰면 중간 전달 없이 필요한 컴포넌트에서 값을 읽을 수 있다. 테마, 언어 설정, 사용자 정보처럼 여러 곳에서 쓰는 값에 활용한다. 한 곳에서만 쓰는 상태는 로컬 state로 두면 된다.

| 구성 | 역할 |
| --- | --- |
| `createContext` | 공유할 값의 Context 정의 |
| `useState` | Provider 안에서 변경 가능한 상태 관리 |
| `Context.Provider` | 하위 트리에 실제 value 제공 |
| `useContext` | 가장 가까운 Provider의 value 읽기 |

Context를 만들고 읽는 부분은 Client Component에 둔다. Server Layout에서는 Provider를 불러와 화면을 감싼다.

### 4. ThemeProvider 구현

```tsx
// src/components/ThemeProvider.tsx
'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

`value`에 theme과 toggleTheme을 같이 넣는다. ThemeStatus는 theme을 표시하고, 버튼을 누르면 toggleTheme을 호출한다.

### 5. RootLayout에 연결

```text
RootLayout (Server)
└─ ThemeProvider (Client: theme 관리)
   ├─ ThemeStatus (Client: 값을 읽고 버튼 표시)
   └─ 페이지 children (Server에서 구성 가능)
      └─ ClientLayout
         └─ ServerContent의 렌더링 결과
```

헤더에 ThemeStatus를 넣으면 각 페이지에서 같은 테마 버튼을 사용할 수 있다. 버튼을 눌러 html의 data-theme과 배경색이 함께 바뀌는지 확인한다. 저장 기능은 넣지 않았으므로 새로고침하면 light로 돌아간다.

---

## 2026-10-28 (Week 9)

### 1. Client JavaScript Bundle 크기 줄이기

상태나 클릭 이벤트가 필요한 부분에만 `'use client'`를 붙인다. 이 파일에서 import하는 코드도 클라이언트 번들에 포함되므로, 화면 전체를 Client Component로 만들면 보낼 JS가 많아진다.

```text
Layout (Server)
├─ Logo (정적인 표시)
├─ Navigation
└─ Search (Client: 입력 상태·이벤트)
```

Search는 입력을 처리하므로 Client Component로 분리한다. Logo와 나머지 Layout은 서버에 둔다. 이렇게 줄이는 것은 브라우저에서 실행할 JS이며, 이미지 파일 크기와는 별개다.

### 2. Counter 컴포넌트와 페이지

Counter는 `components`에 만들고, `/counter` 페이지에서 불러온다.

```tsx
// src/components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [likes, setLikes] = useState(12);
  return (
    <section>
      <p>{likes} likes</p>
      <button type="button" onClick={() => setLikes((value) => value + 1)}>
        Click me
      </button>
    </section>
  );
}
```

```tsx
// src/app/counter/page.tsx
import Counter from '@/components/Counter';

export default function CounterPage() {
  return <section><h1>Counter Page</h1><Counter /></section>;
}
```

페이지는 서버 컴포넌트, Counter는 클라이언트 컴포넌트다. 초기값 12에서 버튼을 누를 때마다 1씩 증가한다.

### 3. 동적 세그먼트와 LikeButton 연결

```ts
// src/lib/data.ts의 데이터 형태
type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
};

const post: Post = {
  id: 'nextjs',
  title: 'Next.js 소개',
  content: 'Next.js는 React 기반의 프레임워크입니다.',
  likes: 10,
};
```

`await params`로 id를 읽고, posts에서 같은 id의 글을 찾는다. 찾은 글의 likes를 버튼에 전달한다.

```tsx
import LikeButton from '@/ui/LikeButton';
import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = posts.find((item) => item.id === id);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton key={post.id} likes={post.likes} />
    </article>
  );
}
```

`useState(likes)`의 likes는 처음 상태를 만들 때 쓰는 값이다. 다른 글로 이동하면 새 상태로 시작하도록 `key={post.id}`를 붙였다.

### 4. 좋아요 상태와 공통 메뉴

클릭하면 count를 바로 1 올리고 isLiking을 true로 바꾼다. 잠깐 버튼을 막았다가 지연이 끝나면 다시 활성화한다. 서버 저장은 없어서 새로고침하면 초기 좋아요 수로 돌아간다.

공통 메뉴는 RootLayout에 작성한다. href와 글의 id가 맞아야 한다.

```tsx
<nav>
  <Link href="/counter">Counter</Link>
  <Link href="/nextjs">nextjs</Link>
  <Link href="/routing">routing</Link>
  <Link href="/ssr-ssg">ssr-ssg</Link>
  <Link href="/dynamic-routes">dynamic-routes</Link>
</nav>
```

`[id]`의 값이 꼭 숫자일 필요는 없다. 이 예제는 nextjs 같은 문자열을 사용한다. 없는 글은 `notFound()`로 처리한다.

---

## 2026-10-14 (Week 7)

### 1. Server Component와 Client Component의 역할

게시글 조회는 서버에서, 좋아요 클릭은 클라이언트에서 처리한다. 서버 페이지가 글의 초기값을 버튼에 넘기는 예제다.

| Server Component | Client Component |
| --- | --- |
| 데이터베이스·API 조회 | `useState`와 이벤트 핸들러 |
| 서버 비밀값을 사용하는 처리 | `useEffect`와 브라우저 API |
| 글의 제목·본문·초기 좋아요 전달 | 클릭에 따른 좋아요 UI 변경 |
| 서버 렌더링과 스트리밍 | hydration 뒤 사용자와 상호작용 |

```tsx
// 서버 페이지에서 준비한 값을 클라이언트 버튼에 전달
<LikeButton likes={post.likes} />
```

### 2. LikeButton의 두 가지 state

```tsx
const [count, setCount] = useState<number>(likes ?? 0);
const [isLiking, setIsLiking] = useState(false);
```

- `count`: 화면에 표시할 좋아요 수
- `isLiking`: 처리 중인지 표시하는 상태
- `disabled={isLiking}`으로 중복 클릭을 막는다.
- 요청이 끝나면 성공·실패에 관계없이 대기 상태를 풀어 줘야 한다.

### 3. Falsy와 Null 병합 연산자

Falsy는 조건문에서 false로 취급되는 값이다. `false`, `0`, `-0`, `0n`, 빈 문자열, `null`, `undefined`, `NaN` 등이 있다. 빈 배열 `[]`과 빈 객체 `{}`는 truthy.

- `||`: 왼쪽이 falsy면 오른쪽 값 사용
- `??`: 왼쪽이 null이나 undefined일 때만 오른쪽 값 사용

```ts
0 || 10;          // 10
0 ?? 10;          // 0
'' || '기본값';    // '기본값'
'' ?? '기본값';    // ''
undefined ?? 0;   // 0
```

`likes ?? 0`은 좋아요가 0이면 그대로 두고, 값이 없을 때만 0으로 채운다.

### 4. Optimistic Update와 Pessimistic Update

#### 4.1 낙관적 업데이트

화면을 먼저 바꾸고 서버 응답을 기다린다. 반응은 빠르지만 요청이 실패하면 이전 값으로 돌려놓는 rollback이 필요하다.

```text
클릭 → 화면 숫자 증가 → 서버 요청 → 성공하면 유지
                                  실패하면 복구·오류 표시
```

#### 4.2 비관적 업데이트

서버에서 성공 응답을 받은 뒤 화면을 바꾼다. 응답을 기다리는 동안에는 로딩 상태를 보여준다.

| 비교 | 낙관적 업데이트 | 비관적 업데이트 |
| --- | --- | --- |
| 화면 변경 | 응답 전에 먼저 반영 | 성공 응답 뒤 반영 |
| 체감 반응 | 빠름 | 응답 시간에 영향받음 |
| 실패 대응 | 임시 변경 취소·오류 안내 | 기존 값 유지·오류 안내 |
| 구현 시 주의 | rollback과 중복 요청 | 대기 상태와 중복 요청 |

LikeButton 예제는 숫자만 먼저 올리는 로컬 실습이다. 실제 API를 붙이면 요청 실패와 시간 초과를 처리하고, 필요할 때 이전 값으로 되돌리는 코드도 작성해야 한다.

### 5. RSC Payload와 최초 로딩

서버 컴포넌트의 렌더링 결과는 RSC Payload로 전달된다. 서버에서 만든 결과, Client Component의 위치와 모듈 참조, 전달할 props가 들어 있다.

첫 접속 시 처리 순서:

1. HTML로 우선 화면을 보여준다.
2. RSC Payload로 서버·클라이언트 컴포넌트 트리를 연결한다.
3. 클라이언트 JavaScript가 hydration을 수행해 이벤트와 상태를 연결한다.

Hydration은 서버에서 받은 HTML에 이벤트와 상태를 연결하는 과정이다. Client Component도 첫 화면의 HTML 생성에는 참여한다.

RSC Payload는 React 전용 직렬화 스트림이다. 일반 JSON 응답과 같지 않고, 단순히 전부 바이너리라고 보는 것도 정확하지 않다.

### 6. 후속 내비게이션과 use client 경계

Link로 이동할 때는 미리 받아 두거나 캐시한 RSC Payload를 사용한다. 공유 레이아웃은 유지하고 바뀌는 부분을 갱신한다.

```tsx
'use client';

import { useState } from 'react';
```

`'use client'`는 import 위에 작성한다. 이 파일에서 import한 코드는 클라이언트 번들에 들어간다. 서버에서 만들어 children으로 넘긴 UI는 이 import 경계에 포함되지 않는다.

---

## 2026-10-07 (Week 6)

### 1. generateStaticParams 실습

`generateStaticParams`에 미리 만들 경로의 params 목록을 반환한다. 글의 slug를 빌드할 때 알 수 있는 경우에 사용한다.

```tsx
// app/blog3/[slug]/page.tsx
import { notFound } from "next/navigation";
import { posts } from "../posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({
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

#### 1.1 빌드 시점의 동작 순서

1. Next.js가 동적 경로의 `generateStaticParams()`를 실행한다.
2. 함수가 `{ slug: "nextjs" }` 같은 params 객체의 배열을 반환한다.
3. 빌드 과정에서 각 params에 해당하는 페이지를 렌더링한다.
4. 사전 렌더링 가능한 결과를 생성해 요청 시 제공한다.

`map()`은 경로 목록을 만들고, 그 목록으로 페이지를 만드는 일은 Next.js가 한다.

| 반환한 값 | 대응하는 경로 |
| --- | --- |
| `{ slug: "nextjs" }` | `/blog3/nextjs` |
| `{ slug: "routing" }` | `/blog3/routing` |
| `{ slug: "ssr-ssg" }` | `/blog3/ssr-ssg` |

빌드 결과의 파일 위치는 배포 설정에 따라 달라진다.

#### 1.2 generateStaticParams가 없는 경우와 있는 경우

| 비교 | 없는 경우 | 있는 경우 |
| --- | --- | --- |
| 경로 목록 | 빌드에 사전 생성 목록을 제공하지 않음 | 반환한 params 목록을 빌드에 제공 |
| 수업 예제의 렌더링 | `/blog2/[slug]`는 요청 시 처리 | `/blog3/[slug]`의 알려진 글은 빌드 시 생성 |
| 첫 요청 | 서버에서 해당 글의 화면을 준비 | 미리 준비된 결과를 제공 가능 |
| 추가 slug | 요청 때 데이터 존재 여부 확인 | `dynamicParams` 등 설정에 따라 추가 경로 처리 |

SSR과 정적 생성 모두 서버에서 HTML을 제공할 수 있다. `generateStaticParams`를 추가해도 요청 정보가 필요한 부분은 별도로 처리된다.

---

### 2. await이 없어도 async를 붙여 두는 이유

지금은 더미 배열을 사용하지만 나중에 API나 DB 조회를 넣을 수 있어서 async로 작성해 둔다.

- 데이터 조회 함수의 작성 방식을 맞추기 편함
- 나중에 `await fetch(...)`나 DB 호출을 추가하기 편함
- Server Component에서 Promise를 반환할 수 있음

```tsx
export default async function Page() {
  return <h1>Blog</h1>;
}
```

비동기 처리가 없다면 일반 함수로 작성해도 된다. Client Component 자체를 async 함수로 만들지는 않는다.

---

### 3. Navigation이 느려지는 경우

#### 3.1 느린 네트워크

네트워크가 느리면 클릭 전에 프리페칭이 끝나지 않을 수 있다. loading.tsx도 아직 못 받았다면 로딩 화면을 바로 보여주기 어렵다.

`useLinkStatus`로 링크가 이동 중인지 표시할 수 있다.

```tsx
// app/ui/loading-indicator.tsx
"use client";

import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <span aria-hidden="true" className={`link-hint ${pending ? "is-pending" : ""}`} />
  );
}
```

```tsx
import Link from "next/link";
import LoadingIndicator from "./ui/loading-indicator";

export default function Menu() {
  return (
    <Link href="/blog2/nextjs" prefetch={false}>
      Next.js 소개 <LoadingIndicator />
    </Link>
  );
}
```

`useLinkStatus`는 Link 안의 컴포넌트에서 사용한다. 이미 미리 받은 경로라면 pending이 거의 보이지 않을 수 있다.

##### 로딩 표시의 깜빡임 줄이기

스피너를 100ms 정도 늦게 표시하면 빠른 이동에서 깜빡이는 현상을 줄일 수 있다. 스피너 자리를 미리 잡아 두면 옆 글자도 밀리지 않는다.

```css
.link-hint {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.5rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: 0;
}

.link-hint.is-pending {
  animation: fade-in 150ms 100ms forwards, rotate 800ms linear infinite;
}

@keyframes fade-in { to { opacity: 1; } }
@keyframes rotate { to { transform: rotate(360deg); } }
```

---

#### 3.2 프리페칭 비활성화

링크가 많은 목록에서는 안 눌러 볼 페이지까지 미리 가져올 수 있다. 자동 프리페칭을 끄려면 `prefetch={false}`를 넣는다.

```tsx
<Link href="/blog" prefetch={false}>Blog</Link>
```

- 정적 경로도 클릭 후 가져와야 하므로 대기가 생길 수 있다.
- 동적 경로는 서버의 렌더링 결과를 기다릴 수 있다.
- 로딩 UI나 링크 상태 표시로 진행 중임을 알려줄 수 있다.

##### Hover Prefetching

마우스를 올린 링크부터 미리 가져오는 방법도 있다.

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function HoverPrefetchLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);
  return (
    <Link href={href} prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      onFocus={() => setActive(true)}>
      {children}
    </Link>
  );
}
```

`null`로 바꾸면 기본 프리페칭을 다시 사용한다. 키보드 이동도 처리하려면 onFocus를 함께 넣는다.

##### Manual Prefetching

`router.prefetch(href)`로 직접 요청할 수도 있다. useEffect에서 실행하면 마운트 시 요청하고, onInvalidate로 다시 요청하도록 만들 수 있다. 호버할 때 실행하는 방식과는 다르다.

---

#### 3.3 Hydration 지연

초기 JS가 크면 hydration이 늦어지고 Link의 프리페칭도 늦게 시작할 수 있다.

- React의 선택적 hydration으로 필요한 부분을 우선 처리한다.
- 큰 의존성이 어디에 포함되는지 번들을 분석한다.
- 브라우저에서 실행할 필요가 없는 로직은 Server Component로 옮긴다.
- 상호작용이 필요한 부분만 작은 Client Component로 나눈다.

##### @next/bundle-analyzer

번들에 어떤 모듈이 얼마나 들어 있는지 확인하는 도구.

```ts
// next.config.ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {};
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

export default withBundleAnalyzer(nextConfig);
```

Webpack용 플러그인이므로 Next.js 16에서는 아래처럼 실행한다.

```powershell
$env:ANALYZE = "true"
try { npm.cmd run build -- --webpack }
finally { Remove-Item Env:ANALYZE }
```

분석 결과를 보고 필요 없는 의존성을 직접 줄인다. 플러그인이 알아서 제거해 주지는 않는다.

---

### 4. Server Component & Client Component

상태와 이벤트는 클라이언트, 데이터 조회는 서버 쪽에 두는 식으로 나눈다.

#### 4.1 Client Component를 사용하는 경우

- state와 `onClick`, `onChange` 같은 이벤트 처리
- `useEffect` 등 클라이언트 생명주기 로직
- `window`, `localStorage`, `navigator.geolocation` 등 브라우저 API
- 위 기능에 의존하는 사용자 정의 Hook

파일 맨 위에 `'use client'`를 붙인다. window 같은 브라우저 API는 이벤트나 Effect 안에서 사용한다.

#### 4.2 Server Component를 사용하는 경우

- 서버에서 DB나 API 데이터를 조회할 때
- API key, token 등을 브라우저에 전달하지 않고 사용할 때
- 클라이언트로 보내는 JavaScript 양을 줄일 때
- 초기 콘텐츠를 준비하고 점진적으로 스트리밍할 때

`page`와 `layout`은 기본적으로 Server Component다. 화면에 필요한 값만 props로 넘기고, API key나 token은 넘기지 않는다.

---

### 5. Native History API

- `pushState`: 브라우저 기록 추가
- `replaceState`: 현재 기록 변경

URL을 바꾸면 `usePathname`, `useSearchParams`에도 반영된다.

```tsx
'use client';

export default function SortButton() {
  return (
    <button onClick={() => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort', 'asc');
      window.history.pushState(null, '', url);
    }}>
      오름차순 URL로 변경
    </button>
  );
}
```

History API로 URL을 바꾸는 것만으로 서버 데이터를 다시 조회하지는 않는다. 페이지 이동이 필요할 때는 Link나 router를 사용한다.

### 6. params 구조 분해와 타입 표기

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

- `{ params }`: props에서 params를 꺼내는 구조 분해
- 콜론 뒤의 객체: 매개변수 타입
- `Promise<{ slug: string }>`: 기다린 뒤 받을 값이 slug라는 문자열을 가진 객체라는 뜻

따라서 `await params`로 받은 객체에서 slug를 꺼낸다.

---

## 2026-09-30 (Week 5)

### 1. How Navigation Works

Next.js의 페이지 이동에는 다음 네 가지가 함께 사용된다.

- Server Rendering
- Prefetching
- Streaming
- Client-side Transition

---

#### 1.1 Server Rendering

App Router의 layout과 page는 기본적으로 Server Component다. 렌더링 결과를 언제 준비하는지에 따라 정적·동적으로 나눈다.

- **Static Rendering**: 빌드 또는 재검증 과정에서 결과를 준비해 캐시한다.
- **Dynamic Rendering**: 요청이 들어오면 해당 요청에 맞춰 결과를 만든다.

요청 후에 화면을 만들면 응답을 기다려야 한다. 프리페칭과 클라이언트 측 전환으로 이 대기를 줄인다.

##### Initial Visit

CSR 앱은 브라우저에서 JS를 실행한 뒤 본문을 만든다. Next.js는 첫 방문에 HTML도 보내므로 JS가 전부 실행되기 전부터 내용을 볼 수 있다.

이후 hydration으로 버튼 클릭 같은 상호작용을 연결한다.

---

#### 1.2 Prefetching

이동할 페이지를 미리 가져오는 것. 링크를 눌렀을 때 이미 결과가 있으면 빠르게 전환할 수 있다.

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

자동 프리페칭은 프로덕션 환경에서 확인한다.

---

#### 1.3 Streaming

전체 작업이 끝나기를 기다리지 않고 준비된 UI부터 보내는 방식이다. 데이터 조회가 늦어도 레이아웃이나 로딩 화면을 먼저 보여줄 수 있다.

먼저 보여줄 수 있는 UI:

- 공유 레이아웃
- 로딩 안내
- 콘텐츠 형태를 미리 보여주는 스켈레톤

##### loading.tsx

```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

`loading.tsx`를 만들면 페이지와 그 아래 콘텐츠가 Suspense 경계로 처리된다. 내용이 준비되면 로딩 화면이 교체된다. 일부만 감싸려면 `<Suspense>`를 직접 사용한다.

##### Shared Layouts / Interruptible Navigation

- 새 페이지가 준비되는 동안 공유 레이아웃을 유지한다.
- 메뉴나 사이드바 등 공유 UI를 계속 사용할 수 있다.
- 로딩이 끝나기 전 다른 경로로 이동할 수 있다.
- 다른 경로로 이동해도 서버에서 시작한 작업이 모두 취소되는 것은 아님

##### 웹 성능 지표

| 지표 | 의미 |
| --- | --- |
| TTFB | 요청 후 첫 응답 바이트까지 걸리는 시간 |
| FCP | 첫 콘텐츠가 화면에 표시되는 시점 |
| TTI | 상호작용 가능한 시점을 설명하는 기존 성능 지표 |
| LCP | 가장 큰 콘텐츠가 화면에 표시되는 시점 |
| CLS | 예상치 못한 레이아웃 이동 정도 |
| INP | 사용자 입력에 화면이 반응하는 지연 |

FID는 첫 입력의 지연을 보던 지표다. Core Web Vitals에서는 FID 대신 INP를 사용하며 LCP·INP·CLS를 함께 본다.

---

#### 1.4 Client-side Transition

일반 a 태그로 이동하면 문서 전체를 다시 받는다. Link는 공유 UI를 유지하면서 이동한 경로에 필요한 화면을 갱신한다.

- 공유 레이아웃과 메뉴 유지
- 미리 받아 둔 페이지 또는 로딩 UI 표시
- 준비된 콘텐츠로 화면 교체

레이아웃은 유지되지만 모든 페이지의 상태와 스크롤이 항상 보존되는 것은 아니다.

---

### 2. 전환을 느리게 만드는 요인

#### 2.1 loading.tsx가 없는 동적 경로

동적 경로는 서버 응답을 기다리는 동안 화면이 멈춘 것처럼 보일 수 있다. loading.tsx를 두면 로딩 상태를 먼저 보여줄 수 있다.

#### 2.2 generateStaticParams가 없는 동적 세그먼트

블로그처럼 미리 알 수 있는 slug는 `generateStaticParams`에 반환한다.

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

반환값은 문자열 배열이 아니라 `{ slug: 값 }` 형태의 객체 배열이다. 동적 세그먼트도 이렇게 사전 생성할 수 있다.

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

수업은 App Router 기준. Pages Router의 API와 섞어서 사용하지 않도록 주의한다.

---

## 2026-09-23 (Week 4)

### 1. Link Component

`next/link`에서 Link를 가져오고 href에 이동할 주소를 넣는다. 페이지 전환과 프리페칭을 지원한다.

```tsx
import Link from "next/link";

export default function Page() {
  return <Link href="/blog">Blog</Link>;
}
```

#### 1.1 href

href에 문자열 대신 pathname과 query를 가진 객체를 넣을 수도 있다.

```tsx
<Link href="/products?id=1&name=keyboard">상품</Link>

<Link href={{ pathname: "/products", query: { id: "1", name: "keyboard" } }}>
  상품
</Link>
```

---

### 2. Creating a Layout

Root Layout은 전체 화면을 감싼다. html과 body가 들어가며, children 자리에 페이지나 하위 레이아웃이 들어온다.

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

하위 경로에도 layout을 추가할 수 있다. 함수 이름이 꼭 RootLayout일 필요는 없고, 파일 이름이 layout.tsx여야 한다.

---

### 3. Creating a Nested Route

폴더를 중첩하면 URL도 중첩된다. 각 위치에 page.tsx를 만들어 화면을 작성한다.

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

#### 3.1 예제 import 오류

공식 문서에 있는 `@/lib/posts`, `@/ui/post`는 직접 만들어야 하는 파일이다. 그대로 import하면 파일이 없어서 오류가 난다. 우선 정적인 목록으로 작성하거나 해당 파일을 만든다.

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

폴더 이름을 `[slug]`로 만들면 URL의 값을 params로 받는다. slug는 글을 구분하는 읽기 쉬운 문자열이다.

- `/blog/nextjs` → `params.slug`는 `nextjs`
- `/blog/routing` → `params.slug`는 `routing`
- `[id]`로 만들었다면 `params.id`로 접근

폴더 이름을 `[id]`로 지으면 params의 키도 id가 된다.

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

Next.js 15부터 params는 Promise다. `params.slug`를 바로 읽지 않고 `await params`로 먼저 값을 받는다.

- `async`: 함수 안에서 await를 사용하도록 선언한다.
- `{ params }`: props 중 params만 구조 분해해 받는다.
- `Promise<{ slug: string }>`: 비동기 결과의 형태를 지정한다.
- `.find()`: 배열에서 slug와 일치하는 항목을 찾는다.

find는 배열을 차례로 탐색하므로 O(n)이다. 더미 데이터에서는 그대로 쓰고, 데이터가 많아지면 DB에서 필요한 글을 조회하는 방식으로 바꿀 수 있다.

---

### 5. Rendering with Search Params

`?` 뒤의 쿼리 문자열. 검색어, 필터, 페이지 번호처럼 같은 경로에서 조건을 바꿀 때 사용한다.

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

params는 URL 경로의 값, searchParams는 쿼리 문자열이다. 서버 페이지에서는 searchParams를 await하면 일반 객체를 받는다. 요청마다 값이 달라질 수 있다.

### 6. Route 방식

React에서는 라우터 라이브러리 등으로 경로를 직접 연결한다. Next.js는 폴더와 파일로 경로를 만든다. App Router에서는 경로별 layout, loading, error도 함께 작성한다.

---

## 2026-09-16 (Week 3)

### 1. Folder and File Conventions

#### 1.1 Route Groups / Private Folders

- `(group)`: URL을 바꾸지 않고 폴더와 레이아웃을 묶는다.
- `_folder`: 해당 폴더와 하위 폴더를 라우팅에서 제외한다.
- 일반 폴더도 page나 route 파일이 없으면 그 자체로 공개 경로를 만들지 않는다.

`app/(marketing)/about/page.tsx`는 `/about`으로 연결된다. 그룹 이름은 URL에 안 들어가므로 다른 폴더와 주소가 겹치지 않게 주의한다.

#### 1.2 Parallel / Intercepting Routes

여러 화면을 한 레이아웃에 보여주거나, 목록 위에 상세 모달을 띄울 때 사용한다.

| 표기 | 의미 |
| --- | --- |
| `@folder` | 부모 레이아웃에서 표시하는 이름 있는 슬롯 |
| `(.)folder` | 같은 레벨의 경로 가로채기 |
| `(..)folder` | 한 단계 위의 경로 가로채기 |
| `(..)(..)folder` | 두 단계 위의 경로 가로채기 |
| `(...)folder` | app 루트 기준 경로 가로채기 |

가로채기 라우트는 현재 화면을 유지하면서 다른 경로의 내용을 보여줄 때 쓴다.

---

### 2. Open Graph Protocol

링크를 공유했을 때 나오는 제목, 설명, 미리보기 이미지를 지정하는 규칙이다. Facebook에서 시작됐고 여러 SNS와 메신저에서 사용한다.

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

라우팅 파일과 컴포넌트, 데이터 파일의 위치를 정리한다. 라우팅 규칙을 지키면 관련 파일을 app 안에 같이 두어도 된다.

#### 3.1 Colocation

함께 쓰는 파일을 가까이 두는 것. 블로그 페이지와 posts 데이터를 같은 폴더에 두는 식이다.

#### 3.2 Component Hierarchy

특수 파일이 화면을 감싸는 순서:

```text
layout
└─ template
   └─ error 경계
      └─ loading 경계
         └─ not-found 경계
            └─ page 또는 하위 layout
```

중첩 경로에도 이 구조가 반복된다. 부모 화면을 유지하면서 하위 페이지의 로딩과 오류를 처리할 수 있다.

#### 3.3 Layout vs Template

| 구분 | layout | template |
| --- | --- | --- |
| 공유 구간 이동 | 기존 인스턴스 유지 | 템플릿 키가 바뀌면 새 인스턴스 생성 |
| 클라이언트 상태 | 유지 가능 | 재마운트되는 부분은 초기화 |
| 사용 예 | 헤더, 메뉴, 사이드바 | 진입마다 초기화가 필요한 UI |

화면이 정적인지보다, 이동할 때 기존 상태를 유지할지가 차이점이다.

#### 3.4 src Directory

소스 파일을 따로 모으고 싶으면 src를 사용한다. app을 루트에 두거나 src/app으로 둘 수 있다.

---

### 4. Creating Pages and Nested Layouts

- `page.tsx`: 해당 주소의 화면
- `layout.tsx`: 하위 화면들이 공유하는 틀

layout의 children 안에 페이지나 더 안쪽 레이아웃이 들어간다.

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

/about은 Root → Marketing → About Layout → About Page 순서로 감싸진다. html과 body는 루트 레이아웃에만 넣는다.

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

페이지에 3초 지연을 넣고 loading.tsx가 나타나는지 확인하는 예제.

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

await는 Promise가 끝날 때까지 기다린다. 페이지가 미리 렌더링되거나 캐시되어 있으면 매번 3초씩 기다리지는 않는다.

---

## 2026-09-09 (Week 2)

### 1. Manual Installation

패키지와 기본 파일을 직접 만들어서 설치하는 방법.

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

/에 접속하면 layout 안에 page가 들어간다. src/app 구조로 만들어도 같다.

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

- dev 명령을 찾지 못하면 package.json의 scripts 확인
- JSX 타입 오류가 나면 React 타입 패키지와 tsconfig 확인
- TypeScript 파일이 있으면 Next.js가 필요한 설정을 안내하거나 생성함

Next.js 16에서는 next lint 대신 ESLint 명령을 사용한다.

---

### 2. create-next-app

```bash
pnpm create next-app@latest my-app
```

TypeScript, ESLint, Tailwind CSS, src 폴더, App Router, import 별칭 등을 선택한다.

```bash
pnpm create next-app@latest my-app --yes
```

`--yes`를 붙이면 기본값이나 저장된 설정으로 질문을 건너뛴다.

---

### 3. Folder and File Conventions

#### 3.1 Top-level Folders

| 폴더 | 역할 |
| --- | --- |
| `app` | App Router |
| `pages` | Pages Router |
| `public` | 이미지·폰트 등 정적 리소스 |
| `src` | 애플리케이션 소스를 구분하는 선택적 폴더 |

`public/profile.png`의 주소는 `/profile.png`다. next/image를 쓸 때는 크기와 alt도 작성한다.

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

필요한 기능에 따라 만드는 파일이므로 처음부터 전부 있을 필요는 없다.

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

UI 파일은 js·jsx·tsx, 요청 처리 파일은 js·ts 등을 사용한다. 폴더를 중첩하면 URL의 구간도 늘어난다.

---

### 4. Dynamic Routes

| 폴더 표기 | 처리 범위 | 예시 값 |
| --- | --- | --- |
| `[slug]` | 한 구간 | `"abc"` |
| `[...slug]` | 하나 이상의 구간 | `["abc", "def"]` |
| `[[...slug]]` | 구간이 없는 경우도 포함 | `undefined` 또는 배열 |

`/posts/[slug]`는 `/posts/abc`만 받는다. `/posts`나 `/posts/abc/def`까지 받으려면 다른 표기가 필요하다.

---

### 5. 개발 환경 설정

#### 5.1 ESLint 설정 파일

- `.eslintrc.json`: 기존 JSON 설정
- `eslint.config.mjs`: JavaScript 모듈 형태의 flat config. import나 변수를 사용할 수 있음

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

paths에 상대 경로를 직접 지정할 수 있다. baseUrl 관련 경고는 사용 중인 TypeScript 버전도 확인한다.

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

pnpm은 공용 저장소의 패키지 파일을 재사용해 중복 저장을 줄인다. 설치 정보는 pnpm-lock.yaml에 기록한다.

하드 링크는 같은 파일 데이터를, 심볼릭 링크는 대상 경로를 가리킨다. 패키지 관리자를 바꾸면 lock 파일과 설치 상태도 확인해야 한다.

---

## 2026-09-02 (Week 1)

### 1. Next.js

React 기반 프레임워크. 라우팅, 서버 렌더링, 빌드 설정 등을 제공한다. React 위에서 앱에 필요한 기능을 더해 주기 때문에 메타 프레임워크라고도 부른다.

### 2. Getting Started

| 공식 문서 영역 | 읽는 목적 |
| --- | --- |
| Getting Started | 설치와 핵심 기능을 순서대로 학습 |
| Guides | 특정 사용 사례와 구현 방법 확인 |
| API Reference | 개별 기능의 인자·옵션·동작 확인 |

HTML, CSS, JavaScript와 React의 props·state가 기본이다. 공식 Learn 과정에서도 예제를 따라 해 볼 수 있다.

### 3. App Router / Pages Router

- **App Router**: app 디렉터리와 서버 컴포넌트, 중첩 레이아웃 등의 기능을 사용한다.
- **Pages Router**: pages 디렉터리를 사용하는 기존 라우터이며 계속 지원된다.
- 문서를 볼 때 App Router / Pages Router와 버전을 먼저 확인한다.
- `page`는 경로의 화면, `layout`은 공유 구조를 담당한다.

### 4. Server / Client Components

데이터 조회와 서버 처리는 Server Component에 둔다. 상태, 이벤트, 브라우저 API가 필요하면 `'use client'`로 Client Component를 만든다.

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>클릭: {count}</button>;
}
```

React 자체에서도 서버 렌더링은 가능하다. React = CSR로만 외우지 않기.

### 5. Accessibility

화면 낭독기나 키보드로도 내용을 읽고 기능을 사용할 수 있어야 한다. 수업에서 소개한 조합은 Firefox + NVDA, Safari + VoiceOver.

문서의 제목 구조, 이미지 alt, 키보드로 버튼에 접근할 수 있는지도 확인한다.

### 6. pnpm

Performant NPM. 패키지 파일을 재사용해 설치 공간을 줄이는 패키지 관리자다.

- 이미 받은 패키지 파일 재사용
- 중복 저장을 줄여 디스크 공간 절약
- 의존성 관계를 엄격하게 관리
- 프로젝트별 잠금 파일로 설치 상태 기록

#### 6.1 Hard Link

Unix 계열 파일 시스템에서 구분하는 요소:

- **Directory Entry**: 파일 이름과 inode를 연결한다.
- **inode**: 권한, 소유자, 크기, 데이터 위치 등의 정보를 가진다.
- **Data Blocks**: 실제 데이터를 저장한다.

같은 inode를 가리키는 이름을 하나 더 만드는 것. 한쪽 이름을 지워도 다른 링크가 남아 있으면 파일 데이터는 남는다.

#### 6.2 Symbolic Link

대상 파일의 경로를 가리키는 링크다. 대상이 이동하거나 삭제되면 연결이 끊어질 수 있다.

### 7. 내장 최적화와 배포

- `next/image`: 크기·형식 등 이미지 제공을 최적화한다.
- `next/font`: 폰트 로딩과 자체 호스팅을 지원하고 레이아웃 이동을 줄이는 데 도움을 준다.
- `build`, `start` 등의 실행 명령으로 배포용 결과를 만들고 실행한다.
- Vercel 등의 호스팅 서비스를 사용할 수 있으며 플랫폼별 지원 기능을 확인한다.

### 8. Installation

```bash
pnpm create next-app@latest my-app
```

`--yes`를 붙이면 기본값이나 저장된 설정으로 설치한다. 필요한 브라우저 지원 범위와 폴리필은 설치 문서에서 확인한다.

---

참고한 저장소: [wpexq](https://github.com/wpexq/React2), [wlswodnjs](https://github.com/wlswodnjs/react-02), [jinwooorp](https://github.com/jinwooorp/React2), [gkfg](https://github.com/gkfg/Daelim-React2), [onejae17](https://github.com/onejae17/React2), [imdohyeon](https://github.com/imdohyeon/React2), [umteahoon](https://github.com/umteahoon/React2)

[자료 출처](docs/SOURCES.md) · [프로젝트 실행 방법](my-next-app/README.md)
