import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import type { StorySection, TimelineBeat } from '@/content/types';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useMediaQuery';

import { ExpertDisclosure } from './ExpertDisclosure';
import { ResponsiveFigure } from './ResponsiveFigure';
import { SectionHeader } from './SectionHeader';

type Props = { section: StorySection; beats: TimelineBeat[] };

/**
 * High-contrast timeline with a draggable handle, keyboard steps and a
 * scroll-driven default sequence that reveals impact before transition.
 */
export function ImpactTransitionTimeline({ section, beats }: Props) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.4,
    once: true,
  });
  const [t, setT] = useState(0.12);
  const [touched, setTouched] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // With reduced motion the default sequence is shown complete, not played.
  const shownT = reduced && !touched ? 0.86 : t;
  const beat = shownT < 0.34 ? 0 : shownT < 0.67 ? 1 : 2;

  // Default sequence: run the handle across once the timeline is in view.
  useEffect(() => {
    if (!inView || touched || reduced) return;
    let frame = 0;
    const start = performance.now();
    const duration = 6500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setT(0.12 + p * 0.74);
      if (p < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, touched, reduced]);

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    setTouched(true);
    setT(Math.min(1, Math.max(0, x)));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
    fromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    fromPointer(event);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const targets = [0.12, 0.5, 0.86];
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp')
      next = Math.min(2, beat + 1);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown')
      next = Math.max(0, beat - 1);
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 2;
    if (next === null) return;
    event.preventDefault();
    setTouched(true);
    setT(targets[next]);
  };

  return (
    <div className="wrap on-ink">
      <SectionHeader section={section} />
      <div ref={ref} className="timeline">
        <div
          ref={railRef}
          className="timeline__stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          <ResponsiveFigure
            wide={<TimelineSvg id={`${id}-w`} layout="wide" t={shownT} />}
            tall={<TimelineSvg id={`${id}-t`} layout="tall" t={shownT} />}
          />
          <label className="sr-only" htmlFor={`${id}-handle`}>
            Move through the timeline
          </label>
          <input
            id={`${id}-handle`}
            className="timeline__handle"
            type="range"
            min={0}
            max={beats.length - 1}
            step={1}
            value={beat}
            aria-valuetext={`${beats[beat].title}: ${beats[beat].copy}`}
            onChange={(event) => {
              setTouched(true);
              setT([0.12, 0.5, 0.86][Number(event.target.value)]);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <ol className="beats" aria-label="The three moments">
          {beats.map((b, index) => (
            <li
              key={b.id}
              className={`beat ${index === beat ? 'is-active' : ''} ${index < beat ? 'is-past' : ''}`}
            >
              <button
                type="button"
                className="beat__button"
                onClick={() => {
                  setTouched(true);
                  setT([0.12, 0.5, 0.86][index]);
                }}
                aria-pressed={index === beat}
              >
                <span className="beat__title">{b.title}</span>
                <span className="beat__copy">{b.copy}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {beats[beat].title}. {beats[beat].copy}
        </p>
      </div>
      {section.expertNote && <ExpertDisclosure note={section.expertNote} />}
    </div>
  );
}

const timelineLayouts = {
  wide: { W: 1400, H: 460, baseY: 300, jump: 120, fs: 22, fsBig: 24 },
  tall: { W: 700, H: 600, baseY: 400, jump: 130, fs: 22, fsBig: 24 },
};

function TimelineSvg({
  id,
  layout,
  t,
}: {
  id: string;
  layout: 'wide' | 'tall';
  t: number;
}) {
  const L = timelineLayouts[layout];
  const tall = layout === 'tall';
  const { W, H, baseY } = L;
  const shockX = W * 0.34;
  const wealthPath = `M60 ${baseY} H${shockX} V${baseY - L.jump} H${W - 60}`;
  const taxPath = `M${shockX} ${baseY + 60} C ${shockX + W * 0.14} ${baseY + 60}, ${shockX + W * 0.3} ${baseY + 20}, ${W - 60} ${baseY - 40}`;
  const handleX = 60 + t * (W - 120);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="timeline__svg">
      <defs>
        <clipPath id={`${id}-reveal`}>
          <rect x="0" y="0" width={handleX} height={H} />
        </clipPath>
      </defs>
      <line
        x1="60"
        y1={baseY + 110}
        x2={W - 60}
        y2={baseY + 110}
        stroke="var(--line-on-ink)"
        strokeWidth="2"
      />
      <line
        x1={shockX}
        y1="40"
        x2={shockX}
        y2={baseY + 110}
        stroke="var(--paper)"
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      <text
        x={shockX + 12}
        y="44"
        fontSize={L.fs}
        className="svg-display"
        fill="var(--paper)"
      >
        the shock lands
      </text>
      <text
        x="60"
        y={baseY + 150}
        fontSize={L.fs}
        className="svg-display"
        fill="var(--text-on-ink-mute)"
      >
        before
      </text>
      <text
        x={W - 60}
        y={baseY + 150}
        fontSize={L.fs}
        className="svg-display"
        fill="var(--text-on-ink-mute)"
        textAnchor="end"
      >
        the years after
      </text>
      <path
        d={wealthPath}
        fill="none"
        stroke="var(--public-dark)"
        strokeWidth="4"
        opacity="0.18"
      />
      <path
        d={taxPath}
        fill="none"
        stroke="var(--worker-dark)"
        strokeWidth="4"
        opacity="0.18"
        strokeDasharray="12 10"
      />
      <g clipPath={`url(#${id}-reveal)`}>
        <path
          d={wealthPath}
          fill="none"
          stroke="var(--public-dark)"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        <path
          d={taxPath}
          fill="none"
          stroke="var(--worker-dark)"
          strokeWidth="6"
          strokeDasharray="14 10"
        />
      </g>
      {tall ? (
        <>
          <text
            x={shockX + 16}
            y={baseY - L.jump - 56}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--public-dark)"
            opacity={t > 0.36 ? 1 : 0.25}
          >
            public wealth jumps
          </text>
          <text
            x={shockX + 16}
            y={baseY - L.jump - 26}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--public-dark)"
            opacity={t > 0.36 ? 1 : 0.25}
          >
            with the asset payoff
          </text>
          <text
            x={W - 60}
            y={baseY - 62}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--worker-dark)"
            textAnchor="end"
            opacity={t > 0.7 ? 1 : 0.25}
          >
            the tax path: investment,
          </text>
          <text
            x={W - 60}
            y={baseY - 34}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--worker-dark)"
            textAnchor="end"
            opacity={t > 0.7 ? 1 : 0.25}
          >
            capital, wages, revenue
          </text>
        </>
      ) : (
        <>
          <text
            x={shockX + 20}
            y={baseY - L.jump - 20}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--public-dark)"
            opacity={t > 0.36 ? 1 : 0.25}
          >
            public wealth jumps with the asset payoff
          </text>
          <text
            x={W - 60}
            y={baseY - 60}
            fontSize={L.fsBig}
            className="svg-display"
            fill="var(--worker-dark)"
            textAnchor="end"
            opacity={t > 0.7 ? 1 : 0.25}
          >
            the tax path: investment, capital, wages, revenue
          </text>
        </>
      )}
      <line
        x1={handleX}
        y1="30"
        x2={handleX}
        y2={baseY + 120}
        stroke="var(--future)"
        strokeWidth="4"
      />
      <circle
        cx={handleX}
        cy={baseY + 110}
        r="20"
        fill="var(--future)"
        stroke="var(--ink)"
        strokeWidth="4"
      />
    </svg>
  );
}
