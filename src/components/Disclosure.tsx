type Section = { heading: string; copy: string };

type Props = {
  title: string;
  /** Plain paragraphs, or headed sections. */
  body?: string[];
  sections?: Section[];
};

/** The "Read the economics" inline disclosure. Never used for essential copy. */
export function Disclosure({ title, body, sections }: Props) {
  return (
    <details className="disclosure">
      <summary>{title}</summary>
      <div className="disclosure__body">
        {body?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {sections?.map((section) => (
          <div key={section.heading}>
            <p className="disclosure__heading">{section.heading}</p>
            <p>{section.copy}</p>
          </div>
        ))}
      </div>
    </details>
  );
}
