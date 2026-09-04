import type { ReactNode } from 'react';

/**
 * Renders a wide and a tall version of a diagram; CSS shows one at a time.
 * Both are cheap SVG, so the page needs no JavaScript to pick the right one
 * and the hidden variant leaves the accessibility tree entirely.
 */
export function ResponsiveFigure({
  wide,
  tall,
  className = '',
}: {
  wide: ReactNode;
  tall: ReactNode;
  className?: string;
}) {
  return (
    <div className={`fig ${className}`}>
      <div className="fig__wide">{wide}</div>
      <div className="fig__tall">{tall}</div>
    </div>
  );
}
