import { AppShell } from '@/app/AppShell';
import { ExploreTool } from '@/components/ExploreTool';
import { ArrowRight } from '@/components/Icons';
import { explorePage } from '@/content/explore';

export default function ExplorePage() {
  return (
    <AppShell current="explore">
      <section
        className="section section--plain page-head"
        aria-labelledby="explore-title"
      >
        <div className="wrap">
          <h1 id="explore-title" className="t-hero page-head__title">
            {explorePage.title}
          </h1>
          <p className="t-lead measure">{explorePage.intro}</p>
        </div>
      </section>
      <section
        className="section section--tint"
        aria-label="The thought experiment"
      >
        <div className="wrap">
          <ExploreTool />
          <p className="actions explore-page__action">
            <a className="link" href={explorePage.action.href}>
              {explorePage.action.label} <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
