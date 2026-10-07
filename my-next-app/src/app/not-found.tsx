import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소를 확인하거나 <Link className="text-link" href="/">홈으로 돌아가세요</Link>.</p>
    </>
  );
}