import Link from "next/link";
import { categories, getToolsByCategory, siteConfig } from "@/lib/tools";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 dark:bg-neutral-950/80 dark:border-white/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-neutral-900 dark:text-neutral-50">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-base shadow-md shadow-blue-500/30"
          >
            🧮
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {categories.map((category) => (
            <div key={category} className="group relative">
              <span className="cursor-default rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                {category}
              </span>
              <div className="invisible absolute left-0 top-full z-50 min-w-[190px] translate-y-1 rounded-2xl border border-black/5 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/5 dark:bg-neutral-900">
                {getToolsByCategory(category).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="block rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    {tool.emoji} {tool.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-black/5 px-4 py-2.5 dark:border-white/5 md:hidden">
        {categories.flatMap((category) => getToolsByCategory(category)).map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="whitespace-nowrap rounded-full border border-black/5 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-white/5 dark:bg-neutral-800 dark:text-neutral-200"
          >
            {tool.shortTitle}
          </Link>
        ))}
      </nav>
    </header>
  );
}
