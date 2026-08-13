import Link from "next/link";
import { ToolMeta } from "@/lib/tools";

export default function GuideToolCta({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-500/20 dark:bg-blue-500/10"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xl shadow-sm dark:bg-neutral-900">
          {tool.emoji}
        </span>
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{tool.title}로 바로 계산하기</p>
          <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">{tool.description}</p>
        </div>
      </div>
      <span className="whitespace-nowrap rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25">
        계산기 열기 →
      </span>
    </Link>
  );
}
