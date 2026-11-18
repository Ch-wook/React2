// 강의의 src/lib/data.tsx 예제를 재구성한 게시글 목록입니다.
// 실습 편의를 위해 TypeScript 타입과 본문을 보완했습니다.
export type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
};

export const posts: Post[] = [
  {
    id: 'nextjs',
    title: 'Next.js 소개',
    content: 'Next.js는 React 기반의 프레임워크입니다. App Router를 통해 파일 기반 라우팅과 서버 컴포넌트를 사용할 수 있습니다.',
    likes: 10,
  },
  {
    id: 'routing',
    title: 'App Router 알아보기',
    content: 'Next.js의 app 폴더에서 디렉터리와 page.tsx 파일을 이용해 URL 경로를 구성합니다.',
    likes: 3,
  },
  {
    id: 'ssr-ssg',
    title: 'SSR vs SSG',
    content: '서버사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다.',
    likes: 0,
  },
  {
    id: 'dynamic-routes',
    title: '동적 라우팅',
    content: 'Next.js에서는 [id] 또는 [slug] 같은 폴더를 만들어 URL 값을 동적으로 처리합니다.',
    likes: 0,
  },
];
