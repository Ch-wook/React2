import Link from "next/link";

export default function PostNotFound() {
  return (
    <>
      <h1>게시글을 찾을 수 없습니다</h1>
      <p><Link className="text-link" href="/blog">블로그 목록으로 돌아가기</Link></p>
    </>
  );
}