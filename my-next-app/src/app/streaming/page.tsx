import { connection } from "next/server";

export default async function StreamingPage() {
  // 요청마다 로딩 화면을 관찰하기 위한 수업용 지연입니다.
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <>
      <h1>준비된 화면부터 보여주기</h1>
      <p>2초 동안 loading.tsx가 먼저 표시되고, 준비가 끝나면 이 본문으로 교체됩니다.</p>
      <p>로딩 중에도 상단 메뉴로 다른 페이지에 이동할 수 있습니다. 다시 확인하려면 홈으로 이동한 뒤 스트리밍 실습을 여세요.</p>
    </>
  );
}