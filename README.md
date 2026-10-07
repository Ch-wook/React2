# React2 · Ch-wook의 Next.js 수업 기록

Next.js 수업의 1–5주차 내용을 정리하고, 라우팅과 페이지 전환 예제를 직접 실행하는 저장소입니다.

- **[날짜별 수업 정리 → RENAME.md](RENAME.md)**
- [참고한 GitHub 주소와 최신 자료 비교](docs/SOURCES.md)
- [실습 앱 안내](my-next-app/README.md)

자료 확인일은 **2026-10-07**, 최신 수업 범위는 **2026-09-30 (5주차)**입니다. 7개 저장소를 비교해 최신 문서와 실습을 현재 프로젝트 구조에 맞춰 통합했습니다. 수업 본문은 `RENAME.md`에 날짜별로 작성했습니다.

| 날짜 | 수업 내용 |
| --- | --- |
| [2026-09-30](RENAME.md#2026-09-30-5주차) | 서버 렌더링, 프리페칭, 스트리밍, 페이지 전환 |
| [2026-09-23](RENAME.md#2026-09-23-4주차) | Link, 중첩 라우트, slug, 검색 매개변수 |
| [2026-09-16](RENAME.md#2026-09-16-3주차) | 프로젝트 구성, Open Graph, 레이아웃 |
| [2026-09-09](RENAME.md#2026-09-09-2주차) | 프로젝트 생성, 폴더·파일 규칙, 동적 경로 |
| [2026-09-02](RENAME.md#2026-09-02-1주차) | Next.js 기초, 라우터, 접근성, 패키지 관리자 |

## 실행하기

프로젝트 루트에서 다음 명령을 실행합니다. 현재 프로젝트는 Node.js 24 환경에서 확인했습니다.

```powershell
cd my-next-app
npm.cmd ci
npm.cmd run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다. 종료하려면 터미널에서 `Ctrl+C`를 누릅니다.

## 실습 경로

| 주소 | 확인할 내용 |
| --- | --- |
| `/` | 수업 실습 목록 |
| `/about` | 라우트 그룹과 중첩 레이아웃 |
| `/blog` | 블로그 목록과 공통 레이아웃 |
| `/blog/nextjs` | 동적 세그먼트, Promise params, 정적 경로 생성 |
| `/products?id=1&name=keyboard` | Promise searchParams와 쿼리 값 처리 |
| `/streaming` | 수업용 2초 지연, loading UI, 스트리밍 |

## 파일 안내

```text
React2/
├─ README.md          시작 안내
├─ RENAME.md          날짜별 수업 정리 본문
├─ RENAMED.md         기존 문서 링크 안내
├─ docs/SOURCES.md    7개 저장소 비교·출처·수정 이유
└─ my-next-app/       실행할 Next.js 앱
   └─ src/app/        페이지·레이아웃·실습 코드
```

## 검사와 프로덕션 실행

`my-next-app` 폴더에서 실행합니다.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

현재 버전은 Next.js 16.3.5, React 19.2.8입니다. 기존 npm 잠금 파일과 TypeScript·Tailwind CSS 4 설정을 유지했습니다. 블로그 글 4개는 빌드 시 미리 생성하고, 검색 매개변수와 스트리밍 페이지는 요청 시점에 렌더링합니다.
