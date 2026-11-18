import ClientLayout from '@/components/ClientLayout';
import ServerContent from '@/components/ServerContent';

// 11/4 수업 20~33분: Server Component를 Client Component의 children에 전달
export default function InterleavedPage() {
  return (
    <section className="stack">
      <h1>Server / Client Interleaving</h1>
      <p className="muted">이 page.tsx는 Server Component입니다.</p>
      <ClientLayout>
        <ServerContent />
      </ClientLayout>
      <p className="muted">
        부모(Server)가 ClientLayout(Client)을 불러오면서 ServerContent(Server)를
        children으로 전달합니다.
      </p>
    </section>
  );
}
