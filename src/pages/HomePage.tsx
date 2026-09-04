import { lazy, Suspense } from 'react';

import { AppShell } from '@/app/AppShell';
import { StoryProgress } from '@/app/StoryProgress';
import { useReadingProgress } from '@/app/useReadingProgress';
import { ClosingScene } from '@/components/ClosingScene';
import { DesignQuestions } from '@/components/DesignQuestions';
import { DistributionScenarioTabs } from '@/components/DistributionScenarioTabs';
import { FutureForkExplorer } from '@/components/FutureForkExplorer';
import { HeroSplitField } from '@/components/HeroSplitField';
import { ArrowRight } from '@/components/Icons';
import { ImpactTransitionTimeline } from '@/components/ImpactTransitionTimeline';
import { OwnershipFlowMap } from '@/components/OwnershipFlowMap';
import { PayoffAlignmentScene } from '@/components/PayoffAlignmentScene';
import { PayoffSpaceExplorer } from '@/components/PayoffSpaceExplorer';
import { PolicyToolsStage } from '@/components/PolicyToolsStage';
import { SectionHeader } from '@/components/SectionHeader';
import { StatePayoffTheatre } from '@/components/StatePayoffTheatre';
import { ThetaExplainer } from '@/components/ThetaExplainer';
import { navChapters, storySections } from '@/content/story';
import type { StorySection } from '@/content/types';
import { useInView } from '@/hooks/useInView';

const PublicBalanceSheetLab = lazy(
  () => import('@/components/PublicBalanceSheetLab'),
);

const chapterIds = navChapters.map((chapter) => chapter.id);

export default function HomePage() {
  const { progress, current } = useReadingProgress(chapterIds);
  return (
    <AppShell page="home" currentChapter={current} progress={progress}>
      <StoryProgress progress={progress} currentChapter={current} />
      {storySections.map((section) => (
        <Scene key={section.slug} section={section} />
      ))}
    </AppShell>
  );
}

function Scene({ section }: { section: StorySection }) {
  const kind = section.visual.kind;
  const dark = section.theme === 'ink';
  const className = `band scene scene--${kind} band--${section.theme} ${dark ? 'on-ink' : ''}`;
  return (
    <section
      id={section.slug}
      className={className}
      aria-labelledby={`${section.slug}-title`}
    >
      <SceneBody section={section} />
    </section>
  );
}

function SceneBody({ section }: { section: StorySection }) {
  const visual = section.visual;
  switch (visual.kind) {
    case 'hero-split':
      return <Hero section={section} />;
    case 'distribution':
      return (
        <DistributionScenarioTabs section={section} states={visual.states} />
      );
    case 'ownership-flow':
      return (
        <OwnershipFlowMap
          section={section}
          actors={visual.actors}
          steps={visual.steps}
        />
      );
    case 'state-payoff':
      return (
        <StatePayoffTheatre
          section={section}
          lanes={visual.lanes}
          after={visual.after}
        />
      );
    case 'theta':
      return <ThetaExplainer section={section} />;
    case 'payoff-alignment':
      return (
        <PayoffAlignmentScene
          section={section}
          cases={visual.cases}
          caveat={visual.caveat}
        />
      );
    case 'payoff-space':
      return <PayoffSpaceExplorer section={section} modes={visual.modes} />;
    case 'instrument-stage':
      return (
        <PolicyToolsStage
          section={section}
          instruments={visual.instruments}
          takeaways={visual.takeaways}
        />
      );
    case 'timeline':
      return (
        <ImpactTransitionTimeline section={section} beats={visual.beats} />
      );
    case 'successor-space':
      return (
        <FutureForkExplorer
          section={section}
          states={visual.states}
          caveat={visual.caveat}
        />
      );
    case 'questions':
      return <DesignQuestions section={section} questions={visual.questions} />;
    case 'lab-embed':
      return <LabEmbed section={section} />;
    case 'closing':
      return <ClosingScene section={section} actions={visual.actions} />;
  }
}

function Hero({ section }: { section: StorySection }) {
  return (
    <div className="wrap hero">
      <p className="t-eyebrow hero__eyebrow">{section.eyebrow}</p>
      <h1 className="t-hero hero__title" id={`${section.slug}-title`}>
        {section.headline}
      </h1>
      <div className="hero__row">
        <div className="hero__copy stack">
          {section.body.map((line) => (
            <p key={line} className="t-lead">
              {line}
            </p>
          ))}
          <p className="hero__actions">
            {section.actions?.map((action, index) => (
              <a
                key={action.label}
                href={action.href}
                className={index === 0 ? 'btn' : 'btn btn--ghost'}
              >
                {action.label} <ArrowRight />
              </a>
            ))}
          </p>
        </div>
        <HeroSplitField />
      </div>
    </div>
  );
}

function LabEmbed({ section }: { section: StorySection }) {
  const [ref, near] = useInView<HTMLDivElement>({
    rootMargin: '600px 0px',
    threshold: 0,
    once: true,
  });
  return (
    <div className="wrap" ref={ref}>
      <SectionHeader section={section} />
      <div className="lab-slot">
        {near ? (
          <Suspense fallback={<LabPlaceholder />}>
            <PublicBalanceSheetLab variant="embed" />
          </Suspense>
        ) : (
          <LabPlaceholder />
        )}
      </div>
    </div>
  );
}

function LabPlaceholder() {
  return (
    <div className="lab-placeholder" aria-busy="true">
      <p className="t-small">The lab loads when you reach it.</p>
    </div>
  );
}
