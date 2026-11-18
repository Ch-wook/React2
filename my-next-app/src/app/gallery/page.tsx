import Gallery from '@/components/gallery/Gallery';

export default function GalleryPage() {
  return (
    <section className="stack">
      <h1>Third-party Component 실습</h1>
      <p>
        이 페이지는 Server Component입니다. 사용자 상호작용이 필요한 Gallery는
        Client Component로 분리해 불러옵니다.
      </p>
      <Gallery />
    </section>
  );
}
