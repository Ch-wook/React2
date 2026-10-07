export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-box">
      <p className="eyebrow">About Layout · 소개 페이지 영역</p>
      {children}
    </div>
  );
}