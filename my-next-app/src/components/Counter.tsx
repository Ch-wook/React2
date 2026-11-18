'use client';

import { useState } from 'react';

// 화면에서 확인된 '12 likes'와 'Click me' 예제를 재구성했습니다.
export default function Counter() {
  const [likes, setLikes] = useState(12);

  return (
    <section className="stack">
      <p><strong>{likes}</strong> likes</p>
      <button type="button" className="primary-button" onClick={() => setLikes((value) => value + 1)}>
        Click me
      </button>
    </section>
  );
}
