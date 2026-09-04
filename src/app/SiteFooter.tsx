import { footerLinks, site } from '@/content/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p className="site-footer__name">{site.name}</p>
        <ul>
          {footerLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                rel={
                  'external' in item && item.external ? 'noopener' : undefined
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
