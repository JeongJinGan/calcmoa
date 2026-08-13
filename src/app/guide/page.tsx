import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { siteConfig } from "@/lib/tools";

export const metadata: Metadata = {
  title: "가이드 - 급여·세금·노동법 실전 정리",
  description: "연봉, 최저임금, 퇴직금 등 계산기만으로는 다 담기 어려운 기준과 절차를 실제 사례와 함께 정리한 가이드 모음입니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          가이드
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {siteConfig.name}의 계산기와 함께 보면 좋은 급여·세금·노동법 기준, 신고 절차를 실제 사례 중심으로 정리했습니다.
        </p>
      </header>

      <div className="space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group block rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/5 dark:bg-neutral-900 dark:hover:border-blue-500/30 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-blue-500/10">
                {guide.emoji}
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-400">{guide.updatedLabel}</p>
                <h2 className="mt-0.5 font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                  {guide.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{guide.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
