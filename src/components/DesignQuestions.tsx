import type { StorySection } from '@/content/types';

import { SectionHeader } from './SectionHeader';

export function DesignQuestions({
  section,
  questions,
}: {
  section: StorySection;
  questions: string[];
}) {
  return (
    <div className="wrap questions">
      <SectionHeader section={section} bodyClass="t-lead measure-wide" />
      <ol className="questions__list">
        {questions.map((question) => (
          <li key={question} className="t-hero questions__item">
            {question}
          </li>
        ))}
      </ol>
    </div>
  );
}
