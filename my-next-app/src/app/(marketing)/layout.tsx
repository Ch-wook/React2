export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-box">
      <p className="eyebrow">Marketing Layout · 그룹 공통 영역</p>
      {children}
    </div>
  );
}