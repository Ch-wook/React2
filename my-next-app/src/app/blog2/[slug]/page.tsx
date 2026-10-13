import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../blog/posts";

// umteahoon의 blog2 예제: generateStaticParams 없이 요청 시 조회합니다.
export default async function Blog2Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <p className="eyebrow">BLOG2 / REQUEST TIME</p>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><Link href="/blog2">목록으로 돌아가기</Link></p>
    </article>
  );
}
