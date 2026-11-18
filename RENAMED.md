# 202130433 최현욱 수업기록

## 2026-11-11 (Week 11)

### 1. Context Provider 코드 읽기

지난 시간에 만든 테마 기능을 `Context 생성 → Provider 배치 → Consumer 사용` 순서로 다시 살펴봤다. Context는 공유할 값의 통로이고, 실제로 바뀌는 값은 Provider 안의 state가 관리한다.

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

- `'light' | 'dark'`: 두 문자열 중 하나만 허용하는 문자열 리터럴 유니온 타입이다. 다른 값을 넣는 실수를 타입 검사로 잡을 수 있다.
- `toggleTheme: () => void`: 인자를 받지 않고 반환값을 사용하지 않는 함수다.
- `createContext`의 기본값은 위쪽에 해당 Provider가 없을 때 사용하는 fallback이다. Provider가 있으면 `value`에 넣은 값이 우선한다.
- 기본값의 빈 함수는 테마를 바꾸지 않는다. 실제 변경 함수는 `ThemeProvider`에서 만들어 전달한다.

```tsx
const [theme, setTheme] = useState<Theme>('light');
const toggleTheme = () => {
  setTheme((current) => current === 'dark' ? 'light' : 'dark');
};
```

`useState`의 초기값은 `light`다. 함수형 업데이트는 직전 상태를 받아 다음 상태를 계산한다.

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
| `useEffect` | 렌더링 결과가 반영된 뒤 외부 DOM과 상태를 동기화 |
| `typeof window !== 'undefined'` | 브라우저 객체가 있는 환경인지 확인 |
| `document.documentElement` | 현재 문서의 `<html>` 요소 |
| `.dataset.theme = theme` | HTML의 `data-theme` 속성을 현재 상태로 변경 |
| `[theme]` | 최초 마운트와 theme 값이 바뀐 뒤 Effect 실행 |

`theme`이 `dark`면 `<html data-theme="dark">`가 된다. `useEffect`는 서버 렌더링 중에는 실행되지 않는다. 수업의 환경 확인 조건은 브라우저 객체를 다루는 위치를 구분하기 위한 것이다.

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

`[data-theme='dark']`는 속성값으로 요소를 선택한다. Context의 값을 바꾸는 것과 실제 화면 색상을 바꾸는 것은 별개다. `useEffect`가 HTML 속성을 바꾸고, CSS가 그 속성에 맞는 색상을 적용해야 테마 변화가 보인다. 속성 선택자를 쓴다고 모든 CSS 충돌이 자동으로 없어지는 것은 아니다.

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

`useContext`는 현재 컴포넌트 위에 있는 가장 가까운 `ThemeContext.Provider`의 값을 읽는다. `ThemeStatus`는 전달받은 함수를 실행하고, Provider는 상태를 변경한다. `aria-label`은 버튼 이름, `aria-pressed`는 토글 상태를 보조 기술에 전달한다.

RootLayout은 Server Component로 유지하고, `<body>` 안에서 공통 화면을 감싼다.

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

Provider는 값이 필요한 범위를 감싸도록 배치한다. `useEffect`가 `<html>` 속성을 바꿀 수 있다는 사실과 Context를 읽을 수 있는 범위는 다르다. Provider 밖의 컴포넌트는 이 Provider가 제공하는 값을 읽지 못한다. `children`으로 받은 서버 UI도 이 구조 때문에 모두 Client Component로 바뀌는 것은 아니다.

### 3. Context Provider 동작 순서

1. RootLayout이 ThemeProvider와 페이지를 구성한다.
2. ThemeProvider가 `useState`로 theme을 만들고 `value={{ theme, toggleTheme }}`를 제공한다.
3. ThemeStatus가 `useContext`로 현재 값과 함수를 읽는다.
4. 사용자가 버튼을 누르면 `toggleTheme()`가 `setTheme()`을 호출한다.
5. Provider와 해당 Context를 사용하는 Consumer가 새 값으로 렌더링된다.
6. 변경이 반영된 뒤 Effect가 `data-theme`를 갱신한다.
7. CSS 선택자가 새 테마의 스타일을 적용한다.

```text
버튼 클릭 → toggleTheme → setTheme
                         ↓
                 Provider value 변경
                         ↓
                 Consumer의 UI 갱신
                         ↓
                 useEffect → data-theme → CSS
```

Context 값의 변화는 그 값을 읽는 Consumer에게 전달된다. 모든 하위 Server Component가 브라우저에서 다시 실행된다는 뜻은 아니다.

### 4. 외부(Third-party) Component

외부 UI 패키지도 상태나 이벤트를 사용하면 Client Component 경계가 필요하다. 수업에서는 `acme-carousel`을 예로 들었다. 패키지에 `'use client'` 표시가 없는 경우, 내 Client Component에서 가져와 사용하거나 별도의 래퍼를 만든다.

```tsx
// 외부 패키지가 설치되어 있고 해당 export를 제공할 때의 래퍼 예시
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

Server Component는 이 래퍼를 import해 렌더링할 수 있다. 페이지 전체에 `'use client'`를 추가할 필요는 없다.

#### 4.1 모듈 오류와 필수 props 오류

| 오류 | 확인할 부분 |
| --- | --- |
| `Cannot find module 'acme-carousel'` | 실행하는 프로젝트의 패키지 설치, import 이름과 경로 |
| `Property 'items' is missing` | 실제 패키지 타입에서 필수로 정한 props |
| import한 export가 없다는 오류 | default export와 named export 구분 |
| 동작하지만 이미지 배치가 깨짐 | 패키지 스타일 import와 CSS 경로 |

모듈을 찾지 못하는 오류와 props가 빠진 오류는 서로 다르다. 설치가 끝났어도 필수 데이터를 넘기지 않으면 타입 오류가 남는다.

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

`items`의 각 요소는 식별자 `id`, 이미지 주소 `src`, 대체 텍스트 `alt`를 갖는다. `isOpen`이 참일 때만 캐러셀을 렌더링한다. 첨부된 실습의 `LocalCarousel`은 이 데이터 전달 방식을 연습하는 로컬 구현이다. 외부 패키지 전체 기능이나 API를 복제한 것은 아니다.

#### 4.3 CSS와 export 확인

첨부 자료에서는 `acme-carousel/dist/styles.css`를 가져오는 과정의 오류와, 로컬 스타일 파일을 import하는 해결 과정을 정리했다. 실제 패키지를 사용할 때는 설치된 버전의 `exports`, 타입 선언, 스타일 경로를 확인한다.

```tsx
import './styles.css';
```

Named export는 중괄호를 사용하고, default export는 중괄호 없이 가져온다.

```tsx
// 패키지가 제공하는 export 형태를 먼저 확인한다.
import { Carousel } from 'acme-carousel';
import Slide from 'acme-carousel';
```

위 `Slide` 구문은 첨부된 강의 정리의 예시다. 모든 버전에서 동일하다고 가정하지 않는다. 캐러셀의 인덱스·자동 재생·내비게이션·페이지 표시·터치·반응형 옵션도 해당 라이브러리의 타입과 문서를 기준으로 사용한다.

참고: [11주차 대조 기록](docs/SOURCES.md#2026-11-18-날짜별-대조) · [첨부 11월 11일 정리](docs/lecture-materials/nov11/11월11일_강의_전체_정리.md)

---

## 2026-11-04 (Week 10)

### 1. Server에서 Client로 데이터 전달

Server Component에서 조회한 값을 Client Component의 props로 전달한다. 지난 시간의 글 상세 페이지가 `likes`를 넘기고, LikeButton이 이를 state의 초기값으로 사용하는 구조다.

```tsx
// Server Component 내부
const post = posts.find((item) => item.id === id);
if (!post) notFound();

return <LikeButton key={post.id} likes={post.likes} />;
```

Client Component 경계를 넘는 값은 React가 직렬화할 수 있어야 한다. 직렬화는 메모리의 구조를 전송 가능한 표현으로 바꾸는 과정이고, 받는 쪽에서는 이를 다시 해석한다.

- 문자열·숫자·불리언과 지원되는 배열·객체 등을 전달할 수 있다.
- 일반 이벤트 콜백을 서버에서 만들어 Client Component의 `onClick`에 그대로 전달할 수는 없다. 클릭 로직은 클라이언트 쪽에 둔다.
- React의 직렬화 범위는 단순히 `JSON.stringify`가 가능한 값만을 뜻하지 않는다. Server Function 참조 등에는 별도 규칙이 있다.
- 비동기 데이터를 Promise로 전달하고 `use`로 읽는 스트리밍 패턴도 있다. 이번 실습은 조회 결과를 props로 전달하는 방식이다.

### 2. Server / Client Component Interleaving

여기서 인터리빙은 Server Component와 Client Component를 한 화면에 조합하는 패턴이다. 서버에서 준비한 UI를 Client Component의 `children` 자리에 넣는다.

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

`children`은 서버에서 구성한 내용을 끼워 넣을 공간이다.

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

두 컴포넌트를 조합하는 `page.tsx`가 Server Component라는 점이 중요하다. `ClientLayout.tsx`에서 서버 전용 모듈을 import해서 실행하는 방식과 구분한다. 서버는 `ServerContent`의 결과를 준비하고, ClientLayout은 받은 내용을 자신의 화면 안에 배치한다.

### 3. Context와 Props Drilling

깊은 하위 컴포넌트에서 테마를 쓰려면 중간 컴포넌트들이 쓰지도 않는 props를 계속 전달해야 할 수 있다. 이런 전달이 반복되는 것이 Props Drilling이다.

Context는 Provider 아래에서 공통 값을 읽는 방법이다. 테마·언어·사용자 정보처럼 여러 위치에서 필요한 데이터에 사용할 수 있다. 모든 상태를 Context로 올릴 필요는 없으며, 한 컴포넌트만 사용하는 값은 로컬 state로 두어도 된다.

| 구성 | 역할 |
| --- | --- |
| `createContext` | 공유할 값의 Context 정의 |
| `useState` | Provider 안에서 변경 가능한 상태 관리 |
| `Context.Provider` | 하위 트리에 실제 value 제공 |
| `useContext` | 가장 가까운 Provider의 value 읽기 |

Server Component에서 클라이언트 Context를 직접 읽지는 않는다. 상태와 Context를 담당하는 Provider는 Client Component로 만들고, Server Layout에서 렌더링한다.

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

Provider의 `value`에는 현재 상태와 상태 변경 함수를 함께 넣는다. 소비자는 Provider의 state를 직접 수정하는 대신 제공받은 함수를 호출한다. 이 함수는 클라이언트 Provider 안에서 만들어지므로 서버에서 일반 함수를 직렬화해 보내는 상황과 다르다.

### 5. RootLayout 연결과 확인

```text
RootLayout (Server)
└─ ThemeProvider (Client: theme 관리)
   ├─ ThemeStatus (Client: 값을 읽고 버튼 표시)
   └─ 페이지 children (Server에서 구성 가능)
      └─ ClientLayout
         └─ ServerContent의 렌더링 결과
```

헤더에 ThemeStatus를 두고 Provider 안에 공통 화면을 배치한다. 테마 버튼을 눌렀을 때 버튼의 글자뿐 아니라 `html`의 `data-theme`와 페이지 색상까지 바뀌는지 확인한다. 새 문서를 불러오면 메모리의 state는 초기화되며, 별도 저장 로직이 없다면 테마도 초기값으로 돌아간다.

참고: [10주차 대조 기록](docs/SOURCES.md#2026-11-18-날짜별-대조) · [첨부 11월 4일 정리](docs/lecture-materials/nov11/11월4일_강의_구간별_총정리.md)

---

## 2026-10-28 (Week 9)

### 1. Client JavaScript Bundle 크기 줄이기

화면 전체를 Client Component로 만들기보다 상태와 이벤트가 필요한 부분을 분리한다. `'use client'` 경계 아래로 import한 모듈은 클라이언트 번들에 포함될 수 있으므로, 경계를 크게 잡을수록 브라우저가 받아야 할 코드가 늘어난다.

```text
Layout (Server)
├─ Logo (정적인 표시)
├─ Navigation
└─ Search (Client: 입력 상태·이벤트)
```

Search에 입력 상태가 필요하더라도 Layout 전체를 Client Component로 바꿀 필요는 없다. Logo를 서버에 두는 이유는 중요도가 낮아서가 아니라 클라이언트 상태와 이벤트가 필요하지 않기 때문이다. Server Component로 바꾼다고 이미지 파일의 크기 자체가 줄어드는 것은 아니다.

### 2. Counter 컴포넌트와 페이지

재사용할 UI 조각은 `components`에 두고, URL에 연결할 페이지는 `app/counter/page.tsx`에 둔다.

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

페이지는 서버에서 구성하고 클릭할 때 바뀌는 부분만 클라이언트에서 처리한다. 각 자료의 초기 숫자는 0·5·12 등으로 다르지만, `useState`와 함수형 업데이트를 연결하는 흐름은 같다.

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

`src/app/[id]/page.tsx`는 `await params`로 id를 읽고 해당 글을 찾는다. 서버에서 찾은 글의 `likes`를 Client Component로 넘긴다.

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

`key={post.id}`는 다른 글로 이동했을 때 좋아요의 로컬 상태도 새 글 기준으로 시작하게 한다. `useState(likes)`는 매 렌더링마다 props로 state를 덮어쓰는 코드가 아니다.

### 4. 좋아요 상태와 공통 메뉴

LikeButton은 초기 숫자를 받은 뒤 클릭하면 즉시 1을 더한다. `isLiking`이 참인 동안 버튼을 비활성화하고, 수업용 지연 뒤 다시 활성화한다. 자료의 예제에는 실제 저장 API가 없으므로 새로고침하면 서버의 초기값이 다시 표시된다.

공통 메뉴는 RootLayout에 둔다. 글 데이터의 id와 href를 동일하게 맞춰야 한다.

```tsx
<nav>
  <Link href="/counter">Counter</Link>
  <Link href="/nextjs">nextjs</Link>
  <Link href="/routing">routing</Link>
  <Link href="/ssr-ssg">ssr-ssg</Link>
  <Link href="/dynamic-routes">dynamic-routes</Link>
</nav>
```

폴더가 `[id]`여도 실제 값은 숫자일 필요가 없다. `nextjs` 같은 문자열로 데이터를 찾을 수 있다. 배열에 없는 id는 `notFound()`로 처리한다.

참고: [9주차 대조 기록](docs/SOURCES.md#2026-11-18-날짜별-대조)

---

## 2026-10-14 (Week 7)

### 1. Server Component와 Client Component의 역할

서버에서는 게시글을 조회하고, 브라우저에서는 좋아요 클릭과 상태 변경을 처리하는 예제를 작성했다. 화면을 구성하는 페이지와 상호작용을 담당하는 버튼의 역할을 나눠 보는 실습이다.

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

- `count`: 초기 좋아요 수와 현재 화면에 표시할 숫자다.
- `isLiking`: 요청 또는 수업용 지연을 처리 중인지 나타낸다.
- 처리 중에는 `disabled={isLiking}`로 반복 클릭을 막고 로딩 표시를 연결할 수 있다.
- 실제 서비스에서는 요청 성공·실패를 모두 처리하고 마지막에 대기 상태를 해제해야 한다.

### 3. Falsy와 Null 병합 연산자

Falsy는 Boolean 문맥에서 거짓으로 평가되는 값이다. 대표적으로 `false`, `0`, `-0`, `0n`, 빈 문자열, `null`, `undefined`, `NaN`이 있다. 빈 배열과 빈 객체는 truthy다.

`||`는 왼쪽이 falsy이면 오른쪽을 선택한다. `??`는 왼쪽이 `null` 또는 `undefined`일 때만 오른쪽을 선택한다.

```ts
0 || 10;          // 10
0 ?? 10;          // 0
'' || '기본값';    // '기본값'
'' ?? '기본값';    // ''
undefined ?? 0;   // 0
```

좋아요 수가 0인 것은 정상적인 데이터이므로 `likes ?? 0`처럼 값이 빠진 경우만 보충한다.

### 4. Optimistic Update와 Pessimistic Update

#### 4.1 낙관적 업데이트

성공할 것으로 예상하고 UI를 먼저 바꾼 뒤 요청 결과를 확인한다. 반응은 빠르지만 실패했을 때 이전 상태를 복구하는 처리가 필요하다.

```text
클릭 → 화면 숫자 증가 → 서버 요청 → 성공하면 유지
                                  실패하면 복구·오류 표시
```

#### 4.2 비관적 업데이트

요청이 성공한 뒤에 UI를 바꾼다. 응답 전까지 로딩 표시가 필요하고, 사용자는 기다려야 한다. 성공 응답을 기준으로 반영해도 네트워크 실패나 동시 수정 가능성까지 자동으로 사라지는 것은 아니다.

| 비교 | 낙관적 업데이트 | 비관적 업데이트 |
| --- | --- | --- |
| 화면 변경 | 응답 전에 먼저 반영 | 성공 응답 뒤 반영 |
| 체감 반응 | 빠름 | 응답 시간에 영향받음 |
| 실패 대응 | 임시 변경 취소·오류 안내 | 기존 값 유지·오류 안내 |
| 구현 시 주의 | rollback과 중복 요청 | 대기 상태와 중복 요청 |

수업의 LikeButton은 로컬 state를 즉시 증가시키고 잠깐 비활성화하는 형태다. 실제 저장·실패 응답을 처리하지 않으므로 완전한 서버 연동 예제와는 구분한다. 응답이 늦다는 이유만으로 자동 rollback되는 것도 아니며, 실패·시간 초과 처리 코드를 직접 작성해야 한다.

### 5. RSC Payload와 최초 로딩

서버는 라우트의 layout과 page를 렌더링하며, Server Component 결과를 RSC Payload로 만든다. Payload에는 서버에서 준비한 결과, Client Component의 위치와 모듈 참조, 경계를 넘어 전달할 props가 담긴다.

처음 접속했을 때는 다음 흐름을 따른다.

1. HTML로 우선 화면을 보여준다.
2. RSC Payload로 서버·클라이언트 컴포넌트 트리를 연결한다.
3. 클라이언트 JavaScript가 hydration을 수행해 이벤트와 상태를 연결한다.

Hydration은 서버가 만든 정적인 화면을 브라우저에서 상호작용할 수 있도록 연결하는 과정이다. Client Component도 최초 화면의 HTML 생성에 참여할 수 있으므로, `'use client'`가 서버에서 아무것도 렌더링하지 않는다는 뜻은 아니다.

수업 자료에는 JSON과 바이너리의 비교도 나온다. 여기서는 RSC를 React 전용 직렬화 스트림으로 이해한다. 단순 JSON 응답과 같지 않으며, 모든 내용을 순수 이진 데이터라고 단정하거나 항상 JSON보다 빠르다고 일반화하지 않는다.

### 6. 후속 내비게이션과 use client 경계

Link로 이동할 때는 미리 가져오거나 캐시한 RSC Payload를 활용할 수 있다. 매번 전체 문서를 새로 받는 방식과 달리 필요한 화면을 갱신하며, 유지되는 레이아웃의 상태도 활용한다.

```tsx
'use client';

import { useState } from 'react';
```

지시문은 import보다 앞에 둔다. 이 경계 아래로 import한 모듈은 클라이언트 번들의 일부가 된다. 다만 서버 부모가 만들어 `children`으로 넘긴 UI까지 Client Component로 바뀌는 것은 아니다. 이 차이는 10주차의 인터리빙에서 다시 확인한다.

참고: [7주차 대조 기록](docs/SOURCES.md#2026-11-18-날짜별-대조)

---

## 2026-10-07 (Week 6)

### 1. generateStaticParams 실습

동적 세그먼트의 값을 빌드 시점에 알고 있다면 `generateStaticParams`로 미리 만들 경로를 전달한다.

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

`map()`이 HTML을 직접 만드는 것은 아니다. `map()`은 필요한 경로 목록을 만들고, 실제 페이지 생성은 Next.js의 빌드 과정이 담당한다.

| 반환한 값 | 대응하는 경로 |
| --- | --- |
| `{ slug: "nextjs" }` | `/blog3/nextjs` |
| `{ slug: "routing" }` | `/blog3/routing` |
| `{ slug: "ssr-ssg" }` | `/blog3/ssr-ssg` |

결과물의 실제 파일 위치와 형식은 빌드·배포 설정에 따라 달라지므로 항상 `/경로/index.html`이 생성된다고 보지는 않는다.

#### 1.2 generateStaticParams가 없는 경우와 있는 경우

| 비교 | 없는 경우 | 있는 경우 |
| --- | --- | --- |
| 경로 목록 | 빌드에 사전 생성 목록을 제공하지 않음 | 반환한 params 목록을 빌드에 제공 |
| 수업 예제의 렌더링 | `/blog2/[slug]`는 요청 시 처리 | `/blog3/[slug]`의 알려진 글은 빌드 시 생성 |
| 첫 요청 | 서버에서 해당 글의 화면을 준비 | 미리 준비된 결과를 제공 가능 |
| 추가 slug | 요청 때 데이터 존재 여부 확인 | `dynamicParams` 등 설정에 따라 추가 경로 처리 |

두 방식 모두 서버에서 HTML을 제공할 수 있다. 정적 생성만 SEO가 가능한 것은 아니며, 실제 속도와 캐시 동작은 데이터 요청·설정에 따라 달라진다. 함수를 추가하더라도 요청 전용 API를 사용하는 부분까지 자동으로 정적 결과가 되지는 않는다.

---

### 2. await이 없어도 async를 붙여 두는 이유

Server Component는 비동기 함수로 작성할 수 있다. 현재는 더미 배열에서 값을 찾더라도 나중에 API나 DB 조회가 추가될 수 있어 수업 예제에서는 `async` 형태를 사용한다.

- **일관성**: 데이터 조회 페이지의 함수 형태를 맞춘다.
- **확장성**: `await fetch(...)`나 비동기 DB 호출을 추가하기 쉽다.
- **Promise 지원**: Server Component는 Promise를 반환하는 비동기 렌더링을 지원한다.

```tsx
export default async function Page() {
  return <h1>Blog</h1>;
}
```

`async`는 모든 서버 컴포넌트에 필수인 규칙은 아니다. 비동기 처리가 없다면 일반 함수도 사용할 수 있다. Client Component 자체는 async 함수로 만들지 않는다.

---

### 3. Navigation이 느려지는 경우 — 이어서

#### 2.3 느린 네트워크

정적·동적 경로 모두 네트워크가 느리면 클릭 전에 프리페칭이 끝나지 않을 수 있다. `loading.tsx`도 아직 도착하지 않았다면 즉시 표시하기 어렵다.

이때 `useLinkStatus`로 클릭한 링크의 이동 상태를 보여줄 수 있다.

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

`useLinkStatus`는 반드시 `Link`의 하위 컴포넌트에서 사용한다. 이미 프리페칭된 경로는 pending 단계가 짧거나 생략될 수 있다.

##### 로딩 표시의 깜빡임 줄이기

100ms 정도의 표시 지연을 주면 빠르게 끝나는 이동에서 스피너가 잠깐 나타났다 사라지는 현상을 줄일 수 있다. 표시 영역을 미리 확보하면 텍스트 위치도 흔들리지 않는다.

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

#### 2.4 프리페칭 비활성화

링크가 많은 테이블이나 목록에서는 사용하지 않을 경로까지 미리 가져오는 비용이 생길 수 있다. `prefetch={false}`를 지정하면 해당 링크의 자동 프리페칭을 끈다.

```tsx
<Link href="/blog" prefetch={false}>Blog</Link>
```

- 정적 경로도 클릭 후 가져와야 하므로 대기가 생길 수 있다.
- 동적 경로는 서버의 렌더링 결과를 기다릴 수 있다.
- 로딩 UI나 링크 상태 표시로 진행 중임을 알려줄 수 있다.

##### Hover Prefetching

마우스를 올린 링크만 프리페칭하도록 하면 방문 가능성이 높은 경로에 요청을 집중할 수 있다.

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

`null`은 기본 프리페칭 동작으로 되돌린다. 키보드로 접근할 때도 적용되도록 포커스 이벤트를 함께 처리할 수 있다.

##### Manual Prefetching

`useRouter()`의 `router.prefetch(href)`로 직접 프리페칭할 수도 있다. 일부 수업 자료의 `useEffect` 예제는 마운트 때 프리페칭하고 `onInvalidate`로 다시 요청하는 형태다. 호버했을 때만 실행하는 예제와 구분한다. 이동 자체는 `Link`를 사용하면 새 탭 열기와 키보드 조작 등 기본 링크 동작을 유지하기 쉽다.

---

#### 2.5 Hydration이 완료되지 않은 경우

Hydration은 서버가 생성한 HTML에 클라이언트 JavaScript를 연결해 상호작용을 가능하게 하는 과정이다. `Link`의 클라이언트 기능도 hydration 이후 동작하므로 초기 JS가 크면 프리페칭 시작이 늦어질 수 있다.

- React의 선택적 hydration으로 필요한 부분을 우선 처리한다.
- 큰 의존성이 어디에 포함되는지 번들을 분석한다.
- 브라우저에서 실행할 필요가 없는 로직은 Server Component로 옮긴다.
- 상호작용이 필요한 부분만 작은 Client Component로 나눈다.

##### @next/bundle-analyzer

수업에서는 번들에 포함된 모듈과 크기를 확인하기 위해 `@next/bundle-analyzer`를 사용한다.

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

이 플러그인은 Webpack용이다. Next.js 16에서 분석할 때는 Webpack 빌드를 명시한다.

```powershell
$env:ANALYZE = "true"
try { npm.cmd run build -- --webpack }
finally { Remove-Item Env:ANALYZE }
```

분석기가 의존성을 자동으로 제거하지는 않는다. 결과를 보고 불필요한 의존성을 제거하거나 로딩 방식을 바꾸는 작업은 직접 해야 한다.

---

### 4. Server Component & Client Component

서버와 브라우저는 사용할 수 있는 기능이 다르다. 필요한 작업이 어느 환경에 속하는지에 따라 컴포넌트를 나눈다.

#### 4.1 Client Component를 사용하는 경우

- state와 `onClick`, `onChange` 같은 이벤트 처리
- `useEffect` 등 클라이언트 생명주기 로직
- `window`, `localStorage`, `navigator.geolocation` 등 브라우저 API
- 위 기능에 의존하는 사용자 정의 Hook

파일 상단에 `'use client'`를 선언한다. 브라우저 API는 적절한 이벤트나 effect 안에서 접근한다. Client Component도 초기 HTML 생성에 참여할 수 있으므로 서버 렌더링 중 무조건 `window`를 사용할 수 있는 것은 아니다.

#### 4.2 Server Component를 사용하는 경우

- 서버에서 DB나 API 데이터를 조회할 때
- API key, token 등을 브라우저에 전달하지 않고 사용할 때
- 클라이언트로 보내는 JavaScript 양을 줄일 때
- 초기 콘텐츠를 준비하고 점진적으로 스트리밍할 때

`page`와 `layout`은 기본적으로 Server Component다. 서버에서 준비한 데이터 중 화면에 필요한 값만 클라이언트 컴포넌트에 전달한다. 서버에서 사용한 비밀 값을 props나 HTML에 넣으면 노출되므로 포함하지 않는다.

---


### 5. Native History API

`window.history.pushState`는 브라우저 기록을 추가하고, `replaceState`는 현재 기록을 바꾼다. Next.js App Router에서 URL 상태를 갱신할 때 사용할 수 있으며 `usePathname`·`useSearchParams`와 연결된다.

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

이 방식은 전체 문서를 새로 요청하는 이동과 다르다. 서버에서 데이터를 다시 조회해야 하는 화면 전환에는 Link나 router의 이동 기능이 적절한지 함께 확인한다.

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

첫 번째 `{ params }`는 전달받은 객체에서 값을 꺼내는 구조 분해다. 콜론 뒤 `{ params: Promise<{ slug: string }> }`는 그 매개변수의 TypeScript 타입이다. 바깥 Promise는 비동기로 받을 객체를, 안쪽 `slug: string`은 그 객체 속성의 타입을 나타낸다.

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
