"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

const NICKNAME_STORAGE_KEY = "calcmoa:claw-machine:nickname";

export default function ClawMachineLanding() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim().slice(0, 12);
    if (!trimmed) return;
    window.sessionStorage.setItem(NICKNAME_STORAGE_KEY, trimmed);
    router.push(`/claw-machine/${nanoid(8)}`);
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/5 dark:bg-neutral-900 dark:shadow-none sm:p-7">
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        닉네임을 입력하고 방을 만들면 전용 링크가 생성됩니다. 친구에게 링크를 공유하면 같은 방에서 실시간으로 함께 인형뽑기를 즐길 수 있어요 (최대 6명).
      </p>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={12}
          placeholder="닉네임을 입력하세요"
          className="flex-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-neutral-800 dark:focus:bg-neutral-800"
        />
        <button
          type="submit"
          className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
        >
          🎮 방 만들기
        </button>
      </form>
    </div>
  );
}
