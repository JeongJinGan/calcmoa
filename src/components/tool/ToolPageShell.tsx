import { ReactNode } from "react";
import FaqSection, { FaqItem } from "@/components/tool/FaqSection";
import InfoSection, { InfoBlock } from "@/components/tool/InfoSection";
import RelatedTools from "@/components/tool/RelatedTools";
import CafeBanner from "@/components/tool/CafeBanner";
import BlogBanner from "@/components/tool/BlogBanner";
import ShareButton from "@/components/tool/ShareButton";

interface ToolPageShellProps {
  slug: string;
  title: string;
  description: string;
  calculator: ReactNode;
  infoBlocks: InfoBlock[];
  faqs: FaqItem[];
  wide?: boolean;
}

export default function ToolPageShell({
  slug,
  title,
  description,
  calculator,
  infoBlocks,
  faqs,
  wide = false,
}: ToolPageShellProps) {
  return (
    <div className={`mx-auto px-4 py-8 ${wide ? "max-w-4xl" : "max-w-3xl"}`}>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
      </header>

      {calculator}

      <ShareButton title={title} text={description} path={`/${slug}`} />
      <CafeBanner />
      <BlogBanner />

      <InfoSection blocks={infoBlocks} />

      <FaqSection items={faqs} />
      <RelatedTools slug={slug} />
    </div>
  );
}
