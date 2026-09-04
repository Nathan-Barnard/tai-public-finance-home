import { useCallback, useId, type KeyboardEvent } from 'react';

type Options = {
  count: number;
  active: number;
  onChange: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  idPrefix?: string;
};

/**
 * Accessible tab semantics: roving tabindex, aria-selected, aria-controls and
 * arrow-key movement. Each visual scene with discrete states uses this.
 */
export function useTabList({
  count,
  active,
  onChange,
  orientation = 'horizontal',
  idPrefix,
}: Options) {
  const generated = useId();
  const base = idPrefix ?? generated;

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      let target: number | null = null;
      if (event.key === next) target = (active + 1) % count;
      else if (event.key === previous) target = (active - 1 + count) % count;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = count - 1;
      if (target === null) return;
      event.preventDefault();
      onChange(target);
      const tab = document.getElementById(`${base}-tab-${target}`);
      tab?.focus();
    },
    [active, base, count, onChange, orientation],
  );

  const tabProps = (index: number) => ({
    role: 'tab' as const,
    id: `${base}-tab-${index}`,
    'aria-selected': index === active,
    'aria-controls': `${base}-panel-${index}`,
    tabIndex: index === active ? 0 : -1,
    onClick: () => onChange(index),
    onKeyDown,
  });

  const panelProps = (index: number) => ({
    role: 'tabpanel' as const,
    id: `${base}-panel-${index}`,
    'aria-labelledby': `${base}-tab-${index}`,
    hidden: index !== active,
    tabIndex: 0,
  });

  const listProps = {
    role: 'tablist' as const,
    'aria-orientation': orientation,
  };

  return { tabProps, panelProps, listProps };
}
