import { useInView } from '@/hooks/useInView';

/**
 * Editorial representation of capital income and worker income before and
 * after an automation shock. No dates, values or observations: movement,
 * weight, labels and arrows carry the meaning.
 */
export function HeroSplitField() {
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    once: true,
  });
  return (
    <div ref={ref} className={`hero-field ${inView ? 'is-in' : ''}`}>
      <SplitFigure layout="wide" />
      <SplitFigure layout="tall" />
      <p className="sr-only">
        Two income paths move together before an automation shock. When the
        shock arrives, capital income, profits and asset values rise steeply,
        while worker income flattens and dips. The gap between them is who owns
        the gains. This is an illustration, not data.
      </p>
    </div>
  );
}

function SplitFigure({ layout }: { layout: 'wide' | 'tall' }) {
  const wide = layout === 'wide';
  const W = wide ? 1400 : 720;
  const H = wide ? 620 : 860;
  const shockX = wide ? 520 : 250;
  const startX = wide ? 40 : 24;
  const endX = wide ? 1150 : 640;
  const baseY = wide ? 400 : 520;
  const capitalEndY = wide ? 90 : 120;
  const workerEndY = wide ? 440 : 600;
  const fs = wide ? 24 : 30;
  const fsSmall = wide ? 18 : 24;

  const before = `M${startX} ${baseY + 30} C ${startX + 200} ${baseY + 20}, ${shockX - 160} ${baseY - 2}, ${shockX} ${baseY - 18}`;
  const capitalAfter = `M${shockX} ${baseY - 18} C ${shockX + 220} ${baseY - 40}, ${shockX + 380} ${capitalEndY + 120}, ${endX} ${capitalEndY}`;
  const workerAfter = `M${shockX} ${baseY - 18} C ${shockX + 260} ${baseY - 30}, ${shockX + 420} ${workerEndY - 10}, ${endX} ${workerEndY}`;
  const gap = `M${shockX} ${baseY - 18} C ${shockX + 220} ${baseY - 40}, ${shockX + 380} ${capitalEndY + 120}, ${endX} ${capitalEndY} L${endX} ${workerEndY} C ${shockX + 420} ${workerEndY - 10}, ${shockX + 260} ${baseY - 30}, ${shockX} ${baseY - 18} Z`;

  return (
    <svg
      className={`hero-field__svg hero-field__svg--${layout}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`hero-title-${layout} hero-desc-${layout}`}
    >
      <title id={`hero-title-${layout}`}>
        Capital income and worker income before and after an automation shock
      </title>
      <desc id={`hero-desc-${layout}`}>
        Before the shock the two paths move together. After it, capital income
        rises steeply while worker income flattens and dips. Editorial
        illustration with no data.
      </desc>
      <defs>
        <marker
          id={`hero-head-capital-${layout}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--capital)" />
        </marker>
        <marker
          id={`hero-head-worker-${layout}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill="var(--worker)" />
        </marker>
      </defs>

      {/* horizon */}
      <line
        x1={startX}
        y1={baseY + 30}
        x2={endX}
        y2={baseY + 30}
        stroke="var(--line)"
        strokeWidth="1"
        strokeDasharray="2 8"
      />

      {/* the gap */}
      <path
        d={gap}
        className="hero-field__gap fade-up"
        fill="var(--public-soft)"
      />

      {/* before: paths move together */}
      <path
        d={before}
        className="trace hero-field__before"
        stroke="var(--ink)"
        strokeWidth={wide ? 9 : 8}
        fill="none"
        strokeLinecap="round"
        style={{ '--len': 1200 } as React.CSSProperties}
      />
      <text
        x={startX}
        y={baseY + 76}
        fontSize={fsSmall}
        className="svg-text"
        fill="var(--text-mute)"
      >
        Before the shock: both incomes move together
      </text>

      {/* shock line */}
      <line
        x1={shockX}
        y1={wide ? 60 : 70}
        x2={shockX}
        y2={H - (wide ? 70 : 150)}
        stroke="var(--ink)"
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      <text
        x={shockX + 14}
        y={wide ? 60 : 62}
        fontSize={fs}
        className="svg-display"
        fill="var(--ink)"
        fontWeight="500"
      >
        The automation shock arrives
      </text>

      {/* after: capital */}
      <path
        d={capitalAfter}
        className="trace hero-field__after"
        stroke="var(--capital)"
        strokeWidth={wide ? 11 : 10}
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#hero-head-capital-${layout})`}
        style={{ '--len': 1400 } as React.CSSProperties}
      />
      {/* after: worker */}
      <path
        d={workerAfter}
        className="trace hero-field__after"
        stroke="var(--worker)"
        strokeWidth={wide ? 9 : 8}
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#hero-head-worker-${layout})`}
        style={{ '--len': 1400 } as React.CSSProperties}
      />

      {/* labels */}
      {wide ? (
        <>
          <text
            x={endX + 16}
            y={capitalEndY + 4}
            fontSize={fs}
            className="svg-display"
            fill="var(--capital-text)"
            fontWeight="600"
          >
            Capital income
          </text>
          <text
            x={endX + 16}
            y={capitalEndY + 32}
            fontSize={fsSmall}
            className="svg-text"
            fill="var(--capital-text)"
          >
            rises, with profits
          </text>
          <text
            x={endX + 16}
            y={capitalEndY + 56}
            fontSize={fsSmall}
            className="svg-text"
            fill="var(--capital-text)"
          >
            and asset values
          </text>
          <text
            x={endX + 16}
            y={workerEndY + 6}
            fontSize={fs}
            className="svg-display"
            fill="var(--worker-text)"
            fontWeight="600"
          >
            Worker income
          </text>
          <text
            x={endX + 16}
            y={workerEndY + 36}
            fontSize={fsSmall}
            className="svg-text"
            fill="var(--worker-text)"
          >
            flat, or falls: wages
          </text>
          <text
            x={shockX + 300}
            y={(capitalEndY + workerEndY) / 2 + 30}
            fontSize={fs}
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            The gap is who owns the gains
          </text>
        </>
      ) : (
        <>
          <text
            x={endX}
            y={capitalEndY - 30}
            fontSize={fs}
            className="svg-display"
            fill="var(--capital-text)"
            fontWeight="600"
            textAnchor="end"
          >
            Capital income rises
          </text>
          <text
            x={endX}
            y={capitalEndY - 2}
            fontSize={fsSmall}
            className="svg-text"
            fill="var(--capital-text)"
            textAnchor="end"
          >
            profits and asset values
          </text>
          <text
            x={endX}
            y={workerEndY + 48}
            fontSize={fs}
            className="svg-display"
            fill="var(--worker-text)"
            fontWeight="600"
            textAnchor="end"
          >
            Worker income flat, or falls
          </text>
          <text
            x={endX}
            y={workerEndY + 76}
            fontSize={fsSmall}
            className="svg-text"
            fill="var(--worker-text)"
            textAnchor="end"
          >
            wages
          </text>
          <text
            x={shockX + 40}
            y={(capitalEndY + workerEndY) / 2 + 40}
            fontSize={fs}
            className="svg-display"
            fill="var(--public-text)"
            fontStyle="italic"
          >
            The gap is who owns the gains
          </text>
        </>
      )}
    </svg>
  );
}
