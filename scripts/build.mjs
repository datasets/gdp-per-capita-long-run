// Build data/*.csv from the two archived workbooks:
//   archive/mpd2023_web.xlsx  Maddison Project Database 2023 (Bolt and van Zanden)
//   archive/pwt110.xlsx       Penn World Table 11.0 (Feenstra, Inklaar and Timmer)
// Deterministic; plain Node, no dependencies. Usage: node scripts/build.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSheet } from './xlsx.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MPD = join(root, 'archive/mpd2023_web.xlsx');
const PWT = join(root, 'archive/pwt110.xlsx');

const isNum = v => typeof v === 'number' && Number.isFinite(v);
const money = v => (isNum(v) ? String(Math.round(v * 100) / 100) : '');
const persons = (v, scale) => (isNum(v) ? String(Math.round(v * scale)) : '');
const csvField = s => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
function writeCsv(file, header, rows) {
  const text = [header, ...rows].map(r => r.map(x => csvField(String(x))).join(',')).join('\n') + '\n';
  writeFileSync(join(root, 'data', file), text);
  console.log(`data/${file}: ${rows.length} rows`);
}
function headerIndex(row, names) {
  return Object.fromEntries(names.map(n => {
    const i = row.indexOf(n);
    if (i < 0) throw new Error(`Column ${n} not found`);
    return [n, i];
  }));
}
const byKey = (a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[2] - b[2]);

// 1. Maddison, by country and year ("Full data" sheet, long format).
{
  const rows = readSheet(MPD, 'Full data');
  const h = headerIndex(rows[0], ['countrycode', 'country', 'region', 'year', 'gdppc', 'pop']);
  const out = [];
  const seen = new Set();
  for (const r of rows.slice(1)) {
    if (!r.length || !r[h.countrycode]) continue;
    const g = money(r[h.gdppc]);
    const p = persons(r[h.pop], 1000); // MPD population is in thousands
    if (g === '' && p === '') continue; // year listed but no estimate
    const year = r[h.year];
    if (!Number.isInteger(year)) throw new Error(`Bad year ${year}`);
    const key = `${r[h.countrycode]}|${year}`;
    if (seen.has(key)) throw new Error(`Duplicate ${key}`);
    seen.add(key);
    out.push([r[h.countrycode], r[h.country], year, g, p, r[h.region]]);
  }
  out.sort(byKey);
  writeCsv('maddison-gdp-per-capita.csv', ['country_code', 'country', 'year', 'gdp_per_capita', 'population', 'region'], out);
}

// 2. Maddison regional and world aggregates ("Regional data" sheet, wide).
{
  const rows = readSheet(MPD, 'Regional data');
  const names = rows[1];
  // Columns 1-8: regional GDP per capita; 9: world GDP per capita.
  // Columns 11-18: regional population; 19: world population (thousands).
  const regions = names.slice(1, 9).map(String);
  if (regions.length !== 8 || names[19] !== 'World Population') throw new Error('Unexpected Regional data layout');
  const series = [...regions.map((name, k) => [name, 1 + k, 11 + k]), ['World', 9, 19]];
  const out = [];
  for (const r of rows.slice(2)) {
    if (!Number.isInteger(r[0])) continue;
    for (const [name, gi, pi] of series) {
      const g = money(r[gi]);
      const p = persons(r[pi], 1000);
      if (g === '' && p === '') continue;
      out.push([name, r[0], g, p]);
    }
  }
  out.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]));
  writeCsv('maddison-regions.csv', ['region', 'year', 'gdp_per_capita', 'population'], out);
}

// 3. Penn World Table 11.0: real GDP per person at chained PPPs, 1950 onward.
{
  const rows = readSheet(PWT, 'Data');
  const h = headerIndex(rows[0], ['countrycode', 'country', 'year', 'rgdpe', 'rgdpo', 'pop']);
  const out = [];
  for (const r of rows.slice(1)) {
    if (!r.length || !r[h.countrycode]) continue;
    const pop = r[h.pop];
    if (!isNum(pop) || pop <= 0) continue;
    const e = isNum(r[h.rgdpe]) ? r[h.rgdpe] / pop : NaN; // both in millions
    const o = isNum(r[h.rgdpo]) ? r[h.rgdpo] / pop : NaN;
    if (!isNum(e) && !isNum(o)) continue;
    out.push([r[h.countrycode], r[h.country], r[h.year], money(e), money(o), persons(pop, 1e6)]);
  }
  out.sort(byKey);
  writeCsv('pwt-gdp-per-capita.csv', ['country_code', 'country', 'year', 'rgdpe_per_capita', 'rgdpo_per_capita', 'population'], out);
}
