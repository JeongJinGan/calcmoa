export interface InfoBlock {
  heading: string;
  body: string;
}

export default function InfoSection({ blocks }: { blocks: InfoBlock[] }) {
  return (
    <section className="mt-10">
      <div className="divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
        {blocks.map((block) => (
          <div key={block.heading} className="p-4 sm:p-5">
            <h2 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">{block.heading}</h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
