'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type CarouselItem = {
  id: string;
  src: string;
  alt: string;
};

type LocalCarouselProps = {
  // 강의에서 강조한 것처럼 items는 필수 데이터입니다.
  items: CarouselItem[];
  autoplay?: boolean;
  interval?: number;
};

export default function LocalCarousel({
  items,
  autoplay = false,
  interval = 4000,
}: LocalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % items.length);
    }, Math.max(interval, 1000));

    return () => window.clearInterval(timer);
  }, [isPlaying, interval, items.length]);

  if (items.length === 0) {
    return <p className="gallery-empty">표시할 이미지가 없습니다.</p>;
  }

  const activeIndex = currentIndex % items.length;
  const currentItem = items[activeIndex];

  const goPrevious = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setCurrentIndex((current) => (current + 1) % items.length);
  };

  return (
    <section className="lecture-carousel" aria-label="이미지 캐러셀" aria-roledescription="캐러셀">
      <div className="lecture-carousel__image-wrap">
        <Image
          className="lecture-carousel__image"
          src={currentItem.src}
          alt={currentItem.alt}
          width={800}
          height={600}
          unoptimized
        />
        <span className="lecture-carousel__counter">
          {activeIndex + 1} / {items.length}
        </span>
      </div>

      <div className="lecture-carousel__controls">
        <button type="button" onClick={goPrevious} aria-label="이전 이미지">
          ← 이전
        </button>
        <div className="lecture-carousel__dots" aria-label="슬라이드 선택">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번 이미지 보기`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={goNext} aria-label="다음 이미지">
          다음 →
        </button>
      </div>
      {items.length > 1 && (
        <button type="button" className="theme-button" onClick={() => setIsPlaying((playing) => !playing)} aria-pressed={isPlaying}>
          {isPlaying ? '자동 재생 멈추기' : '자동 재생 시작'}
        </button>
      )}
      <p className="gallery-caption" aria-live={isPlaying ? 'off' : 'polite'}>{currentItem.alt}</p>
    </section>
  );
}
