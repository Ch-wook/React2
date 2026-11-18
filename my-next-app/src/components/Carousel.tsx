'use client';

import { useState } from 'react';

const cards = [
  { title: 'Server Component', content: '서버에서 게시글 데이터와 초기 화면을 준비합니다.' },
  { title: 'Client Component', content: 'useState와 클릭 이벤트를 사용할 수 있습니다.' },
  { title: 'Props', content: '부모에서 자식으로 데이터를 전달합니다.' },
];

// 강의에 링크만 보인 carousel 경로를 위한 간단한 추가 예시입니다.
export default function Carousel() {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  return (
    <section className="stack" aria-label="개념 카드 캐러셀">
      <div className="demo-card" aria-live="polite">
        <p className="muted">{index + 1} / {cards.length}</p>
        <h2>{card.title}</h2>
        <p>{card.content}</p>
      </div>
      <div className="button-row">
        <button type="button" onClick={() => setIndex((v) => (v + cards.length - 1) % cards.length)}>
          ← 이전
        </button>
        <button type="button" onClick={() => setIndex((v) => (v + 1) % cards.length)}>
          다음 →
        </button>
      </div>
    </section>
  );
}
