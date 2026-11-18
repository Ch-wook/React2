import Counter from '@/components/Counter';

// Server Component에서 Client Component를 불러오는 예제
export default function CounterPage() {
  return (
    <section className="stack">
      <h1>Counter Page</h1>
      <Counter />
    </section>
  );
}
