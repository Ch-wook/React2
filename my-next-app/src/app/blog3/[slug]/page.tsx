import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../posts";

// wlswodnjs의 Week 6 예제: params 목록을 빌드 과정에 전달합니다.
export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Blog3Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <p className="eyebrow">BLOG3 / BUILD TIME</p>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><Link href="/blog3">목록으로 돌아가기</Link></p>
    </article>
  );
}
