import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Ch-wook | Next.js 수업 노트", template: "%s | Ch-wook" },
  description: "라우팅부터 페이지 전환까지, 코드로 복습하는 Next.js 수업 기록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#content">본문으로 이동</a>
        <header className="site-header">
          <p className="eyebrow">CH-WOOK / REACT2</p>
          <nav aria-label="주 메뉴">
            <Link href="/">홈</Link>
            <Link href="/about">레이아웃</Link>
            <Link href="/blog">블로그</Link>
            <Link href="/products">검색 매개변수</Link>
            <Link href="/streaming" prefetch={false}>스트리밍</Link>
          </nav>
        </header>
        <main id="content" className="site-main">{children}</main>
        <footer className="site-footer">Next.js 수업 기록 · 2026년 1–5주차</footer>
      </body>
    </html>
  );
}