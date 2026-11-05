import Link from "next/link";
import { PHOTO_STORIES } from "@/lib/photoStories";

/** The three steps behind a photo, plus which tools it works with. Illustrative image label included. */
export default function PhotoStory({ slug, prefix = "" }: { slug: string; prefix?: string }) {
  const s = PHOTO_STORIES[slug];
  // Hidden until the matching photo is live, so the steps never describe a different picture.
  if (!s || s.ready === false) return null;
  return (
    <div className="flex flex-col gap-1.5 pt-2" data-testid="photo-story">
      <ol className="m-0 flex flex-wrap items-stretch gap-1.5 p-0 text-[13px]">
        {s.steps.map((t, i) => (
          <li key={t} className="flex min-w-0 flex-[1_1_150px] list-none items-start gap-1.5 rounded-lg bg-white px-2.5 py-2 text-ink-2 shadow-[0_0_0_1px_var(--color-line,#e3e6e8)]">
            <b className="text-clay">{i + 1}</b><span>{t}</span>
          </li>
        ))}
      </ol>
      <div className="text-[12px] text-muted">Illustrative image · works with tools like {s.works} · <Link href={`${prefix}/p/${s.product}/`}>See this automation →</Link></div>
    </div>
  );
}
