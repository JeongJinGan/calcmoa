import Link from "next/link";
import ShareButton from "@/components/tool/ShareButton";
import ClawMachineGameLoader from "@/components/games/ClawMachineGameLoader";

export const dynamic = "force-dynamic";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function ClawMachineRoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <Link href="/claw-machine" className="text-xs text-neutral-400 hover:text-blue-500">
          ← 인형뽑기 메인으로
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
            🧸 인형뽑기 방
          </h1>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {roomId}
          </span>
        </div>
        <ShareButton
          title="같이 인형뽑기 하자!"
          text="실시간으로 함께 인형뽑기 할 사람 모집! 링크 눌러서 바로 참여해요."
          path={`/claw-machine/${roomId}`}
          label="🎮 친구 초대하기"
          copiedLabel="초대 링크가 복사됐어요 ✓"
        />
      </header>

      <ClawMachineGameLoader roomId={roomId} />
    </div>
  );
}
