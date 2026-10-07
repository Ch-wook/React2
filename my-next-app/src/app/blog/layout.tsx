import Link from "next/link";
import { posts } from "./posts";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-box">
      <p className="eyebrow">Blog Layout · 목록과 상세가 공유하는 영역</p>
      <nav className="lesson-nav" aria-label="블로그 글">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug}>{post.title}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}