# Next.js 수업 실습

[날짜별 수업 정리](../RENAME.md) · [자료 출처](../docs/SOURCES.md) · [저장소 안내](../README.md)

## 실행

이 폴더에서 실행합니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

기본 주소는 http://localhost:3000 입니다.

## 실습 파일

| 파일 | 역할 |
| --- | --- |
| `src/app/layout.tsx` | 한국어 루트 레이아웃, 메타데이터, 공통 메뉴 |
| `src/app/(marketing)/about/` | 라우트 그룹과 중첩 레이아웃 |
| `src/app/blog/posts.tsx` | 수업용 게시글 데이터 |
| `src/app/blog/[slug]/page.tsx` | Promise params, generateStaticParams, 없는 글 처리 |
| `src/app/products/page.tsx` | 검색 매개변수 읽기, 중복 키·누락 값 처리 |
| `src/app/streaming/` | 요청 시점 렌더링과 로딩 화면 관찰 |

`/streaming`의 2초 지연은 수업 실습용입니다. 경로가 이미 캐시되면 로딩 표시가 짧아질 수 있습니다. 기본 Link 자동 프리페칭은 프로덕션 실행에서 확인하세요.

## 검사

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

App Router, TypeScript, Tailwind CSS 4를 사용합니다. `@/*`는 `src/*`를 가리킵니다. npm과 `package-lock.json`을 기준으로 설치합니다.
