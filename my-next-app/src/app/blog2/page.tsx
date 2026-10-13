import Link from "next/link";
import { posts } from "../blog/posts";
import LoadingIndicator from "../ui/loading-indicator";

export default function Blog2Page() {
  return (
    <>
      <h1>Blog2 · 요청 시점 렌더링</h1>
      <p>generateStaticParams 없이 params로 글을 찾습니다. 링크 이동 상태는 느린 네트워크에서 확인할 수 있습니다.</p>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog2/${post.slug}`} prefetch={false}>
              {post.title}<LoadingIndicator />
            </Link>
          </li>
        ))}
      </ul>
      <p><Link className="text-link" href="/blog3">정적 생성 예제와 비교하기</Link></p>
    </>
  );
}
