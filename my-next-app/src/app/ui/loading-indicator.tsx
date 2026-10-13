"use client";

import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <>
      <span aria-hidden="true" className={`link-hint${pending ? " is-pending" : ""}`} />
      <span className="sr-only" role="status">{pending ? "페이지 이동 중" : ""}</span>
    </>
  );
}
