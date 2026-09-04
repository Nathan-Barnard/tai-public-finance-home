import { AppShell } from '@/app/AppShell';
import { ArrowRight } from '@/components/Icons';
import { routes } from '@/lib/paths';

export default function NotFoundPage() {
  return (
    <AppShell page="other">
      <section className="band not-found" aria-labelledby="nf-title">
        <div className="wrap">
          <p className="t-eyebrow">Page not found</p>
          <h1 id="nf-title" className="t-h2">
            That page is not on this site.
          </h1>
          <p className="t-lead measure-wide">
            The visual argument, the lab, the library and the dashboard are all
            still here.
          </p>
          <p className="hero__actions">
            <a className="btn" href={routes.home}>
              Start the visual essay <ArrowRight />
            </a>
            <a className="btn btn--ghost" href={routes.explore}>
              Open the lab <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
