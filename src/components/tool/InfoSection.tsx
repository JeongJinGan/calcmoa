export interface InfoBlock {
  heading: string;
  body: string;
}

export default function InfoSection({ blocks }: { blocks: InfoBlock[] }) {
  return (
    <section className="mt-10">
      <div className="divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:divide-white/5 dark:border-white/5 dark:bg-neutral-900">
        {blocks.map((block) => (
          <div key={block.heading} className="border-l-4 border-blue-500/70 p-5 sm:p-6">
            <h2 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">{block.heading}</h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
