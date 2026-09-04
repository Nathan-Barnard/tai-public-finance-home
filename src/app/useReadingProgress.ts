import { useEffect, useState } from 'react';

/**
 * Tracks how far the reader is through the page and which chapter is on
 * screen. One passive scroll listener, throttled to animation frames.
 */
export function useReadingProgress(chapterIds: string[]) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      const marker = window.innerHeight * 0.4;
      let active: string | null = null;
      for (const id of chapterIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= marker) active = id;
      }
      setCurrent(active);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapterIds]);

  return { progress, current };
}
