'use client';

import type { ReactNode } from 'react';

// 11/4 수업 - 화면에 나온 ClientLayout을 바탕으로 재구성
// 서버 컴포넌트는 이 컴포넌트의 children으로 전달할 수 있습니다.
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="client-layout">
      <h2>클라이언트 레이아웃</h2>
      <div className="client-content">{children}</div>
    </div>
  );
}
