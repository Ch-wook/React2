'use client';

import { useState } from 'react';
import LocalCarousel, { type CarouselItem } from './LocalCarousel';
import './styles.css';

// 강의 슬라이드에 나온 picsum.photos 더미 이미지 목록을 재구성했습니다.
const items: CarouselItem[] = [
  {
    id: '1',
    src: 'https://picsum.photos/id/1015/800/600',
    alt: 'Landscape 1',
  },
  {
    id: '2',
    src: 'https://picsum.photos/id/1016/800/600',
    alt: 'Landscape 2',
  },
  {
    id: '3',
    src: 'https://picsum.photos/id/1018/800/600',
    alt: 'Landscape 3',
  },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="gallery-demo">
      <div className="gallery-demo__intro">
        <div>
          <h2>이미지 갤러리</h2>
          <p>
            버튼을 누르면 이미지 캐러셀이 나타납니다.
            Gallery는 Client Component이며, items를 Carousel에 전달합니다.
          </p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
        >
          {isOpen ? '사진 닫기' : 'View pictures'}
        </button>
      </div>

      {isOpen ? (
        <LocalCarousel items={items} />
      ) : (
        <p className="gallery-hint">사진 보기를 눌러 캐러셀을 열어보세요.</p>
      )}
    </section>
  );
}
