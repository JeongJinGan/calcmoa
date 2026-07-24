import { ReactNode } from "react";
import FaqSection, { FaqItem } from "@/components/tool/FaqSection";
import RelatedTools from "@/components/tool/RelatedTools";

interface ToolPageShellProps {
  slug: string;
  title: string;
  description: string;
  calculator: ReactNode;
  infoContent: ReactNode;
  faqs: FaqItem[];
}

export default function ToolPageShell({
  slug,
  title,
  description,
  calculator,
  infoContent,
  faqs,
}: ToolPageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      </header>

      {calculator}

      <section className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-sm">{infoContent}</section>

      <FaqSection items={faqs} />
      <RelatedTools slug={slug} />
    </div>
  );
}
