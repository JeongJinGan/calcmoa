"use client";

import dynamic from "next/dynamic";

const ClawMachineGame = dynamic(() => import("@/components/games/ClawMachineGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none">
      <p className="text-sm text-neutral-400">인형뽑기 기계를 준비하는 중...</p>
    </div>
  ),
});

export default function ClawMachineGameLoader({ roomId }: { roomId: string }) {
  return <ClawMachineGame roomId={roomId} />;
}
