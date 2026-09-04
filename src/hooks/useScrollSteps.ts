import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives a sticky scene from scrolling text steps. Each step element reports
 * when it crosses the middle band of the viewport, and the scene shows the
 * matching state. Disabled scenes fall back to explicit controls.
 */
export function useScrollSteps(count: number, enabled: boolean) {
  const [active, setActive] = useState(0);
  const elements = useRef<Array<HTMLElement | null>>([]);

  const registerStep = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      elements.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.step);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0 },
    );
    const nodes = elements.current.slice(0, count);
    for (const node of nodes) if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [count, enabled]);

  const scrollToStep = useCallback((index: number, smooth: boolean) => {
    const node = elements.current[index];
    if (!node) return;
    node.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'center',
    });
  }, []);

  return { active, setActive, registerStep, scrollToStep };
}
