import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
  return (
    <>
      <h1>라우팅 복습 노트</h1>
      <p>글을 바꿔도 위쪽 블로그 메뉴는 공통 레이아웃으로 유지됩니다.</p>
      <ol className="post-list">
        {posts.map((post) => (
          <li key={post.slug}><Link className="text-link" href={`/blog/${post.slug}`}>{post.title}</Link></li>
        ))}
      </ol>
    </>
  );
}