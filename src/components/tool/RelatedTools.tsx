import Link from "next/link";
import { getRelatedTools } from "@/lib/tools";

export default function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">관련 계산기</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/5 dark:bg-neutral-900 dark:hover:border-blue-500/30"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
              {tool.emoji}
            </div>
            <div className="mt-2 font-semibold text-neutral-800 dark:text-neutral-200">{tool.shortTitle}</div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
