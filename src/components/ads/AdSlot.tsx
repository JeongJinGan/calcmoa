"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

interface AdSlotProps {
  slotId?: string;
  label?: string;
  className?: string;
}

/**
 * 애드센스 승인 전에는 레이아웃 자리만 차지하는 플레이스홀더를 보여주고,
 * NEXT_PUBLIC_ADSENSE_CLIENT 환경변수가 설정되면 실제 광고 단위를 렌더링한다.
 */
export default function AdSlot({ slotId, label = "광고", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slotId || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // 광고 스크립트 로드 전이면 조용히 무시
    }
  }, [slotId]);

  if (ADSENSE_CLIENT && slotId) {
    return (
      <ins
        ref={insRef}
        className={`adsbygoogle block ${className}`}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  return (
    <div
      className={`flex min-h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600 ${className}`}
      aria-hidden
    >
      {label} 영역
    </div>
  );
}
