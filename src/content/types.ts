// Narrative content is kept apart from the visual components that draw it.

export type Move = 'falls' | 'flat' | 'rises' | 'rises-faster';

export type DistributionState = {
  id: string;
  label: string;
  title: string;
  copy: string;
  worker: Move;
  capital: Move;
  profits: Move;
  assets: Move;
  /** Plain verdict used in the text alternative and live announcement. */
  verdict: string;
};

export type ActorNode = {
  id: 'workers' | 'owners' | 'government' | 'markets';
  name: string;
  description: string;
};

export type FlowStep = { title: string; copy: string };

export type PayoffLane = {
  id: string;
  title: string;
  steps: [string, string, string];
  pays: boolean;
  readout: string;
};

export type AlignmentCase = {
  id: string;
  label: string;
  verdict: string;
  note: string;
  /** Position in the alignment field: 0–1 across, 0–1 up. */
  x: number;
  y: number;
  reaches: 'yes' | 'no' | 'wrong-place';
  labelSide: 'left' | 'right' | 'below';
};

export type PayoffMode = {
  id: 'one' | 'two';
  label: string;
  copy: string[];
};

export type Instrument = {
  id: 'saving' | 'ownership' | 'taxation';
  name: string;
  copy: string;
  visual: 'time-rail' | 'state-field' | 'transition-loop';
  takeaway: string;
  caveat?: string;
};

export type TimelineBeat = {
  id: string;
  title: string;
  copy: string;
};

export type SuccessorState = {
  id: 'labour-using' | 'labour-light';
  name: string;
  description: string;
};

export type ExpertNote = {
  title: 'See the model behind this' | 'Read the economics';
  copy: string[];
  paperHref?: string;
  notebookHref?: string;
};

export type Action = { label: string; href: string; external?: boolean };

export type VisualSpec =
  | { kind: 'hero-split' }
  | { kind: 'distribution'; states: DistributionState[] }
  | { kind: 'ownership-flow'; actors: ActorNode[]; steps: FlowStep[] }
  | { kind: 'state-payoff'; lanes: PayoffLane[]; after: string[] }
  | { kind: 'theta' }
  | { kind: 'payoff-alignment'; cases: AlignmentCase[]; caveat: string }
  | { kind: 'payoff-space'; modes: PayoffMode[] }
  | { kind: 'instrument-stage'; instruments: Instrument[]; takeaways: string[] }
  | { kind: 'timeline'; beats: TimelineBeat[] }
  | { kind: 'successor-space'; states: SuccessorState[]; caveat: string }
  | { kind: 'questions'; questions: string[] }
  | { kind: 'lab-embed' }
  | { kind: 'closing'; actions: Action[] };

export type StorySection = {
  slug: string;
  /** Present on the first section of each navigation chapter. */
  navLabel?: string;
  eyebrow?: string;
  headline: string;
  body: string[];
  exitLine?: string;
  actions?: Action[];
  visual: VisualSpec;
  expertNote?: ExpertNote;
  theme: 'paper' | 'bone' | 'ink';
};
