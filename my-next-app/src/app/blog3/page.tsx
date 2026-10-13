import Link from "next/link";
import { posts } from "./posts";
import HoverPrefetchLink from "../ui/hover-prefetch-link";

export default function Blog3Page() {
  return (
    <>
      <h1>Blog3 · 빌드 시점 정적 생성</h1>
      <p>generateStaticParams가 글의 경로를 미리 만듭니다. 마우스를 올리거나 키보드로 링크에 포커스하면 프리페칭을 활성화합니다.</p>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <HoverPrefetchLink href={`/blog3/${post.slug}`}>{post.title}</HoverPrefetchLink>
          </li>
        ))}
      </ul>
      <p><Link className="text-link" href="/blog2">요청 시점 예제와 비교하기</Link></p>
    </>
  );
}
