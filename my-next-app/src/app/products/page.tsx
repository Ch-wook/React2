import Link from "next/link";

type QueryValue = string | string[] | undefined;

// 같은 키를 여러 번 전달하면 배열이 됩니다. 이 실습에서는 첫 값을 씁니다.
function firstValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: QueryValue; name?: QueryValue }>;
}) {
  const query = await searchParams;
  const id = firstValue(query.id) || "미입력";
  const name = firstValue(query.name) || "미입력";

  return (
    <>
      <h1>주소에서 조건 읽기</h1>
      <p>/products?id=1&amp;name=keyboard처럼 물음표 뒤에 값을 전달합니다.</p>
      <dl className="query-values"><dt>id</dt><dd>{id}</dd><dt>name</dt><dd>{name}</dd></dl>
      <nav className="lesson-nav" aria-label="검색 매개변수 예제">
        <Link href="/products?id=1&name=keyboard">키보드</Link>
        <Link href={{ pathname: "/products", query: { id: "2", name: "마우스" } }}>마우스</Link>
        <Link href="/products">초기화</Link>
      </nav>
      <p>이 값은 서버 페이지에서 searchParams를 await한 결과입니다.</p>
    </>
  );
}