export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">자주 묻는 질문</h2>
      <div className="divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:divide-white/5 dark:border-white/5 dark:bg-neutral-900">
        {items.map((item) => (
          <details key={item.question} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-medium text-neutral-800 marker:content-none dark:text-neutral-200">
              <span>
                <span className="mr-2 text-blue-500">Q.</span>
                {item.question}
              </span>
              <span className="mt-0.5 shrink-0 text-neutral-400 transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              <span className="mr-2 text-neutral-400">A.</span>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
