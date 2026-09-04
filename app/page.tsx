'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Landmark,
  LineChart,
  PiggyBank,
  ShieldCheck,
} from 'lucide-react';

import content from '@/public/content/v0.1.json';

type ScenarioKey = keyof typeof content.scenarios;
type AssetMenuKey = keyof typeof content.assetMenus;

const scenarioOrder: ScenarioKey[] = ['downside', 'upside', 'neutral'];
const assetOrder: AssetMenuKey[] = ['none', 'maintained', 'complete'];

const evidenceLabels = [
  'Shown here as a model result',
  'Illustrated here; technical proof forthcoming',
  'Comparison not yet computed',
  'No estimates reported yet',
];

function SectionIntro({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-rust">{label}</p>
      <h2 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,4.2rem)] leading-[1.02] tracking-[-0.04em]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 sm:text-lg sm:leading-8">
        {copy}
      </p>
    </div>
  );
}

function ValuationChart({ scenarioKey }: { scenarioKey: ScenarioKey }) {
  const scenario = content.scenarios[scenarioKey];
  const workerPosition = Math.max(8, Math.min(92, (scenario.worker + 100) / 2));
  const marketPosition = Math.max(8, Math.min(92, (scenario.market + 100) / 2));

  return (
    <figure className="rounded-xl border border-ink/12 bg-white p-5 sm:p-7">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/10 pb-4">
        <span className="font-semibold">
          How plentiful are resources in this state?
        </span>
        <span className="text-xs text-ink/48">Illustrative, not estimated</span>
      </figcaption>

      <div className="mt-8 space-y-9">
        {[
          {
            name: 'Workers and the public budget',
            state: scenario.workerState,
            position: workerPosition,
            color: 'bg-rust',
          },
          {
            name: 'Investors pricing the claim',
            state: scenario.marketState,
            position: marketPosition,
            color: 'bg-teal',
          },
        ].map((row) => (
          <div key={row.name}>
            <div className="flex items-end justify-between gap-4 text-sm">
              <span className="font-semibold">{row.name}</span>
              <span className="text-ink/54">{row.state}</span>
            </div>
            <div className="relative mt-4 h-px bg-ink/18" aria-hidden="true">
              <span className="absolute -top-2 left-0 h-4 w-px bg-ink/18" />
              <span className="absolute -top-2 right-0 h-4 w-px bg-ink/18" />
              <span
                className={`absolute -top-[7px] size-[15px] -translate-x-1/2 rounded-full ring-4 ring-white transition-[left] duration-500 ${row.color}`}
                style={{ left: `${row.position}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between text-xs text-ink/45">
        <span>Resources are scarce</span>
        <span>Resources are plentiful</span>
      </div>
    </figure>
  );
}

function SpanDiagram({ directions }: { directions: number }) {
  return (
    <svg
      className="h-auto w-full"
      viewBox="0 0 620 390"
      aria-labelledby="span-title span-description"
    >
      <title id="span-title">Which risks can public claims cover?</title>
      <desc id="span-description">
        {directions === 0
          ? 'Without a public risky claim, neither of the two modeled risk directions is covered.'
          : directions === 1
            ? 'One public risky claim covers one combination of risks and leaves another combination uncovered.'
            : 'Two independent public risky claims cover both modeled risk directions.'}
      </desc>
      <defs>
        <marker
          id="teal-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L7,3 z" className="fill-teal" />
        </marker>
        <marker
          id="rust-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L7,3 z" className="fill-rust" />
        </marker>
      </defs>

      <g className="stroke-ink/7">
        {[130, 210, 290, 370, 450, 530].map((x) => (
          <line key={`x-${x}`} x1={x} y1="48" x2={x} y2="320" />
        ))}
        {[80, 140, 200, 260, 320].map((y) => (
          <line key={`y-${y}`} x1="92" y1={y} x2="550" y2={y} />
        ))}
      </g>
      <line
        x1="92"
        y1="320"
        x2="550"
        y2="320"
        className="stroke-ink/25"
        strokeWidth="1.5"
      />
      <line
        x1="92"
        y1="320"
        x2="92"
        y2="48"
        className="stroke-ink/25"
        strokeWidth="1.5"
      />
      <text
        x="548"
        y="350"
        textAnchor="end"
        className="fill-ink/48 text-[12px]"
      >
        one source of automation risk
      </text>
      <text x="108" y="63" className="fill-ink/48 text-[12px]">
        another source of risk
      </text>

      {directions === 0 && (
        <g>
          <circle
            cx="320"
            cy="185"
            r="86"
            className="fill-rust/5 stroke-rust/38"
            strokeDasharray="7 8"
            strokeWidth="2"
          />
          <text
            x="320"
            y="178"
            textAnchor="middle"
            className="fill-rust text-[15px] font-semibold"
          >
            No risky public claim
          </text>
          <text
            x="320"
            y="203"
            textAnchor="middle"
            className="fill-ink/52 text-[12px]"
          >
            neither risk is covered by a payoff
          </text>
        </g>
      )}

      {directions >= 1 && (
        <g>
          <path
            d="M122 298 L510 72"
            className="stroke-teal"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.11"
          />
          <path
            d="M122 298 L510 72"
            className="stroke-teal"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd="url(#teal-arrow)"
          />
          <text x="358" y="111" className="fill-teal text-[13px] font-semibold">
            risk this claim can cover
          </text>
        </g>
      )}

      {directions === 1 && (
        <g>
          <path
            d="M320 185 L170 76"
            className="stroke-rust"
            strokeDasharray="8 7"
            strokeWidth="3"
            markerEnd="url(#rust-arrow)"
          />
          <text x="116" y="58" className="fill-rust text-[13px] font-semibold">
            risk left uncovered
          </text>
          <circle
            cx="320"
            cy="185"
            r="7"
            className="fill-white stroke-ink/40"
            strokeWidth="2"
          />
        </g>
      )}

      {directions === 2 && (
        <g>
          <path
            d="M320 185 L170 76"
            className="stroke-teal"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.11"
          />
          <path
            d="M320 185 L170 76"
            className="stroke-teal"
            strokeWidth="3"
            markerEnd="url(#teal-arrow)"
          />
          <text x="116" y="58" className="fill-teal text-[13px] font-semibold">
            second claim covers this risk
          </text>
          <circle
            cx="320"
            cy="185"
            r="7"
            className="fill-white stroke-teal"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}

export default function Home() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('downside');
  const [assetMenuKey, setAssetMenuKey] = useState<AssetMenuKey>('maintained');

  const scenario = content.scenarios[scenarioKey];
  const assetMenu = content.assetMenus[assetMenuKey];
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="font-display text-lg font-semibold tracking-[-0.02em]"
            aria-label="TAI Public Finance home"
          >
            TAI Public Finance
          </a>
          <nav
            className="hidden items-center gap-6 text-sm text-ink/64 md:flex"
            aria-label="Main navigation"
          >
            <a href="#question" className="hover:text-ink">
              The question
            </a>
            <a href="#mechanism" className="hover:text-ink">
              The mechanism
            </a>
            <a href="#tools" className="hover:text-ink">
              Policy tools
            </a>
            <a href="#evidence" className="hover:text-ink">
              Evidence
            </a>
          </nav>
          <a
            href={content.implementationRepository}
            className="rounded-md border border-ink/18 bg-white px-3 py-2 text-xs font-semibold hover:border-ink/35"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <section id="question" className="scroll-mt-24 border-b border-ink/10">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-rust">
              Public finance under automation risk
            </p>
            <h1 className="mt-5 font-display text-[clamp(3rem,6.8vw,6.4rem)] leading-[0.94] tracking-[-0.055em]">
              When automation pays investors, who insures workers?
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/70 sm:text-xl sm:leading-9">
              Workers may be unable to trade the claims that rise in value when
              automation changes production. Investors can. This project asks
              whether a government balance sheet can partly fill that missing
              market—and where it cannot.
            </p>
            <a
              href="#mechanism"
              className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold"
            >
              See the basic mechanism{' '}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <aside className="border-l-2 border-teal pl-6 sm:pl-8">
            <p className="font-display text-2xl leading-snug tracking-[-0.025em] sm:text-3xl">
              The question is not simply whether workers gain or lose.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/64">
              A public claim can matter whenever workers’ resources move
              differently from the resources of the investors who price that
              claim.
            </p>
            <p className="mt-6 text-sm leading-6 text-ink/50">
              This is an early research website. It reports no calibrated policy
              or welfare numbers.
            </p>
          </aside>
        </div>
      </section>

      <section id="mechanism" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="The basic problem"
            title="The same shock can matter differently to workers and investors."
            copy="Consider a state in which a traded claim does well. Investors who hold it may gain a great deal. Workers may lose, or they may gain by less. In either case, a pound delivered in that state can be worth more to a government acting for workers than to the investor who prices the claim."
          />

          <fieldset
            className="mt-12 flex flex-wrap gap-2"
            aria-label="Choose an illustrative automation state"
          >
            {scenarioOrder.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenarioKey(key)}
                aria-pressed={scenarioKey === key}
                className={`rounded-md border px-4 py-2.5 text-sm font-semibold transition ${
                  scenarioKey === key
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 bg-paper text-ink/68 hover:border-ink/35'
                }`}
              >
                {content.scenarios[key].shortLabel}
              </button>
            ))}
          </fieldset>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <ValuationChart scenarioKey={scenarioKey} />
            <div className="pt-2">
              <p className="text-sm font-semibold text-teal">
                {scenario.label}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-tight tracking-[-0.035em]">
                {scenario.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-ink/66">
                {scenario.explanation}
              </p>
              <div className="mt-7 border-l border-rust/40 pl-5">
                <p className="font-semibold">Why a public portfolio may help</p>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  The useful claim is the one that pays in states where
                  worker-facing public resources are relatively valuable—not
                  simply the claim with the highest return.
                </p>
              </div>
              <details className="mt-7 border-t border-ink/12 pt-5">
                <summary className="cursor-pointer text-sm font-semibold">
                  For readers who want the paper’s shorthand
                </summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                  <p className="font-mono text-lg">
                    Θ = m<sub>G</sub> / m<sub>I</sub>
                  </p>
                  <p className="text-sm leading-6 text-ink/60">
                    This ratio compares the value of an extra public pound for
                    worker welfare with its value in financial markets. When it
                    rises in a state where the claim pays, the claim has
                    insurance value for the public sector. It is a model object,
                    not an estimated statistic or a policy rule.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 border-y border-ink/10">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="Policy tools"
            title="Different tools solve different problems."
            copy="Public saving moves resources across dates. A risky claim moves resources across states of the world, but only where it pays. Capital taxation shares domestic capital income while also changing investment, future wages, and the tax base. The tools can overlap; they are not interchangeable."
          />

          <div className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
            {[
              {
                icon: PiggyBank,
                name: 'Borrowing and saving',
                job: 'Move resources between today and tomorrow.',
                limit:
                  'A safe position does not insure one same-date shock rather than another.',
              },
              {
                icon: LineChart,
                name: 'A risky public claim',
                job: 'Move resources toward the states in which the claim pays.',
                limit:
                  'It cannot reach a risk that does not affect its payoff.',
              },
              {
                icon: Landmark,
                name: 'Capital taxation',
                job: 'Share domestic capital income between private investors and the public budget.',
                limit:
                  'Changing the tax can also change investment, wages, and the future tax base.',
              },
            ].map(({ icon: Icon, name, job, limit }) => (
              <article
                key={name}
                className="grid gap-5 py-7 sm:grid-cols-[48px_0.8fr_1.1fr] sm:items-start sm:gap-8"
              >
                <span className="grid size-11 place-items-center rounded-md bg-mist text-teal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/62">{job}</p>
                </div>
                <p className="text-sm leading-6 text-ink/54">
                  <span className="font-semibold text-ink/68">Its limit: </span>
                  {limit}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-8 border-l-2 border-rust bg-white p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]">
            <h3 className="font-display text-3xl leading-tight tracking-[-0.035em]">
              Every menu starts from the same economy.
            </h3>
            <div>
              <p className="text-base leading-7 text-ink/66">
                We hold today’s economy, public balance sheet, tax rate, and
                existing commitments fixed. Then we change one policy tool.
                Otherwise, an apparent gain could simply reflect a better
                starting point rather than the instrument itself.
              </p>
              <details className="mt-5 border-t border-ink/10 pt-4">
                <summary className="cursor-pointer text-sm font-semibold">
                  How the paper records that starting point
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink/58">
                  The common starting point is written (S<sub>0</sub>, M
                  <sub>0</sub>): current physical and financial conditions,
                  together with promises and institutional commitments already
                  in force.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section id="coverage" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="What the claim can cover"
            title="A claim only covers the risks built into its payoff."
            copy="The model has two sources of uncertainty. One risky claim can respond to one combination of them. A second, independent claim can cover the other combination too—but that only expands what the public balance sheet can hedge."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <figure className="rounded-xl border border-ink/12 bg-paper p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <figcaption className="font-semibold">
                  Which modeled risks are covered?
                </figcaption>
                <fieldset
                  className="flex flex-wrap gap-2"
                  aria-label="Choose the number of public risky claims"
                >
                  {assetOrder.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAssetMenuKey(key)}
                      aria-pressed={assetMenuKey === key}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                        assetMenuKey === key
                          ? 'border-ink bg-white text-ink'
                          : 'border-transparent text-ink/52 hover:text-ink'
                      }`}
                    >
                      {content.assetMenus[key].shortLabel}
                    </button>
                  ))}
                </fieldset>
              </div>
              <SpanDiagram directions={assetMenu.directions} />
              <p className="border-t border-ink/10 pt-4 text-xs leading-5 text-ink/48">
                Conceptual illustration of the local two-risk model; not a
                measurement of real-world hedge coverage.
              </p>
            </figure>

            <div className="pt-2">
              <p className="text-sm font-semibold text-teal">
                {assetMenu.label}
              </p>
              <p className="mt-4 text-base leading-7 text-ink/66">
                {assetMenu.role}
              </p>
              <div className="mt-8 space-y-5">
                <div>
                  <p className="font-semibold">
                    Risk the public claim can reach
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/58">
                    {assetMenu.marketed}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Risk the claim misses</p>
                  <p className="mt-2 text-sm leading-6 text-ink/58">
                    {assetMenu.residual}
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-ink/12 pt-6">
                <p className="text-sm leading-6 text-ink/58">
                  Even two public claims do not create extra resources, give
                  workers private trading accounts, remove financing limits, or
                  make the economy fully insured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-24 border-y border-ink/10">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="Evidence and limits"
            title="The diagrams show what must be measured—not what has already been proved in the data."
            copy="The empirical work begins by separating worker resources, government cash flows, and balance-sheet values. Only then can it ask whether an automation exposure caused those objects to move or whether a proposed public claim would have provided a useful hedge."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-xl border border-ink/12 bg-white">
              <img
                src={`${baseUrl}figures/measurement-accounting-before-causality.svg`}
                alt="Diagram separating worker resources, tax bases, policy flows, Treasury cash and balance-sheet values before asking a causal question."
                className="block h-auto w-full"
              />
              <figcaption className="border-t border-ink/10 p-5 text-sm leading-6 text-ink/60">
                <span className="font-semibold text-ink">
                  What has to be measured.
                </span>{' '}
                Worker resources, tax receipts, spending and asset revaluations
                are different objects. The illustration is synthetic; it is not
                an empirical result.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-xl border border-ink/12 bg-white">
              <img
                src={`${baseUrl}figures/structural-model-counterfactual.svg`}
                alt="Diagram showing how empirical evidence and economic mechanisms combine in a model to study a policy outside the observed range."
                className="block h-auto w-full"
              />
              <figcaption className="border-t border-ink/10 p-5 text-sm leading-6 text-ink/60">
                <span className="font-semibold text-ink">
                  Why a model is still needed.
                </span>{' '}
                Evidence disciplines the observed region; assumptions determine
                how that evidence is carried into a new policy regime. This is a
                methodological illustration, not a policy estimate.
              </figcaption>
            </figure>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <h3 className="font-display text-3xl leading-tight tracking-[-0.035em]">
                What this site can say now
              </h3>
              <p className="mt-4 text-sm leading-6 text-ink/58">
                The theoretical mechanism is the starting point. Its
                quantitative importance, the best mix of instruments, and the
                empirical size of worker exposure remain open.
              </p>
            </div>
            <div className="divide-y divide-ink/12 border-y border-ink/12">
              {content.evidenceItems.map((item, index) => (
                <article
                  key={item.name}
                  className="grid gap-3 py-6 sm:grid-cols-[0.72fr_1.28fr] sm:gap-8"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs font-semibold text-rust">
                      {evidenceLabels[index]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-ink/64">
                      {item.publicWording}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-ink/46">
                      {item.qualification}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="read" className="bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold text-rust">
              Read and reproduce
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.04em]">
              A public trail that grows with the paper.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="https://github.com/Nathan-Barnard/tai-public-finance-home/blob/main/notebooks/00_start_here.ipynb"
              className="group border border-ink/14 bg-paper p-5 hover:border-teal/60"
            >
              <BookOpen className="size-5 text-teal" aria-hidden="true" />
              <p className="mt-7 font-semibold">Guided notebooks</p>
              <p className="mt-2 text-sm leading-6 text-ink/54">
                Follow the full model and computational route from the economic
                question onward.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                Start reading <ArrowRight className="size-3.5" />
              </span>
            </a>
            <a
              href={content.implementationRepository}
              className="group border border-ink/14 bg-paper p-5 hover:border-teal/60"
            >
              <BarChart3 className="size-5 text-teal" aria-hidden="true" />
              <p className="mt-7 font-semibold">Code and site source</p>
              <p className="mt-2 text-sm leading-6 text-ink/54">
                Browse the public GitHub repository and follow each release.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                Open GitHub <ArrowRight className="size-3.5" />
              </span>
            </a>
            <a
              href={`${baseUrl}content/v0.1.json`}
              className="group border border-ink/14 bg-paper p-5 hover:border-teal/60"
            >
              <ShieldCheck className="size-5 text-teal" aria-hidden="true" />
              <p className="mt-7 font-semibold">Frozen content record</p>
              <p className="mt-2 text-sm leading-6 text-ink/54">
                Inspect the versioned wording, qualifications and research links
                behind this release.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                View the record <ArrowRight className="size-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-8 text-xs text-ink/48 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>TAI Public Finance · public research website</p>
          <p>
            Content {content.version} · reviewed {content.reviewDate}
          </p>
        </div>
      </footer>
    </main>
  );
}
