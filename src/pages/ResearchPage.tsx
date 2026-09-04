import { AppShell } from '@/app/AppShell';
import { ResearchLibrary } from '@/components/ResearchLibrary';

export default function ResearchPage() {
  return (
    <AppShell page="research">
      <section className="band band--tight" aria-labelledby="research-title">
        <div className="wrap">
          <p className="t-eyebrow">Read further</p>
          <h1 id="research-title" className="t-h2">
            The paper, its diagrams, and the notebooks behind them.
          </h1>
          <p className="t-lead measure-wide">
            A quiet library. The paper first, then the argument in diagrams, the
            interactive figures, the public notebooks, the technical model, and
            the repositories.
          </p>
        </div>
      </section>
      <section className="band band--tight band--bone" aria-label="Library">
        <ResearchLibrary />
      </section>
    </AppShell>
  );
}
