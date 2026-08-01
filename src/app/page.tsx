import Link from "next/link";
import type { Metadata } from "next";
import { categories, getToolsByCategory, siteConfig } from "@/lib/tools";
import CafeBanner from "@/components/tool/CafeBanner";
import BlogBanner from "@/components/tool/BlogBanner";

export const metadata: Metadata = {
  title: `${siteConfig.name} - 무료 생활·금융 계산기 모음`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          연봉, 퇴직금, 대출, 세금까지
          <br className="hidden sm:block" /> 한 번에 계산하세요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
          회원가입 없이 무료로 바로 사용하는 생활·금융 계산기 모음, {siteConfig.name}입니다.
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-xl">
        <CafeBanner />
        <BlogBanner />
      </div>

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl border border-black/10 bg-white p-6 text-sm leading-relaxed text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
        <h2 className="mb-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          계산모아를 믿고 쓰는 이유
        </h2>
        <p>
          {siteConfig.name}의 모든 계산기는 회원가입이나 개인정보 입력 없이 무료로 바로 사용할 수 있습니다. 입력한
          연봉, 생년월일 등은 서버로 전송되지 않고 이용자의 브라우저 안에서만 계산되며, 각 계산기는 근로기준법,
          소득세법 등 관련 법령과 정부 고시 공식을 기준으로 산출됩니다. 사이트 운영은 광고 수익으로 유지되며, 계산
          결과는 이해를 돕기 위한 참고용 추정치이므로 정확한 금액은 국세청, 고용노동부 등 공식 기관을 통해 다시
          한번 확인하시기 바랍니다.
        </p>
      </section>

      <div className="mt-12 space-y-12">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">{category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getToolsByCategory(category).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="text-3xl">{tool.emoji}</div>
                  <h3 className="mt-3 font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
