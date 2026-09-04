import { links } from '@/content/links';
import { homeAnchor, routes } from '@/lib/paths';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div
          className="stack"
          style={{ '--flow': '0.6em' } as React.CSSProperties}
        >
          <p className="nav__brand">
            Automation Risk and the Public Balance Sheet
          </p>
          <p>
            Research by Nathan Barnard. A public website: no sign-in, no
            tracking, no server.
          </p>
          <p>
            The diagrams on this site are editorial illustrations of a
            mechanism. None of them reports measured data, a forecast or a
            policy estimate.
          </p>
        </div>
        <ul aria-label="Site">
          <li>
            <a href={homeAnchor('problem')}>The visual essay</a>
          </li>
          <li>
            <a href={routes.explore}>The Public Balance Sheet Lab</a>
          </li>
          <li>
            <a href={routes.research}>Read further</a>
          </li>
          <li>
            <a href={routes.dashboard}>Research dashboard</a>
          </li>
        </ul>
        <ul aria-label="Research">
          <li>
            <a href={links.paper}>The paper</a>
          </li>
          <li>
            <a href={links.notebookIndex} rel="noopener">
              Public notebooks
            </a>
          </li>
          <li>
            <a href={links.siteRepo} rel="noopener">
              Repository on GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
