import { siteConfig } from "@/lib/tools";

export default function CafeBanner() {
  return (
    <a
      href={siteConfig.cafeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 transition-colors hover:border-blue-400 dark:border-blue-900 dark:bg-blue-950/30"
    >
      <div>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          계산 결과, 다른 사람들과 비교해보세요
        </p>
        <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
          계산모아 네이버 카페에서 재테크 정보도 함께 나눠요
        </p>
      </div>
      <span className="whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
        카페 가입 →
      </span>
    </a>
  );
}
