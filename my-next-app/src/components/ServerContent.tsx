// 11/4 수업 - Server Component에서 fetch로 데이터를 조회합니다.
// 화면 속 예제: https://jsonplaceholder.typicode.com/posts/1
import 'server-only';

type SamplePost = { id: number; title: string; body: string };

async function getSamplePost(): Promise<SamplePost> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as SamplePost;
    if (typeof data.title !== 'string') throw new Error('제목이 없는 응답');
    return data;
  } catch {
    // 추가 보완: 인터넷이 차단된 실습 환경에서도 화면이 깨지지 않도록 대체 내용 표시
    return {
      id: 1,
      title: '외부 API에 연결할 수 없어 대체 제목을 보여줍니다.',
      body: 'JSONPlaceholder 요청이 실패했습니다.',
    };
  }
}

export default async function ServerContent() {
  const data = await getSamplePost();
  return <p>서버에서 가져온 제목: {data.title}</p>;
}
