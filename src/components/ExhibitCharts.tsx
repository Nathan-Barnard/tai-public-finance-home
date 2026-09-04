import {
  equityOutcomes,
  longRunTax,
  taxComposition,
  workerOutcomes,
} from '@/content/evidence';

import { EquityDotPlot } from './EquityDotPlot';
import { LongRunTaxChart } from './LongRunTaxChart';
import { TaxCompositionChart } from './TaxCompositionChart';
import { WorkerOutcomesChart } from './WorkerOutcomesChart';

/** The chart for each exhibit, kept in one place so both pages agree. */
export const exhibitChart: Record<string, React.ReactNode> = {
  [workerOutcomes.id]: (
    <WorkerOutcomesChart
      cases={workerOutcomes.cases}
      measureNote={workerOutcomes.measureNote}
    />
  ),
  [taxComposition.id]: (
    <TaxCompositionChart
      components={taxComposition.components}
      total={taxComposition.total}
      totalNote={taxComposition.totalNote}
      caption={taxComposition.caption}
      unit={taxComposition.unit}
    />
  ),
  [longRunTax.id]: (
    <LongRunTaxChart
      countries={longRunTax.countries}
      caption={longRunTax.caption}
      unit={longRunTax.unit}
    />
  ),
  [equityOutcomes.id]: (
    <EquityDotPlot
      groups={equityOutcomes.groups}
      caption={equityOutcomes.caption}
      unit={equityOutcomes.unit}
    />
  ),
};
