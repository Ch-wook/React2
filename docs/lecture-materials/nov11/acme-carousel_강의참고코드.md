# 강의에서 사용한 acme-carousel 패턴 (참고용)

이 파일은 강의 화면에 나온 외부 패키지 사용 예제를 보관하는 참고 문서다.
실행 프로젝트는 로컬 `LocalCarousel`을 사용하므로 이 코드를 그대로 빌드에 포함하지 않는다.

## 1. Gallery 내부에서 사용

```tsx
'use client';

import { useState } from 'react';
import { Carousel } from 'acme-carousel';

const items = [
  { id: '1', src: 'https://picsum.photos/id/1015/800/600', alt: 'Landscape 1' },
  { id: '2', src: 'https://picsum.photos/id/1016/800/600', alt: 'Landscape 2' },
  { id: '3', src: 'https://picsum.photos/id/1018/800/600', alt: 'Landscape 3' },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {isOpen && <Carousel items={items} />}
    </div>
  );
}
```

## 2. Server Component에서 사용하기 위한 Client Wrapper

```tsx
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

Server Component에서는 위 래퍼를 import해 사용한다. 이때도 패키지 타입에서 필수로 지정한 `items`를 전달해야 한다.

## 3. CSS

강의 슬라이드에는 패키지 CSS 경로로 `acme-carousel/dist/styles.css`가 표시되며, 해당 패키지에서 경로 import가 실패하는 경우 스타일 파일을 로컬 컴포넌트 폴더에 복사한 뒤 `import './styles.css'`로 가져오는 방법이 제시됐다.

## 4. export 형태

강의 슬라이드에서는 `Slide`가 default export이므로 다음과 같이 가져오도록 안내했다.

```tsx
import { Carousel } from 'acme-carousel';
import Slide from 'acme-carousel';
```

영상에서는 `Slide`를 사용하는 완성된 화면 코드는 확인되지 않았으므로 실제 프로젝트 실행 코드에는 넣지 않았다.
