import { AppShell } from '@/app/AppShell';
import { PublicBalanceSheetLab } from '@/components/PublicBalanceSheetLab';

export default function ExplorePage() {
  return (
    <AppShell page="explore">
      <section
        className="band band--tight explore-head"
        aria-labelledby="explore-title"
      >
        <div className="wrap">
          <p className="t-eyebrow">Explore</p>
          <h1 id="explore-title" className="t-h2">
            The Public Balance Sheet Lab
          </h1>
          <p className="t-lead measure-wide">
            Change the distribution of an automation shock. Then change what the
            public asset pays.
          </p>
          <p className="t-body measure-wide">
            Every reading below is a sentence or a drawn shape, never a number.
            The lab shows which futures a public asset can reach and which
            public tool is doing the work. It does not produce an optimal
            portfolio, a tax rate or a welfare figure, because none has been
            established.
          </p>
        </div>
      </section>
      <section className="band band--tight band--bone" aria-label="The lab">
        <div className="wrap">
          <PublicBalanceSheetLab variant="full" />
        </div>
      </section>
    </AppShell>
  );
}
