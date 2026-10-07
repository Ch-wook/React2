import Link from "next/link";

const exercises = [
  { href: "/about", title: "01. 화면을 감싸는 순서", description: "Root → Marketing → About 레이아웃을 따라가 봅니다." },
  { href: "/blog", title: "02. URL에서 글 찾기", description: "[slug]와 params로 글을 찾고 정적 경로를 생성합니다." },
  { href: "/products?id=1&name=keyboard", title: "03. 주소에 조건 담기", description: "searchParams로 id와 name을 읽어 화면에 표시합니다." },
  { href: "/streaming", title: "04. 기다리는 동안 보여주기", description: "2초짜리 실습 지연으로 loading.tsx와 페이지 전환을 관찰합니다." },
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
    </>
  );
}