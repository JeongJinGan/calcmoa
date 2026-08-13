import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getGuideRelatedTool, guides } from "@/lib/guides";
import GuideBody from "@/components/guide/GuideBody";
import GuideToolCta from "@/components/guide/GuideToolCta";
import CafeBanner from "@/components/tool/CafeBanner";
import BlogBanner from "@/components/tool/BlogBanner";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedTool = getGuideRelatedTool(guide);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/guide" className="text-xs text-neutral-400 hover:text-blue-500">
        ← 가이드 목록으로
      </Link>
      <header className="mt-2 mb-6">
        <p className="text-xs font-medium text-neutral-400">{guide.updatedLabel}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          {guide.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{guide.description}</p>
      </header>

      <GuideBody blocks={guide.blocks} />

      {relatedTool && <GuideToolCta tool={relatedTool} />}

      <CafeBanner />
      <BlogBanner />
    </div>
  );
}
