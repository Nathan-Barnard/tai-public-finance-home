import { type ComponentType, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import './styles/globals.css';
import './styles/site.css';
import './styles/indicators.css';

/** Hydrates the prerendered page, or renders it fresh in development. */
export function mount(Page: ComponentType) {
  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root element');
  const tree = (
    <StrictMode>
      <Page />
    </StrictMode>
  );
  if (root.hasChildNodes()) {
    hydrateRoot(root, tree);
  } else {
    createRoot(root).render(tree);
  }
}
