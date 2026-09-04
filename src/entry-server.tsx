import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { pageComponent, pages, type PageId } from './pages/registry';

export { pages };

export function render(id: PageId): string {
  const Page = pageComponent(id);
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}
