'use client';

import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Landmark,
  LineChart,
  PiggyBank,
} from 'lucide-react';

import content from '@/public/content/v0.1.json';

type ScenarioKey = keyof typeof content.scenarios;

const scenarioOrder: ScenarioKey[] = ['downside', 'upside', 'together'];

function SectionIntro({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
        {label}
      </p>
      <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.98] tracking-[-0.045em]">
        {title}
      </h2>
      {copy && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">{copy}</p>
      )}
    </div>
  );
}

function HeroGraphic() {
  return (
    <figure className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-ink p-5 text-white shadow-[0_28px_80px_rgba(28,43,38,0.14)] sm:p-7">
      <div className="absolute -right-16 -top-20 size-64 rounded-full bg-teal/35 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 size-60 rounded-full bg-rust/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/15 pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            Who gets the upside?
          </p>
          <span className="size-2 rounded-full bg-rust" />
        </div>

        <div className="py-7 text-center sm:py-9">
          <div className="mx-auto grid size-28 place-items-center rounded-full border border-white/20 bg-white/8 font-display text-2xl tracking-[-0.03em] shadow-[0_0_0_14px_rgba(255,255,255,0.025)] sm:size-32">
            Automation
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/12 bg-white/8 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Capitalists</p>
              <ArrowUpRight
                className="size-5 text-[#80d2bc]"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Own the assets that rise with profits.
            </p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/8 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Workers</p>
              <ArrowDownRight
                className="size-5 text-[#f0a177]"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Depend mainly on wages and public services.
            </p>
          </div>
        </div>

        <figcaption className="mt-5 text-sm leading-6 text-white/55">
          New technology can grow the economy while splitting the gains.
        </figcaption>
      </div>
    </figure>
  );
}

function DistributionChart({ scenarioKey }: { scenarioKey: ScenarioKey }) {
  const scenario = content.scenarios[scenarioKey];

  const bar = (value: number, color: string) => {
    const width = Math.abs(value) / 2;
    const start = value < 0 ? 50 - width : 50;

    return (
      <span
        className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-full transition-[left,width] duration-500 ${color}`}
        style={{ left: `${start}%`, width: `${width}%` }}
      />
    );
  };

  return (
    <figure className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_18px_55px_rgba(28,43,38,0.07)] sm:p-8">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-5">
        <span className="font-semibold">How incomes move after the shock</span>
      </figcaption>

      <div className="mt-8 space-y-8">
        {[
          {
            name: 'Capitalists',
            state: scenario.capitalState,
            value: scenario.capital,
            color: 'bg-teal',
          },
          {
            name: 'Workers',
            state: scenario.workerState,
            value: scenario.worker,
            color: 'bg-rust',
          },
        ].map((row) => (
          <div key={row.name}>
            <div className="flex items-end justify-between gap-4 text-sm">
              <span className="font-semibold">{row.name}</span>
              <span className="text-ink/54">{row.state}</span>
            </div>
            <div
              className="relative mt-4 h-10 rounded-full bg-paper"
              aria-hidden="true"
            >
              <span className="absolute bottom-1 left-1/2 top-1 w-px bg-ink/20" />
              {bar(row.value, row.color)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 text-xs text-ink/42">
        <span>Income falls</span>
        <span className="text-center">No change</span>
        <span className="text-right">Income rises</span>
      </div>
    </figure>
  );
}

function DiagramArrow() {
  return (
    <div className="hidden items-center md:flex" aria-hidden="true">
      <span className="h-px w-full bg-ink/25" />
      <ArrowRight className="-ml-1 size-4 shrink-0 text-ink/45" />
    </div>
  );
}

function StatePayoffGraphic() {
  return (
    <figure className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-[0_18px_55px_rgba(28,43,38,0.07)]">
      <figcaption className="border-b border-ink/10 px-5 py-4 text-sm font-semibold sm:px-8">
        Two automation shocks. The same hit to workers. Only one asset helps.
      </figcaption>
      <div className="divide-y divide-ink/10">
        <div className="p-5 sm:p-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-teal">
            The asset matches the shock
          </p>
          <div className="grid gap-3 md:grid-cols-[1fr_42px_1fr_42px_1fr] md:items-center">
            <div className="rounded-xl bg-[#f8e9e3] p-5">
              <p className="font-semibold">Workers lose income</p>
            </div>
            <DiagramArrow />
            <div className="rounded-xl bg-mist p-5">
              <p className="font-semibold">The public asset rises</p>
            </div>
            <DiagramArrow />
            <div className="rounded-xl bg-[#e4f1e9] p-5">
              <p className="font-semibold">Government has money to respond</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-rust">
            The asset misses the shock
          </p>
          <div className="grid gap-3 md:grid-cols-[1fr_42px_1fr_42px_1fr] md:items-center">
            <div className="rounded-xl bg-[#f8e9e3] p-5">
              <p className="font-semibold">Workers lose income</p>
            </div>
            <DiagramArrow />
            <div className="rounded-xl bg-paper p-5">
              <p className="font-semibold">The public asset does not move</p>
            </div>
            <DiagramArrow />
            <div className="rounded-xl bg-[#f8e9e3] p-5">
              <p className="font-semibold">The hole in worker income remains</p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function PayoffSpanGraphic({ secondAsset }: { secondAsset: boolean }) {
  return (
    <svg
      viewBox="0 0 680 480"
      className="h-auto w-full"
      aria-labelledby="payoff-span-title payoff-span-description"
    >
      <title id="payoff-span-title">
        What one public asset can and cannot reach
      </title>
      <desc id="payoff-span-description">
        {secondAsset
          ? 'Two assets with different payoffs reach both parts of the automation shock.'
          : 'One public asset reaches one part of the automation shock and misses another part.'}
      </desc>
      <defs>
        <marker
          id="blue-head"
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0 L0 8 L8 4 z" fill="#23766f" />
        </marker>
        <marker
          id="orange-head"
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0 L0 8 L8 4 z" fill="#b95736" />
        </marker>
      </defs>

      <g stroke="#1f332d" strokeOpacity="0.1">
        {[150, 230, 310, 390, 470, 550].map((x) => (
          <line key={`x-${x}`} x1={x} y1="52" x2={x} y2="385" />
        ))}
        {[85, 145, 205, 265, 325, 385].map((y) => (
          <line key={`y-${y}`} x1="90" y1={y} x2="585" y2={y} />
        ))}
      </g>

      <line
        x1="90"
        y1="385"
        x2="600"
        y2="385"
        stroke="#1f332d"
        strokeOpacity="0.35"
      />
      <line
        x1="90"
        y1="385"
        x2="90"
        y2="42"
        stroke="#1f332d"
        strokeOpacity="0.35"
      />
      <text
        x="600"
        y="420"
        textAnchor="end"
        fill="#1f332d"
        fillOpacity="0.55"
        fontSize="14"
      >
        profit shock
      </text>
      <text x="105" y="36" fill="#1f332d" fillOpacity="0.55" fontSize="14">
        jobs shock
      </text>

      <path
        d="M112 365 L548 95"
        stroke="#23766f"
        strokeOpacity="0.13"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M112 365 L548 95"
        stroke="#23766f"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd="url(#blue-head)"
      />
      <text x="386" y="142" fill="#23766f" fontSize="15" fontWeight="700">
        what the first asset pays for
      </text>

      <path
        d="M337 225 L190 89"
        stroke={secondAsset ? '#23766f' : '#b95736'}
        strokeOpacity={secondAsset ? 0.13 : 0}
        strokeWidth={secondAsset ? 18 : 0}
        strokeLinecap="round"
      />
      <path
        d="M337 225 L190 89"
        stroke={secondAsset ? '#23766f' : '#b95736'}
        strokeWidth="4"
        strokeDasharray={secondAsset ? undefined : '9 8'}
        markerEnd={secondAsset ? 'url(#blue-head)' : 'url(#orange-head)'}
        className="transition-all duration-500"
      />
      <text
        x="112"
        y="70"
        fill={secondAsset ? '#23766f' : '#b95736'}
        fontSize="15"
        fontWeight="700"
      >
        {secondAsset
          ? 'what the second asset adds'
          : 'what the first asset misses'}
      </text>

      <circle
        cx="337"
        cy="225"
        r="8"
        fill="#f7f3eb"
        stroke="#1f332d"
        strokeOpacity="0.45"
        strokeWidth="2"
      />
      <circle
        cx="190"
        cy="89"
        r="5"
        fill={secondAsset ? '#23766f' : '#b95736'}
      />
    </svg>
  );
}

function TimingGraphic() {
  return (
    <figure className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_18px_55px_rgba(28,43,38,0.07)] sm:p-8">
      <figcaption className="text-sm font-semibold">
        Why owning and taxing are not the same move
      </figcaption>
      <div className="mt-7 grid gap-4 lg:grid-cols-[0.75fr_32px_1fr_32px_1fr] lg:items-center">
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-white/50">
            Now
          </p>
          <p className="mt-2 font-semibold">Automation news arrives</p>
        </div>
        <ArrowRight
          className="hidden size-5 text-ink/35 lg:block"
          aria-hidden="true"
        />
        <div className="rounded-2xl bg-mist p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
            Public ownership
          </p>
          <p className="mt-2 font-semibold">
            An asset already owned can rise immediately
          </p>
        </div>
        <ArrowRight
          className="hidden size-5 text-ink/35 lg:block"
          aria-hidden="true"
        />
        <div className="rounded-2xl bg-[#f8e9e3] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-rust">
            Capital tax
          </p>
          <p className="mt-2 font-semibold">
            A tax changes investment, wages and revenue over time
          </p>
        </div>
      </div>
    </figure>
  );
}

export default function Home() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('downside');
  const [secondAsset, setSecondAsset] = useState(false);
  const scenario = content.scenarios[scenarioKey];

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="font-display text-lg font-semibold tracking-[-0.02em]"
            aria-label="TAI Public Finance home"
          >
            TAI Public Finance
          </a>
          <nav
            className="hidden items-center gap-6 text-sm text-ink/62 md:flex"
            aria-label="Main navigation"
          >
            <a href="#idea" className="hover:text-ink">
              The idea
            </a>
            <a href="#assets" className="hover:text-ink">
              Public assets
            </a>
            <a href="#policy" className="hover:text-ink">
              Policy choices
            </a>
          </nav>
          <a
            href="#read"
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal"
          >
            Read the research
          </a>
        </div>
      </header>

      <section className="hero-grid border-b border-ink/10">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rust">
              Automation and the public balance sheet
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.4rem,7.2vw,7rem)] leading-[0.9] tracking-[-0.06em]">
              Automation affects capitalists and workers differently.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/68 sm:text-xl sm:leading-9">
              When technology raises profits faster than wages, ownership
              decides who gets the upside. This research asks whether government
              can use its own assets to give workers a larger stake.
            </p>
            <a
              href="#idea"
              className="mt-9 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold"
            >
              See how it works{' '}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <HeroGraphic />
        </div>
      </section>

      <section id="idea" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="Start here"
            title="A boom for capital can still leave workers behind."
            copy="The economy can grow while the gains land unevenly. Move between three versions of the same automation shock to see the difference."
          />

          <fieldset
            className="mt-10 flex flex-wrap gap-2"
            aria-label="Choose an automation shock"
          >
            {scenarioOrder.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenarioKey(key)}
                aria-pressed={scenarioKey === key}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  scenarioKey === key
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 bg-paper text-ink/65 hover:border-ink/35'
                }`}
              >
                {content.scenarios[key].shortLabel}
              </button>
            ))}
          </fieldset>

          <div className="mt-6 grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <DistributionChart scenarioKey={scenarioKey} />
            <div className="pt-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                {scenario.label}
              </p>
              <h3 className="mt-4 font-display text-4xl leading-[1.05] tracking-[-0.04em]">
                {scenario.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-ink/66">
                {scenario.explanation}
              </p>

              <div className="mt-9 rounded-2xl bg-paper p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-rust">
                  The whole idea in one ratio
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <p className="font-display text-5xl tracking-[-0.04em]">
                    Θ ={' '}
                    <span className="inline-flex flex-col align-middle text-center text-[0.55em] leading-none">
                      <span className="border-b border-ink px-2 pb-1">
                        m<sub>G</sub>
                      </span>
                      <span className="px-2 pt-1">
                        m<sub>I</sub>
                      </span>
                    </span>
                  </p>
                  <p className="max-w-sm text-sm leading-6 text-ink/62">
                    Θ is high when an extra £1 in the public budget matters more
                    to workers than the same £1 matters to the investors pricing
                    the asset.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-2">
                  <p className="text-sm leading-6 text-ink/60">
                    <strong className="text-ink">
                      m<sub>G</sub>
                    </strong>{' '}
                    is what £1 is worth to workers through the public budget.
                  </p>
                  <p className="text-sm leading-6 text-ink/60">
                    <strong className="text-ink">
                      m<sub>I</sub>
                    </strong>{' '}
                    is what £1 is worth to the investors setting the market
                    price.
                  </p>
                </div>
                <p className="mt-5 font-semibold leading-7">
                  The useful public asset is the one that pays when Θ is high.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="assets" className="scroll-mt-24 border-y border-ink/10">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="What matters"
            title="The asset has to rise at the right moment."
            copy="Calling something an automation asset tells us very little. The important question is whether it pays when workers are missing income."
          />
          <div className="mt-12">
            <StatePayoffGraphic />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
              One asset is not every asset
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[0.98] tracking-[-0.045em]">
              Buying more of the same asset only gets you more of the same
              payoff.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink/68">
              The first asset follows the green line. If another part of the
              automation shock sits off that line, increasing the position does
              not reach it. A second asset needs to pay differently.
            </p>
            <fieldset
              className="mt-8 inline-flex rounded-full border border-ink/12 bg-paper p-1"
              aria-label="Choose the public asset menu"
            >
              <button
                type="button"
                onClick={() => setSecondAsset(false)}
                aria-pressed={!secondAsset}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!secondAsset ? 'bg-ink text-white' : 'text-ink/55'}`}
              >
                One asset
              </button>
              <button
                type="button"
                onClick={() => setSecondAsset(true)}
                aria-pressed={secondAsset}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${secondAsset ? 'bg-ink text-white' : 'text-ink/55'}`}
              >
                Two different assets
              </button>
            </fieldset>
          </div>
          <figure className="rounded-[1.75rem] border border-ink/10 bg-paper p-4 shadow-[0_18px_55px_rgba(28,43,38,0.07)] sm:p-6">
            <PayoffSpanGraphic secondAsset={secondAsset} />
            <figcaption className="border-t border-ink/10 px-2 pt-4 text-sm leading-6 text-ink/58">
              {secondAsset
                ? 'A second asset adds something only if its payoff moves in a genuinely different direction.'
                : 'The orange arrow is the part of the shock that the first asset misses.'}
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="policy" className="scroll-mt-24 border-y border-ink/10">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
          <SectionIntro
            label="The policy choice"
            title="Saving, owning and taxing do different jobs."
            copy="They can all put money behind workers. They do it at different times and change different parts of the economy."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: PiggyBank,
                name: 'Save',
                copy: 'Put money aside now so government has more to spend later.',
              },
              {
                icon: LineChart,
                name: 'Own',
                copy: 'Hold an asset that rises when workers are getting less of the gains.',
              },
              {
                icon: Landmark,
                name: 'Tax',
                copy: 'Take a share of capital income, while changing the reward to investment.',
              },
            ].map(({ icon: Icon, name, copy }) => (
              <article
                key={name}
                className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-7"
              >
                <span className="grid size-11 place-items-center rounded-full bg-mist text-teal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-8 font-display text-3xl tracking-[-0.035em]">
                  {name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <TimingGraphic />
          </div>

          <div className="mt-10 grid gap-5 rounded-[1.75rem] bg-ink p-7 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <h3 className="font-display text-3xl leading-tight tracking-[-0.035em] sm:text-4xl">
              A fair comparison starts in the same place.
            </h3>
            <p className="text-base leading-7 text-white/66">
              Same economy. Same public debt. Same tax rate. Then change one
              policy and see what it actually does.
            </p>
          </div>
        </div>
      </section>

      <section id="read" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
              Go deeper
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none tracking-[-0.045em]">
              Read the research.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/Nathan-Barnard/tai-public-finance-home/blob/main/notebooks/00_start_here.ipynb"
              className="group rounded-2xl border border-ink/12 bg-paper p-6 transition hover:-translate-y-1 hover:border-teal/55"
            >
              <BookOpen className="size-5 text-teal" aria-hidden="true" />
              <p className="mt-10 font-semibold">Guided notebooks</p>
              <p className="mt-2 text-sm leading-6 text-ink/55">
                Work through the economics and the model step by step.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                Start reading <ArrowRight className="size-3.5" />
              </span>
            </a>
            <a
              href={content.implementationRepository}
              className="group rounded-2xl border border-ink/12 bg-paper p-6 transition hover:-translate-y-1 hover:border-teal/55"
            >
              <LineChart className="size-5 text-teal" aria-hidden="true" />
              <p className="mt-10 font-semibold">Website and code</p>
              <p className="mt-2 text-sm leading-6 text-ink/55">
                Open the public repository behind this project.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                Open GitHub <ArrowRight className="size-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-8 text-xs text-ink/48 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>TAI Public Finance</p>
          <p>Research by Nathan Barnard</p>
        </div>
      </footer>
    </main>
  );
}
