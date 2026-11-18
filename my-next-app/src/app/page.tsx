import Link from "next/link";
import { posts } from "@/lib/data";

const exercises = [
  { href: "/about", title: "01. 화면을 감싸는 순서", description: "Root → Marketing → About 레이아웃을 따라가 봅니다." },
  { href: "/blog", title: "02. URL에서 글 찾기", description: "[slug]와 params로 글을 찾고 정적 경로를 생성합니다." },
  { href: "/products?id=1&name=keyboard", title: "03. 주소에 조건 담기", description: "searchParams로 id와 name을 읽어 화면에 표시합니다." },
  { href: "/streaming", title: "04. 기다리는 동안 보여주기", description: "2초짜리 실습 지연으로 loading.tsx와 페이지 전환을 관찰합니다." },
  { href: "/blog2", title: "05. 요청 시점에 글 찾기", description: "동적 경로와 useLinkStatus의 이동 상태를 확인합니다." },
  { href: "/blog3", title: "06. 미리 만들어 둔 글 보기", description: "정적 경로 생성과 호버 프리페칭을 비교합니다." },
  { href: "/counter", title: "07. 상태로 화면 바꾸기", description: "Client Component의 useState와 클릭 이벤트를 실행합니다." },
  { href: "/interleaved", title: "08. 서버와 클라이언트 조합", description: "서버에서 읽은 내용을 클라이언트 컴포넌트의 children으로 전달합니다." },
  { href: "/carousel", title: "09. 개념 카드 넘기기", description: "인덱스 상태로 카드를 선택하고 이전·다음 이동을 구현합니다." },
  { href: "/gallery", title: "10. 이미지 캐러셀", description: "items 배열, 조건부 렌더링과 이미지 전환을 확인합니다." },
];

export default function Home() {
  return (
    <>
      <p className="eyebrow">NEXT.JS STUDY / 2026</p>
      <h1>읽고, 실행하고,<br />내 말로 정리하기.</h1>
      <p className="intro">폴더가 주소가 되고, 레이아웃이 화면을 감쌉니다. 수업에서 배운 개념을 작은 예제로 연결한 복습 공간입니다.</p>
      <div className="exercise-grid">
        {exercises.map((exercise) => (
          <Link className="exercise-card" href={exercise.href} key={exercise.href} prefetch={exercise.href === "/streaming" ? false : undefined}>
            <h2>{exercise.title}</h2>
            <p>{exercise.description}</p>
            <span>실습 열기 →</span>
          </Link>
        ))}
      </div>
      <section className="lesson-section">
        <h2>Server → Client props와 좋아요 실습</h2>
        <p>글의 초기 좋아요 수를 서버에서 전달합니다. 버튼을 누른 뒤 새로고침해 상태의 차이를 확인해 보세요.</p>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/${post.id}`}>{post.title}</Link>
              {" · "}초기 좋아요 {post.likes}개
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
