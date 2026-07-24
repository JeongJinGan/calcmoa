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
            className="rounded-xl border border-black/10 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/10 dark:hover:bg-blue-950/20"
          >
            <div className="text-2xl">{tool.emoji}</div>
            <div className="mt-2 font-semibold text-neutral-800 dark:text-neutral-200">{tool.shortTitle}</div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
