import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../posts";

// 수업용 고정 데이터 4개의 경로를 빌드 시 생성합니다.
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><Link href="/blog">목록으로 돌아가기</Link></p>
    </article>
  );
}