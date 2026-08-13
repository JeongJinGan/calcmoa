import Link from "next/link";
import { categories, getToolsByCategory, siteConfig } from "@/lib/tools";
import { guides } from "@/lib/guides";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white dark:border-white/5 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <div key={category}>
              <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{category}</p>
              <ul className="space-y-2">
                {getToolsByCategory(category).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${tool.slug}`}
                      className="text-sm text-neutral-500 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                    >
                      {tool.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">가이드</p>
            <ul className="space-y-2">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guide/${guide.slug}`}
                    className="text-sm text-neutral-500 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                  >
                    {guide.emoji} {guide.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-black/5 pt-6 text-xs leading-relaxed text-neutral-500 dark:border-white/5 dark:text-neutral-500">
          <p>
            {siteConfig.name}의 모든 계산 결과는 이해를 돕기 위한 참고용 추정치이며, 법적·세무적 효력이 없습니다.
            실제 금액은 관련 법령, 회사 규정 또는 금융기관의 산정 기준에 따라 달라질 수 있으니 정확한 값은 국세청,
            고용노동부, 금융회사 등 공식 기관을 통해 확인하시기 바랍니다.
          </p>
          <p className="mt-2 flex items-center gap-3">
            <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
            <Link href="/privacy" className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
