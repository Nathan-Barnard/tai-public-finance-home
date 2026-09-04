import type { ReactNode } from 'react';

export type PanelItem = { title: string; copy: string };

type Props = {
  panels: PanelItem[];
  /** 'quad' is the two-by-two distribution grid; 'pair' is two side by side. */
  variant: 'quad' | 'pair';
  label?: string;
  children?: ReactNode;
};

/**
 * Equally weighted panels. Every panel in a group gets identical treatment so
 * no single outcome is made to look more likely than the others.
 */
export function PanelGrid({ panels, variant, label, children }: Props) {
  return (
    <ul className={`panels panels--${variant}`} aria-label={label}>
      {panels.map((panel) => (
        <li key={panel.title} className="panel">
          <h3 className="panel__title t-h3">{panel.title}</h3>
          <p className="panel__copy t-body">{panel.copy}</p>
          {children}
        </li>
      ))}
    </ul>
  );
}
