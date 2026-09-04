import { AppShell } from '@/app/AppShell';
import { ScenarioScene } from '@/components/ScenarioScene';
import { scenarioIntro, scenarios } from '@/content/scenarios';
import { routes } from '@/lib/paths';

export default function ScenariosPage() {
  return (
    <AppShell page="scenarios">
      <section
        className="band band--tight scenarios-head"
        aria-labelledby="scenarios-title"
      >
        <div className="wrap">
          <p className="t-eyebrow">{scenarioIntro.eyebrow}</p>
          <h1 id="scenarios-title" className="t-h2 scenarios-title">
            {scenarioIntro.headline}
          </h1>
          <p className="t-lead measure-wide">{scenarioIntro.lead}</p>
          <p className="t-small measure-wide">{scenarioIntro.caveat}</p>
          <nav aria-label="Scenarios" className="dash-nav">
            <ul>
              {scenarios.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.eyebrow}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      {scenarios.map((scenario, index) => (
        <ScenarioScene key={scenario.id} scenario={scenario} index={index} />
      ))}
      <section className="band band--tight" aria-label="Try your own scenario">
        <div className="wrap">
          <p className="t-statement measure-wide">
            These are the paper’s cases. The lab lets you build your own.
          </p>
          <p className="hero__actions">
            <a className="btn" href={routes.explore}>
              Open the Public Balance Sheet Lab
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
