import { GuideBlock } from "@/lib/guides";

export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="mt-8 space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="pt-2 text-lg font-bold text-neutral-900 dark:text-neutral-100"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={index} className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="space-y-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                  >
                    <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "note":
            return (
              <p
                key={index}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
              >
                {block.text}
              </p>
            );
          case "table":
            return (
              <div
                key={index}
                className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/5"
              >
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800">
                      {block.headers.map((header) => (
                        <th
                          key={header}
                          className="whitespace-nowrap px-4 py-2.5 text-left font-semibold text-neutral-700 dark:text-neutral-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {block.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="whitespace-nowrap px-4 py-2.5 text-neutral-600 dark:text-neutral-400"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
