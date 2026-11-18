import LikeButton from '@/ui/LikeButton';
import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// [id]는 동적 경로이며 params를 await해서 읽습니다.
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 서버에서 게시글 데이터를 검색합니다.
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <article className="stack">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Server Component -> Client Component로 초기 likes 전달 */}
      <LikeButton key={post.id} likes={post.likes} />
      <p className="muted">좋아요는 이 화면에서만 증가하며 새로고침하면 초기값으로 돌아갑니다.</p>
      <Link href="/">게시글 목록으로 돌아가기</Link>
    </article>
  );
}
