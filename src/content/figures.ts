// The published figures behind the four evidence exhibits, kept free of any
// import so they can be checked directly by the unit tests.
//
// Transcribed from the project's canonical descriptive evidence record and
// verified against it on 4 September 2026. Descriptive national comparisons:
// none identifies automation as the cause of a national outcome, and none is
// a result of the project's model.

export const WORKER_CASES = [
  {
    place: 'United States',
    period: '1990–2007',
    /** Change in labour's share of income, percentage points a year. */
    labourShare: -0.07,
    /** Change in real hourly compensation, per cent a year. */
    compensation: 1.3,
  },
  {
    place: 'Germany',
    period: '2004–07',
    labourShare: -0.97,
    compensation: -1.51,
  },
] as const;

/** Germany, change from the 2000–03 average to the 2004–07 average, points of GDP. */
export const TAX_COMPONENTS = [
  { label: 'Personal income tax', value: -0.78 },
  { label: 'Employee social contributions', value: -0.37 },
  { label: 'Employer social contributions', value: -0.54 },
  { label: 'Corporate income tax', value: 0.75 },
] as const;

export const TAX_TOTAL = { label: 'Total tax revenue', value: -0.34 } as const;

/** Total tax revenue, per cent of GDP, 1965 and 2024. */
export const LONG_RUN_TAX = [
  { place: 'Germany', start: 31.7, end: 38.0 },
  { place: 'United Kingdom', start: 30.1, end: 34.4 },
  { place: 'United States', start: 23.6, end: 25.6 },
] as const;

/** Average annual real equity return, per cent, by country and worker outcome. */
export const EQUITY_GROUPS = [
  {
    place: 'United States',
    state: 'strong',
    domestic: 15.3,
    restOfWorld: 15.7,
    observations: 9,
  },
  {
    place: 'United States',
    state: 'pressure',
    domestic: 1.9,
    restOfWorld: -1.7,
    observations: 6,
  },
  {
    place: 'United Kingdom',
    state: 'strong',
    domestic: 19.0,
    restOfWorld: 13.8,
    observations: 9,
  },
  {
    place: 'United Kingdom',
    state: 'pressure',
    domestic: 6.2,
    restOfWorld: -1.2,
    observations: 5,
  },
] as const;

/** Required verbatim on the Research page. */
export const RESEARCH_BOUNDARY_SENTENCE =
  'The research combines historical data with a theoretical model. The numerical work is still in progress.';
