import { useEffect, useState } from 'react';

/**
 * Steps through a scene's states on a timer after the reader presses
 * "Play explanation". Stops at the final state and never starts on its own.
 */
export function useAutoplay(
  count: number,
  active: number,
  setActive: (index: number) => void,
  intervalMs = 3600,
) {
  const [requested, setRequested] = useState(false);
  const playing = requested && active < count - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = active + 1;
      setActive(next);
      if (next >= count - 1) setRequested(false);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [playing, active, count, setActive, intervalMs]);

  const play = () => {
    if (active >= count - 1) setActive(0);
    setRequested(true);
  };
  const stop = () => setRequested(false);

  return { playing, play, stop };
}
