import { navChapters } from '@/content/story';

type Props = { progress: number; currentChapter: string | null };

/** Thin desktop rail with one tick per chapter. Mobile uses the bar in the nav. */
export function StoryProgress({ progress, currentChapter }: Props) {
  return (
    <nav className="rail" aria-label="Reading progress">
      <div className="rail__track" />
      <div
        className="rail__fill"
        style={{ '--progress': progress } as React.CSSProperties}
        aria-hidden="true"
      />
      <ul className="rail__ticks">
        {navChapters.map((chapter, index) => (
          <li
            key={chapter.id}
            style={{ top: `${(index / (navChapters.length - 1)) * 100}%` }}
          >
            <a
              href={`#${chapter.id}`}
              aria-current={currentChapter === chapter.id ? 'true' : undefined}
              aria-label={chapter.label}
            >
              <span aria-hidden="true">{chapter.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
