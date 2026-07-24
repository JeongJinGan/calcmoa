import Link from "next/link";
import { categories, getToolsByCategory, siteConfig } from "@/lib/tools";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-neutral-950/90 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
          <span aria-hidden>🧮</span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden gap-5 md:flex">
          {categories.map((category) => (
            <div key={category} className="group relative">
              <span className="cursor-default text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {category}
              </span>
              <div className="invisible absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-black/10 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900">
                {getToolsByCategory(category).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {tool.emoji} {tool.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-black/5 px-4 py-2 md:hidden">
        {categories.flatMap((category) => getToolsByCategory(category)).map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="whitespace-nowrap rounded-full border border-black/10 px-3 py-1 text-xs text-neutral-700 dark:border-white/10 dark:text-neutral-200"
          >
            {tool.shortTitle}
          </Link>
        ))}
      </nav>
    </header>
  );
}
