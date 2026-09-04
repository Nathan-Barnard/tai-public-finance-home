import type { ExpertNote } from '@/content/types';

import { ArrowUpRight } from './Icons';
import { MathInline } from './MathInline';

export function ExpertDisclosure({ note }: { note: ExpertNote }) {
  return (
    <details className="disclosure">
      <summary>{note.title}</summary>
      <div className="disclosure__body">
        {note.copy.map((paragraph) => (
          <p key={paragraph}>
            <MathInline text={paragraph} />
          </p>
        ))}
        {(note.paperHref || note.notebookHref) && (
          <p className="disclosure__links">
            {note.paperHref && (
              <a href={note.paperHref}>
                Read this in the paper <ArrowUpRight className="inline-icon" />
              </a>
            )}
            {note.notebookHref && (
              <a href={note.notebookHref} rel="noopener">
                Open the notebook <ArrowUpRight className="inline-icon" />
              </a>
            )}
          </p>
        )}
      </div>
    </details>
  );
}
