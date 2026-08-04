import { siteConfig } from "@/lib/tools";

export default function BlogBanner() {
  return (
    <a
      href={siteConfig.blogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md dark:border-green-500/20 dark:bg-green-500/10"
    >
      <div>
        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
          매일 아침, 정책·세금·경제 뉴스 브리핑
        </p>
        <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
          계산모아 블로그에서 오늘의 이슈를 계산으로 확인해보세요
        </p>
      </div>
      <span className="whitespace-nowrap rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-green-500/25">
        블로그 보기 →
      </span>
    </a>
  );
}
