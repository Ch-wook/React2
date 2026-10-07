export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <h1>본문을 준비하고 있습니다…</h1>
      <p>공통 메뉴는 그대로 사용할 수 있습니다.</p>
      <div className="loading-bar" aria-hidden="true" />
      <div className="loading-bar" aria-hidden="true" />
    </div>
  );
}