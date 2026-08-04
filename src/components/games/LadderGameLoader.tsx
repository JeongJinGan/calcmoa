"use client";

import dynamic from "next/dynamic";

const LadderGame = dynamic(() => import("@/components/games/LadderGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none">
      <p className="text-sm text-neutral-400">사다리를 준비하는 중...</p>
    </div>
  ),
});

export default function LadderGameLoader() {
  return <LadderGame />;
}
