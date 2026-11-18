'use client';

import { useEffect, useRef, useState } from 'react';

type LikeButtonProps = {
  likes: number;
};

export default function LikeButton({ likes }: LikeButtonProps) {
  // 서버 컴포넌트에서 받은 likes를 클라이언트 상태의 초기값으로 사용
  const [count, setCount] = useState<number>(likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const handleClick = () => {
    if (timer.current !== null) return;

    // Optimistic Update: 서버 요청에 앞서 화면 숫자를 먼저 변경
    setIsLiking(true);
    setCount((c) => c + 1);

    // 강의에서는 실제 서버 저장/API 코드를 주석 예시로만 다뤘습니다.
    // 따라서 이 버튼의 좋아요 개수는 새로고침 시 초기값으로 돌아갑니다.
    timer.current = setTimeout(() => {
      timer.current = null;
      setIsLiking(false);
    }, 300);
  };

  return (
    <button
      type="button"
      className="primary-button"
      onClick={handleClick}
      disabled={isLiking}
      aria-busy={isLiking}
      aria-label={`좋아요 ${count}개`}
    >
      👍 {count}
    </button>
  );
}
