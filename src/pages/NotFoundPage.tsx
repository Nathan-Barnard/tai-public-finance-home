import { AppShell } from '@/app/AppShell';
import { ArrowRight } from '@/components/Icons';
import { routes } from '@/lib/paths';

export default function NotFoundPage() {
  return (
    <AppShell current="other">
      <section
        className="section section--plain page-head"
        aria-labelledby="nf-title"
      >
        <div className="wrap">
          <h1 id="nf-title" className="t-hero page-head__title">
            That page is not on this site.
          </h1>
          <p className="t-lead measure">
            The question, the evidence behind it, the thought experiment and the
            research are all still here.
          </p>
          <p className="actions">
            <a className="btn" href={routes.home}>
              Start at the beginning <ArrowRight />
            </a>
            <a className="link" href={routes.evidence}>
              See what history shows <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
