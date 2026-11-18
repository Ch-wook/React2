import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeStatus from "@/components/ThemeStatus";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Ch-wook | Next.js 수업 노트", template: "%s | Ch-wook" },
  description: "라우팅, 서버·클라이언트 컴포넌트, Context와 캐러셀을 복습하는 Next.js 수업 기록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" data-theme="light" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <a className="skip-link" href="#content">본문으로 이동</a>
          <header className="site-header">
            <p className="eyebrow">CH-WOOK / REACT2</p>
            <nav aria-label="주 메뉴">
              <Link href="/">홈</Link>
              <Link href="/about">레이아웃</Link>
              <Link href="/blog">블로그</Link>
              <Link href="/blog2">Blog2</Link>
              <Link href="/blog3">Blog3</Link>
              <Link href="/products">검색 매개변수</Link>
              <Link href="/streaming" prefetch={false}>스트리밍</Link>
              <Link href="/counter">카운터</Link>
              <Link href="/interleaved">컴포넌트 조합</Link>
              <Link href="/carousel">개념 카드</Link>
              <Link href="/gallery">갤러리</Link>
              {/* 일반 문서 이동과 Link를 비교하는 수업용 링크입니다. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/contact">Contact</a>
            </nav>
            <ThemeStatus />
          </header>
          <main id="content" className="site-main">{children}</main>
          <footer className="site-footer">Next.js 수업 기록 · 2026년 11주차까지</footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
