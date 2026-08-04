"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  path: string;
}

export default function ShareButton({ title, text, path }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${path}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // 사용자가 공유 시트를 취소한 경우 등은 조용히 무시
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근이 막힌 환경이면 조용히 무시
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-500/30 dark:hover:text-blue-400"
    >
      {copied ? "링크가 복사됐어요 ✓" : "🔗 결과 공유하기"}
    </button>
  );
}
