// Fetches the dashboard's time series from open, keyless public sources and
// freezes them into src/data/indicators.json with provenance. The site reads
// that file at build time only; nothing is fetched while a reader is on the
// page. Run with `npm run data` and commit the result.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'src/data/indicators.json');
const UA =
  'tai-public-finance-home indicators (https://github.com/Nathan-Barnard/tai-public-finance-home)';

const PLACES = {
  USA: 'United States',
  GBR: 'United Kingdom',
  DEU: 'Germany',
  JPN: 'Japan',
  FRA: 'France',
  KOR: 'South Korea',
  CHN: 'China',
};

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': UA } });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.text();
}

function parseCsv(textValue) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < textValue.length; i++) {
    const c = textValue[i];
    if (quoted) {
      if (c === '"' && textValue[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

// ---- sources -------------------------------------------------------------

async function fred(id) {
  const rows = parseCsv(
    await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`),
  ).slice(1);
  return rows
    .filter((r) => r[1] !== '.' && r[1] !== '')
    .map((r) => [r[0], Number(r[1])]);
}

async function fredTitle(id) {
  const html = await fetchText(`https://fred.stlouisfed.org/series/${id}`);
  const match = html.replace(/\n/g, ' ').match(/<title>([^<]*)<\/title>/);
  return match ? match[1].replace(/\s*\|\s*FRED.*$/, '').trim() : id;
}

async function worldBank(indicator, codes) {
  const url = `https://api.worldbank.org/v2/country/${codes.join(';')}/indicator/${indicator}?format=json&per_page=2000&date=1960:2030`;
  const [, rows] = JSON.parse(await fetchText(url));
  const out = {};
  for (const r of rows) {
    if (r.value === null) continue;
    (out[r.countryiso3code] ??= []).push([r.date, Number(r.value)]);
  }
  for (const code of Object.keys(out))
    out[code].sort((a, b) => a[0].localeCompare(b[0]));
  return out;
}

async function imf(indicator, codes, maxYear) {
  const url = `https://www.imf.org/external/datamapper/api/v1/${indicator}/${codes.join('/')}`;
  const data = JSON.parse(await fetchText(url)).values[indicator];
  const out = {};
  for (const code of codes) {
    const entries = Object.entries(data[code] ?? {})
      .filter(([year]) => Number(year) <= maxYear)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, value]) => [year, Number(value)]);
    if (entries.length) out[code] = entries;
  }
  return out;
}

async function owid(slug) {
  const csv = parseCsv(
    await fetchText(
      `https://ourworldindata.org/grapher/${slug}.csv?v=1&csvType=full&useColumnShortNames=true`,
    ),
  );
  const meta = JSON.parse(
    await fetchText(
      `https://ourworldindata.org/grapher/${slug}.metadata.json?v=1&csvType=full&useColumnShortNames=true`,
    ),
  );
  const header = csv[0];
  const valueColumn = header.length - 1;
  const out = {};
  for (const r of csv.slice(1)) {
    if (r[valueColumn] === '' || r[valueColumn] === undefined) continue;
    (out[r[0]] ??= []).push([r[2], Number(r[valueColumn])]);
  }
  for (const entity of Object.keys(out))
    out[entity].sort((a, b) => a[0].localeCompare(b[0]));
  return { data: out, meta };
}

// ---- transforms ----------------------------------------------------------

const fromYear = (rows, year) =>
  rows.filter((r) => Number(r[0].slice(0, 4)) >= year);

function monthlyAverage(daily) {
  const groups = new Map();
  for (const [date, value] of daily) {
    const key = date.slice(0, 7);
    const g = groups.get(key) ?? { sum: 0, n: 0 };
    g.sum += value;
    g.n += 1;
    groups.set(key, g);
  }
  return [...groups].map(([key, g]) => [`${key}-01`, round(g.sum / g.n, 2)]);
}

function ratio(numerator, denominator, scaleBy = 100, digits = 2) {
  const map = new Map(denominator);
  return numerator
    .filter((r) => map.has(r[0]) && map.get(r[0]) !== 0)
    .map((r) => [r[0], round((r[1] / map.get(r[0])) * scaleBy, digits)]);
}

function rebase(rows, baseDate, digits = 1) {
  const base = rows.find((r) => r[0] === baseDate)?.[1];
  if (!base) throw new Error(`No base observation at ${baseDate}`);
  return rows.map((r) => [r[0], round((r[1] / base) * 100, digits)]);
}

const round = (v, d) => Number(v.toFixed(d));
const roundAll = (rows, d) => rows.map((r) => [r[0], round(r[1], d)]);

function series(place, code, values) {
  const last = values[values.length - 1];
  return { place, code, lastDate: last[0], lastValue: last[1], values };
}

// ---- charts --------------------------------------------------------------

const charts = [];
const failures = [];

async function chart(id, build) {
  try {
    const result = await build();
    charts.push({ id, ...result });
    console.log(
      `✓ ${id} (${result.series.length} series, ${result.series.reduce((n, s) => n + s.values.length, 0)} points)`,
    );
  } catch (error) {
    failures.push(`${id}: ${error.message}`);
    console.error(`✗ ${id}: ${error.message}`);
  }
}

const fredSource = (ids, name) => ({
  name,
  url: `https://fred.stlouisfed.org/series/${ids[0]}`,
  citation: `Retrieved from FRED, Federal Reserve Bank of St. Louis (${ids.join(', ')})`,
  series: ids,
});

await chart('labour-share', async () => {
  const codes = {
    USA: 'LABSHPUSA156NRUG',
    GBR: 'LABSHPGBA156NRUG',
    DEU: 'LABSHPDEA156NRUG',
    JPN: 'LABSHPJPA156NRUG',
    FRA: 'LABSHPFRA156NRUG',
    KOR: 'LABSHPKRA156NRUG',
    CHN: 'LABSHPCNA156NRUG',
  };
  const out = [];
  for (const [iso, id] of Object.entries(codes))
    out.push(
      series(
        PLACES[iso],
        id,
        (await fred(id)).map((r) => [r[0].slice(0, 4), round(r[1] * 100, 1)]),
      ),
    );
  return {
    title: 'Share of labour compensation in GDP',
    unit: '% of GDP',
    frequency: 'annual',
    source: {
      ...fredSource(
        Object.values(codes),
        'Penn World Table (University of Groningen) via FRED',
      ),
      citation:
        'Feenstra, Inklaar and Timmer, Penn World Table, retrieved from FRED, Federal Reserve Bank of St. Louis',
    },
    series: out,
  };
});

await chart('labour-share-us-quarterly', async () => {
  const id = 'PRS85006173';
  const rows = fromYear(await fred(id), 1970).map((r) => [
    r[0],
    round(r[1], 1),
  ]);
  return {
    title: await fredTitle(id),
    unit: 'index, 2017 = 100',
    frequency: 'quarterly',
    source: fredSource([id], 'U.S. Bureau of Labor Statistics via FRED'),
    series: [series('United States', id, rows)],
  };
});

await chart('profits-share-us', async () => {
  const cp = await fred('CP');
  const gdp = await fred('GDP');
  return {
    title: 'Corporate profits after tax as a share of GDP',
    unit: '% of GDP',
    frequency: 'quarterly',
    source: fredSource(
      ['CP', 'GDP'],
      'U.S. Bureau of Economic Analysis via FRED',
    ),
    series: [series('United States', 'CP/GDP', fromYear(ratio(cp, gdp), 1970))],
    note: 'Corporate profits after tax without inventory valuation and capital consumption adjustments, divided by nominal GDP.',
  };
});

await chart('robots', async () => {
  const { data, meta } = await owid('annual-industrial-robots-installed');
  const wanted = ['United States', 'China', 'Germany', 'Japan', 'South Korea'];
  return {
    title: meta.chart.title,
    unit: 'robots installed per year',
    frequency: 'annual',
    source: {
      name: 'International Federation of Robotics via the AI Index and Our World in Data',
      url: 'https://ourworldindata.org/grapher/annual-industrial-robots-installed',
      citation: meta.chart.citation,
    },
    series: wanted
      .filter((p) => data[p])
      .map((p) => series(p, 'industrial_robot_installations', data[p])),
  };
});

await chart('ai-investment', async () => {
  const { data, meta } = await owid(
    'private-investment-in-artificial-intelligence',
  );
  const wanted = ['United States', 'China', 'Europe'];
  return {
    title: meta.chart.title,
    unit: 'US$ billions, constant 2021 prices',
    frequency: 'annual',
    source: {
      name: 'Quid via the AI Index and Our World in Data',
      url: 'https://ourworldindata.org/grapher/private-investment-in-artificial-intelligence',
      citation: meta.chart.citation,
    },
    series: wanted
      .filter((p) => data[p])
      .map((p) =>
        series(
          p,
          'private_investment',
          data[p].map((r) => [r[0], round(r[1] / 1e9, 1)]),
        ),
      ),
    note: meta.chart.note,
  };
});

await chart('ai-adoption', async () => {
  const { data, meta } = await owid(
    'share-companies-using-artificial-intelligence',
  );
  const wanted = [
    'All geographies',
    'North America',
    'Europe',
    'Asia-Pacific',
    'Greater China',
    'Developing markets',
  ];
  return {
    title: meta.chart.title,
    unit: '% of surveyed organisations',
    frequency: 'annual',
    source: {
      name: 'McKinsey global survey via the AI Index and Our World in Data',
      url: 'https://ourworldindata.org/grapher/share-companies-using-artificial-intelligence',
      citation: meta.chart.citation,
    },
    series: wanted
      .filter((p) => data[p])
      .map((p) =>
        series(
          p,
          'pct_of_respondents',
          data[p].map((r) => [r[0], round(r[1], 0)]),
        ),
      ),
    note: meta.chart.subtitle ?? meta.chart.note,
  };
});

await chart('software-investment-us', async () => {
  const gdp = await fred('GDP');
  const software = await fred('B985RC1Q027SBEA');
  const ipp = await fred('Y001RC1Q027SBEA');
  return {
    title:
      'Business investment in software and intellectual property, share of GDP',
    unit: '% of GDP',
    frequency: 'quarterly',
    source: fredSource(
      ['B985RC1Q027SBEA', 'Y001RC1Q027SBEA', 'GDP'],
      'U.S. Bureau of Economic Analysis via FRED',
    ),
    series: [
      series(
        'Software',
        'B985RC1Q027SBEA/GDP',
        fromYear(ratio(software, gdp), 1970),
      ),
      series(
        'All intellectual property products',
        'Y001RC1Q027SBEA/GDP',
        fromYear(ratio(ipp, gdp), 1970),
      ),
    ],
    note: 'Nominal private nonresidential fixed investment divided by nominal GDP. Intellectual property products include software, research and development, and entertainment originals.',
  };
});

await chart('productivity-and-pay-us', async () => {
  const productivity = await fred('OPHNFB');
  const pay = await fred('COMPRNFB');
  return {
    title: 'Labour productivity and real hourly compensation, nonfarm business',
    unit: 'index, 1970 = 100',
    frequency: 'quarterly',
    source: fredSource(
      ['OPHNFB', 'COMPRNFB'],
      'U.S. Bureau of Labor Statistics via FRED',
    ),
    series: [
      series(
        'Output per hour',
        'OPHNFB',
        rebase(fromYear(productivity, 1970), '1970-01-01'),
      ),
      series(
        'Real hourly compensation',
        'COMPRNFB',
        rebase(fromYear(pay, 1970), '1970-01-01'),
      ),
    ],
  };
});

await chart('share-prices', async () => {
  const codes = {
    USA: 'SPASTT01USM661N',
    GBR: 'SPASTT01GBM661N',
    DEU: 'SPASTT01DEM661N',
    JPN: 'SPASTT01JPM661N',
    FRA: 'SPASTT01FRM661N',
    KOR: 'SPASTT01KRM661N',
    CHN: 'SPASTT01CNM661N',
  };
  const out = [];
  for (const [iso, id] of Object.entries(codes))
    out.push(
      series(PLACES[iso], id, roundAll(fromYear(await fred(id), 2000), 1)),
    );
  return {
    title: 'Share prices, all shares',
    unit: 'index, 2015 = 100',
    frequency: 'monthly',
    source: fredSource(
      Object.values(codes),
      'OECD Main Economic Indicators via FRED',
    ),
    series: out,
  };
});

await chart('sp500', async () => {
  const id = 'SP500';
  return {
    title: 'S&P 500, monthly average of daily closes',
    unit: 'index level',
    frequency: 'monthly',
    source: fredSource([id], 'S&P Dow Jones Indices via FRED'),
    series: [series('United States', id, monthlyAverage(await fred(id)))],
    note: 'FRED carries the most recent ten years of this index.',
  };
});

await chart('market-cap', async () => {
  const codes = Object.keys(PLACES);
  const data = await worldBank('CM.MKT.LCAP.GD.ZS', codes);
  return {
    title: 'Market capitalisation of listed domestic companies',
    unit: '% of GDP',
    frequency: 'annual',
    source: {
      name: 'World Bank, World Development Indicators',
      url: 'https://data.worldbank.org/indicator/CM.MKT.LCAP.GD.ZS',
      citation:
        'World Bank, World Development Indicators (CM.MKT.LCAP.GD.ZS), from the World Federation of Exchanges',
    },
    series: codes
      .filter((c) => data[c])
      .map((c) =>
        series(PLACES[c], `CM.MKT.LCAP.GD.ZS/${c}`, roundAll(data[c], 1)),
      ),
    note: 'Coverage ends earlier for some countries where the source has not been updated.',
  };
});

await chart('long-rates', async () => {
  const codes = {
    USA: 'IRLTLT01USM156N',
    GBR: 'IRLTLT01GBM156N',
    DEU: 'IRLTLT01DEM156N',
    JPN: 'IRLTLT01JPM156N',
    FRA: 'IRLTLT01FRM156N',
    KOR: 'IRLTLT01KRM156N',
  };
  const out = [];
  for (const [iso, id] of Object.entries(codes))
    out.push(
      series(PLACES[iso], id, roundAll(fromYear(await fred(id), 1990), 2)),
    );
  return {
    title: 'Ten-year government bond yields',
    unit: '% per year',
    frequency: 'monthly',
    source: fredSource(
      Object.values(codes),
      'OECD Main Economic Indicators via FRED',
    ),
    series: out,
  };
});

await chart('us-rates', async () => {
  const nominal = monthlyAverage(fromYear(await fred('DGS10'), 2003));
  const real = monthlyAverage(fromYear(await fred('DFII10'), 2003));
  return {
    title:
      'United States ten-year Treasury yield, nominal and inflation-indexed',
    unit: '% per year',
    frequency: 'monthly',
    source: fredSource(
      ['DGS10', 'DFII10'],
      'Board of Governors of the Federal Reserve System via FRED',
    ),
    series: [
      series('Nominal ten-year', 'DGS10', nominal),
      series('Inflation-indexed ten-year', 'DFII10', real),
    ],
    note: 'Monthly averages of daily constant-maturity yields.',
  };
});

await chart('government-debt', async () => {
  const codes = Object.keys(PLACES);
  const data = await imf('GGXWDG_NGDP', codes, 2025);
  return {
    title: 'General government gross debt',
    unit: '% of GDP',
    frequency: 'annual',
    source: {
      name: 'IMF World Economic Outlook database',
      url: 'https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO',
      citation:
        'International Monetary Fund, World Economic Outlook (GGXWDG_NGDP)',
    },
    series: codes
      .filter((c) => data[c])
      .map((c) => series(PLACES[c], `GGXWDG_NGDP/${c}`, roundAll(data[c], 1))),
    note: 'The most recent year is an IMF estimate. Later years are not shown.',
  };
});

await chart('unemployment', async () => {
  const codes = Object.keys(PLACES);
  const data = await imf('LUR', codes, 2025);
  return {
    title: 'Unemployment rate',
    unit: '% of the labour force',
    frequency: 'annual',
    source: {
      name: 'IMF World Economic Outlook database',
      url: 'https://www.imf.org/external/datamapper/LUR@WEO',
      citation: 'International Monetary Fund, World Economic Outlook (LUR)',
    },
    series: codes
      .filter((c) => data[c])
      .map((c) => series(PLACES[c], `LUR/${c}`, roundAll(data[c], 1))),
    note: 'The most recent year is an IMF estimate. Later years are not shown.',
  };
});

await chart('us-real-earnings', async () => {
  const id = 'LES1252881600Q';
  return {
    title: await fredTitle(id),
    unit: 'dollars per week, 1982–84 prices',
    frequency: 'quarterly',
    source: fredSource([id], 'U.S. Bureau of Labor Statistics via FRED'),
    series: [series('United States', id, await fred(id))],
  };
});

await mkdir(path.dirname(OUT), { recursive: true });
const output = { fetchedAt: new Date().toISOString().slice(0, 10), charts };
await writeFile(OUT, JSON.stringify(output));
const size = (JSON.stringify(output).length / 1024).toFixed(0);
console.log(`\nwrote ${OUT} (${size} kB, ${charts.length} charts)`);
if (failures.length) {
  console.error(
    `\n${failures.length} chart(s) failed:\n  ${failures.join('\n  ')}`,
  );
  process.exit(1);
}
