import { useSyncExternalStore } from 'react';

// Media queries are read through an external store so that server-rendered
// markup and the first client render agree; the real value arrives once the
// page hydrates.
function subscribe(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useNarrow(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
