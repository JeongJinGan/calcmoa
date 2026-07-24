import { ReactNode } from "react";
import AdSlot from "@/components/ads/AdSlot";
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

      <div className="my-8">
        <AdSlot slotId={process.env[`NEXT_PUBLIC_ADSENSE_SLOT_${slug.toUpperCase().replace(/-/g, "_")}_1`]} />
      </div>

      <section className="prose prose-neutral max-w-none dark:prose-invert prose-sm">{infoContent}</section>

      <div className="my-8">
        <AdSlot slotId={process.env[`NEXT_PUBLIC_ADSENSE_SLOT_${slug.toUpperCase().replace(/-/g, "_")}_2`]} />
      </div>

      <FaqSection items={faqs} />
      <RelatedTools slug={slug} />
    </div>
  );
}
