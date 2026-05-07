/**
 * generate-base-xlsx.cjs
 *
 * Parses electoral_district.mw and generates representative_base.xlsx
 * with two sheets:
 *   - MP:   one row per federal constituency (222 rows)
 *   - ADUN: one row per state constituency (all N.xx seats)
 *
 * Usage:
 *   node data/scripts/generate-base-xlsx.cjs
 */

'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const MW_FILE = path.join(__dirname, '../mw/electoral_district.mw');
const OUTPUT_PATH = path.join(__dirname, '../xlsx/representative_base.xlsx');

// ---------------------------------------------------------------------------
// Headers (same as existing create-base-xlsx.cjs)
// ---------------------------------------------------------------------------
const HEADERS = [
  'electedYear',
  'state',
  'federalSeatCode',
  'federalSeatName',
  'stateSeatCode',
  'stateSeatName',
  'pollingDistricts',
  'name',
  'party',
  'gender',
  'address',
  'email',
  'phoneNumber',
  'facebook',
  'twitter/𝕏',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract plain text from a wikitext link: [[Target|Label]] → Label (or Target).
 */
function extractLinkText(str) {
  const match = str.match(/\[\[([^\]]+)\]\]/);
  if (!match) return str;
  const inner = match[1];
  const pipe = inner.indexOf('|');
  return pipe === -1 ? inner : inner.slice(pipe + 1);
}

/**
 * Normalise a code: "P.001" → "P001", "N.01" → "N01"
 */
function normaliseCode(raw) {
  return raw.replace('.', '').trim();
}

/**
 * Format a normalised code back to dot-notation: "P001" → "P.001", "N01" → "N.01"
 */
function formatCodeWithDot(code, prefix) {
  const digits = code.slice(prefix.length);
  return `${prefix}.${digits}`;
}

// ---------------------------------------------------------------------------
// Parse electoral_district.mw
// ---------------------------------------------------------------------------

function parseElectoralDistricts(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  // Result: ordered array of federal seats
  const federalSeats = [];
  let currentState = '';
  let currentFederal = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // State header: ==Perlis==
    const stateMatch = line.match(/^==([^=]+)==\s*$/);
    if (stateMatch) {
      currentState = stateMatch[1].trim();
      continue;
    }

    // Federal seat with rowspan: | rowspan=N| P.001 [[Padang Besar (federal constituency)|Padang Besar]]
    const fedMatch = line.match(/\|\s*rowspan=\d+\|\s*(P\.\d+)\s+\[\[([^\]]+)\]\]/);
    if (fedMatch) {
      const code = normaliseCode(fedMatch[1]);
      const linkText = extractLinkText(`[[${fedMatch[2]}]]`);
      const name = linkText.replace(/\s*\(federal constituency\)/i, '').trim();
      currentFederal = { code, name, state: currentState, stateSeats: [] };
      federalSeats.push(currentFederal);
    }

    // Federal Territory seat (no state seat column):
    // | P.114 [[Kepong (federal constituency)|Kepong]] || 19 || ...
    const ftFedMatch = line.match(/^\|\s*(P\.\d+)\s+\[\[([^\]]+)\]\]\s*\|\|/);
    if (ftFedMatch && !fedMatch) {
      const code = normaliseCode(ftFedMatch[1]);
      const linkText = extractLinkText(`[[${ftFedMatch[2]}]]`);
      const name = linkText.replace(/\s*\(federal constituency\)/i, '').trim();
      currentFederal = { code, name, state: currentState, stateSeats: [] };
      federalSeats.push(currentFederal);

      // For Federal Territories, the polling districts are on this same line
      // but there are no state seats — we don't need to add ADUN rows
    }

    // State seat row: | N.01 [[Titi Tinggi (state constituency)|Titi Tinggi]] || 7 || Dist1, Dist2
    const stateMatch2 = line.match(/\|\s*(N\.\d+)\s+\[\[([^\]]+)\]\]\s*\|\|\s*\d+\s*\|\|\s*(.+)/);
    if (stateMatch2 && currentFederal) {
      const code = normaliseCode(stateMatch2[1]);
      const linkText = extractLinkText(`[[${stateMatch2[2]}]]`);
      const name = linkText
        .replace(/\s*\([^)]*state constituency[^)]*\)/i, '')
        .replace(/\s*\([^)]*\)/i, '')  // catch remaining parenthetical like "(Kedah state constituency)"
        .trim();
      const rawDistricts = stateMatch2[3];
      const pollingDistricts = rawDistricts
        .split(',')
        .map(d => d.replace(/\{\{not a typo\|([^}]+)\}\}/g, '$1').trim())
        .filter(Boolean);

      currentFederal.stateSeats.push({ code, name, pollingDistricts });
    }
  }

  return federalSeats;
}

// ---------------------------------------------------------------------------
// Build sheets
// ---------------------------------------------------------------------------

function buildMPRows(federalSeats) {
  return federalSeats.map(fed => ({
    electedYear: '',
    state: fed.state,
    federalSeatCode: formatCodeWithDot(fed.code, 'P'),
    federalSeatName: fed.name,
    stateSeatCode: '',
    stateSeatName: '',
    pollingDistricts: '',
    name: '',
    party: '',
    gender: '',
    address: '',
    email: '',
    phoneNumber: '',
    facebook: '',
    'twitter/𝕏': '',
  }));
}

function buildADUNRows(federalSeats) {
  const rows = [];
  for (const fed of federalSeats) {
    for (const seat of fed.stateSeats) {
      rows.push({
        electedYear: '',
        state: fed.state,
        federalSeatCode: formatCodeWithDot(fed.code, 'P'),
        federalSeatName: fed.name,
        stateSeatCode: formatCodeWithDot(seat.code, 'N'),
        stateSeatName: seat.name,
        pollingDistricts: seat.pollingDistricts.join(';'),
        name: '',
        party: '',
        gender: '',
        address: '',
        email: '',
        phoneNumber: '',
        facebook: '',
        'twitter/𝕏': '',
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Write XLSX
// ---------------------------------------------------------------------------

function createSheet(rows) {
  const data = [HEADERS, ...rows.map(r => HEADERS.map(h => r[h] ?? ''))];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Column widths
  ws['!cols'] = HEADERS.map(h => {
    if (h === 'pollingDistricts') return { wch: 80 };
    if (h === 'name') return { wch: 36 };
    if (['federalSeatName', 'stateSeatName', 'state'].includes(h)) return { wch: 28 };
    if (['federalSeatCode', 'stateSeatCode'].includes(h)) return { wch: 16 };
    return { wch: 18 };
  });

  return ws;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`Parsing ${MW_FILE}...`);
const federalSeats = parseElectoralDistricts(MW_FILE);
console.log(`  Found ${federalSeats.length} federal seats.`);

const totalStateSeats = federalSeats.reduce((sum, f) => sum + f.stateSeats.length, 0);
console.log(`  Found ${totalStateSeats} state seats.`);

const mpRows = buildMPRows(federalSeats);
const adunRows = buildADUNRows(federalSeats);

console.log(`  MP sheet: ${mpRows.length} rows`);
console.log(`  ADUN sheet: ${adunRows.length} rows`);

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, createSheet(mpRows), 'MP');
XLSX.utils.book_append_sheet(wb, createSheet(adunRows), 'ADUN');

XLSX.writeFile(wb, OUTPUT_PATH);
console.log(`\nCreated ${OUTPUT_PATH}`);
