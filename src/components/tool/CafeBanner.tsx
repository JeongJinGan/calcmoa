import { siteConfig } from "@/lib/tools";

export default function CafeBanner() {
  return (
    <a
      href={siteConfig.cafeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-500/20 dark:bg-blue-500/10"
    >
      <div>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          계산 결과, 다른 사람들과 비교해보세요
        </p>
        <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
          계산모아 네이버 카페에서 재테크 정보도 함께 나눠요
        </p>
      </div>
      <span className="whitespace-nowrap rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25">
        카페 가입 →
      </span>
    </a>
  );
}
