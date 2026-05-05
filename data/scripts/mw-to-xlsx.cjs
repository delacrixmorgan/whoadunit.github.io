/**
 * mw-to-xlsx.cjs
 *
 * Converts a MediaWiki election-results file (results_YEAR.mw) and merges
 * the data into representative_base.xlsx (two sheets: MP + ADUN).
 *
 * - results_2022.mw  → adds/updates rows in the "MP"   sheet (type = MP)
 * - results_2023.mw  → adds/updates rows in the "ADUN" sheet (type = ADUN)
 *
 * Existing rows for the same seat code are overwritten; new ones are appended.
 *
 * Usage:
 *   node data/scripts/mw-to-xlsx.cjs <YEAR>
 *   node data/scripts/mw-to-xlsx.cjs 2022
 *   node data/scripts/mw-to-xlsx.cjs 2023
 */

'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const MW_DIR = path.join(__dirname, '../mw');
const XLSX_DIR = path.join(__dirname, '../xlsx');
const ELECTORAL_DISTRICT_FILE = path.join(MW_DIR, 'electoral_district.mw');

// ---------------------------------------------------------------------------
// CLI argument
// ---------------------------------------------------------------------------
const year = process.argv[2];
if (!year || !/^\d{4}$/.test(year)) {
  console.error('Usage: node data/scripts/mw-to-xlsx.cjs <YEAR>');
  console.error('  e.g. node data/scripts/mw-to-xlsx.cjs 2022');
  process.exit(1);
}

const RESULTS_FILE = path.join(MW_DIR, `results_${year}.mw`);
if (!fs.existsSync(RESULTS_FILE)) {
  console.error(`File not found: ${RESULTS_FILE}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Gender guessing
// ---------------------------------------------------------------------------
// Female-indicating name tokens (case-insensitive prefix / whole-word checks)
const FEMALE_TOKENS = [
  // Common Malay female given name prefixes / names
  'siti', 'noor', 'nurul', 'nor ', 'nora', 'nor ', 'fatimah', 'faridah',
  'halimah', 'zainab', 'rohani', 'ramlah', 'hafidzah', 'mardhiyyah',
  'shamsilah', 'asilah', 'halimaton', 'halimaton', 'nik asma', 'nik normi',
  'nur ', 'nura', 'nuri', 'nursyahidah', 'nurasyikin', 'nurhaiza',
  'zuraidin', // ends in -in but female context
  'wan rosmah', 'wan noor', 'wan nor',
  // Titles / particles
  'puan', 'dr. hjh', 'datin',
  // Kelantan / Terengganu female incumbents
  'siti zailah', 'nik asmah', 'nik normi', 'nor asilah', 'nor sham',
  // Specific names from the datasets
  'hafidzah', 'rohani', 'mardhiyyah', 'shamsilah', 'halimaton',
  'suraya', 'mashitah', 'nor azrina', 'nik faizah', 'noraini',
  'marzuani ardila', 'latifah', 'noran zamini', 'shahanim',
  'maizatulakmam', 'fathin amelina', 'zahida', 'norwahida',
  'nurul amal', 'bau wong bau eng', 'salmee', 'sabrina',
  'siti balkhis', 'juliana', 'nuraini', 'suriati', 'siti ashah',
  'nor asilah', 'nor hasita', 'wan mohalina', 'marshella',
  'naziratul aini', 'nik asma', 'nik normi', 'rohani',
];

// Explicit male overrides (names that look female but are male)
const MALE_OVERRIDES = [
  'teh swee leong',
  'adam loh',
  'baddrol',
  'ahmad',
];

/**
 * Guess gender from a representative's name.
 * Returns 'Female' or 'Male'.
 */
function guessGender(name) {
  if (!name) return 'Male';
  const lower = name.toLowerCase();

  // Male override check
  for (const token of MALE_OVERRIDES) {
    if (lower.startsWith(token) || lower.includes(' ' + token)) return 'Male';
  }

  // Female token check
  for (const token of FEMALE_TOKENS) {
    if (lower.startsWith(token) || lower.includes(' ' + token)) return 'Female';
  }

  // Binti / bt. indicates female
  if (/\bbinti\b|\bbt\.?\b/.test(lower)) return 'Female';

  // Names ending in 'a' that are common Malaysian female endings
  // e.g. "Hafidzah", "Mardhiyyah", "Asilah" — already caught above
  // Extra heuristic: names ending in -ah that are NOT common male endings
  const maleAhEndings = ['fadhli', 'marzuk', 'rusmi', 'hashim', 'rahim', 'karim'];
  if (lower.endsWith('ah') || lower.endsWith('iyyah') || lower.endsWith('iah')) {
    const isMaleAh = maleAhEndings.some(e => lower.endsWith(e));
    if (!isMaleAh) return 'Female';
  }

  return 'Male';
}

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
 * Remove wikitext markup and return clean plain text.
 */
function cleanWiki(str) {
  if (!str) return '';
  let s = str;
  // {{Font color|white|NAME|link=...}} → NAME
  s = s.replace(/\{\{Font color\|[^|]+\|([^|}\n]+?)(?:\|link=[^}]*)?\}\}/gi, '$1');
  // [[Link|Label]] → Label, [[Link]] → Link
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
  // Remove <ref...>...</ref> and <ref.../>
  s = s.replace(/<ref[^>]*>.*?<\/ref>/gi, '');
  s = s.replace(/<ref[^/]*\/>/gi, '');
  // Remove HTML tags
  s = s.replace(/<[^>]+>/g, '');
  // Remove remaining {{ }} template debris
  s = s.replace(/\{\{[^}]*\}\}/g, '');
  // Remove '' and ''' bold/italic
  s = s.replace(/'{2,3}/g, '');
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Parse a seat code like "P001", "P.001", "N01", "N.01" into a normalised form.
 */
function normaliseCode(raw) {
  return raw.replace('.', '').trim();
}

// ---------------------------------------------------------------------------
// Step 1 — Parse electoral_district.mw
// ---------------------------------------------------------------------------
// Returns:
//   Map<federalCode, { name, state, stateSeats: Map<stateCode, { name, pollingDistricts[] }> }>
// For Federal Territories (KL, Putrajaya, Labuan) there are no state seats,
// so stateSeats will be empty.

function parseElectoralDistricts(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  const federalMap = new Map(); // key: "P001"
  let currentState = '';
  let currentFederal = null; // { code, name }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // State header  ==Perlis==
    const stateMatch = line.match(/^==([^=]+)==\s*$/);
    if (stateMatch) {
      currentState = stateMatch[1].trim();
      continue;
    }

    // Federal seat row:  | rowspan=N| P.001 [[Padang Besar (federal constituency)|Padang Besar]]
    const fedMatch = line.match(/\|\s*rowspan=\d+\|\s*(P\.\d+)\s+\[\[([^\]]+)\]\]/);
    if (fedMatch) {
      const code = normaliseCode(fedMatch[1]);
      const linkText = extractLinkText(`[[${fedMatch[2]}]]`);
      // Strip " (federal constituency)" suffix
      const name = linkText.replace(/\s*\(federal constituency\)/i, '').trim();
      currentFederal = { code, name };
      if (!federalMap.has(code)) {
        federalMap.set(code, { name, state: currentState, stateSeats: new Map() });
      }
      continue;
    }

    // Federal Territory seat (no state seat column):
    // | P.114 [[Kepong (federal constituency)|Kepong]] || 19 || ...
    const ftFedMatch = line.match(/^\|\s*(P\.\d+)\s+\[\[([^\]]+)\]\]\s*\|\|/);
    if (ftFedMatch) {
      const code = normaliseCode(ftFedMatch[1]);
      const linkText = extractLinkText(`[[${ftFedMatch[2]}]]`);
      const name = linkText.replace(/\s*\(federal constituency\)/i, '').trim();
      currentFederal = { code, name };
      if (!federalMap.has(code)) {
        federalMap.set(code, { name, state: currentState, stateSeats: new Map() });
      }
      continue;
    }

    // State seat row:  | N.01 [[Titi Tinggi (state constituency)|Titi Tinggi]] || 7 || Dist1, Dist2
    // May also appear inline after federal seat on same row or on its own line
    const stateMatch2 = line.match(/\|\s*(N\.\d+)\s+\[\[([^\]]+)\]\]\s*\|\|\s*\d+\s*\|\|\s*(.+)/);
    if (stateMatch2 && currentFederal) {
      const code = normaliseCode(stateMatch2[1]);
      const linkText = extractLinkText(`[[${stateMatch2[2]}]]`);
      const name = linkText.replace(/\s*\(state constituency\)/i, '').trim();
      const rawDistricts = stateMatch2[3];
      const pollingDistricts = rawDistricts
        .split(',')
        .map(d => d.trim())
        .filter(Boolean);

      const fedEntry = federalMap.get(currentFederal.code);
      if (fedEntry) {
        fedEntry.stateSeats.set(code, { name, pollingDistricts });
      }
    }
  }

  return federalMap;
}

// ---------------------------------------------------------------------------
// Step 2 — Parse results_YEAR.mw
// ---------------------------------------------------------------------------
// Returns an array of raw result records:
//   { state, seatCode, seatName, winnerName, party }

function parseResults(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  const results = [];
  let currentState = '';

  // We walk through looking for "rowspan" seat entries.
  // Pattern for a winner row:
  //   | rowspan=N| PXXX              ← seat code
  //   | rowspan=N| [[Name|...]]      ← seat name
  //   | rowspan=N| <numbers>         ← registered electors (skip)
  //   | rowspan=N bgcolor="..."| {{Font color|white|WINNER|...}}<br>{{Font color|white|(COALITION-PARTY)}}
  //
  // All four rowspan=N entries appear consecutively for the same N.
  // We collect them as a group by their rowspan value.

  // State header
  // 2022: == Perlis == (with spaces)  2023: ==Kedah== (no spaces)
  const STATE_RE = /^==([^=]+)==\s*$/;

  // Seat code line:  | rowspan=N| P001   or   | rowspan=N| N01
  const CODE_RE = /^\|\s*rowspan=\d+\|\s*([PN][\d.]+)\s*$/;

  // Seat name line:  | rowspan=N| [[Full Name (federal|state constituency)|Short Name]]
  const NAME_RE = /^\|\s*rowspan=\d+\|\s*\[\[/;

  // Winner line: rowspan=N with bgcolor and Font color template
  const WINNER_RE = /^\|\s*rowspan=\d+\s+bgcolor="[^"]*"\s*\|\s*(.+)/i;
  // Also handle: | rowspan=N bgcolor="..." | (without pipe-space)
  const WINNER_RE2 = /^\|\s*rowspan=\d+\s+bgcolor=[^|]+\|\s*(.+)/i;

  // Party extraction from "(COALITION-PARTY)" or "(PARTY)"
  function extractParty(raw) {
    // e.g. "(PN-PAS)", "(PH–PKR)", "(BN–UMNO)", "(PN–BERSATU)", "(IND)", "(PRM)"
    const m = raw.match(/\(([^)]+)\)/);
    if (!m) return '';
    const inner = m[1];
    // Split on - or – and take last part
    const parts = inner.split(/[-–]/);
    return parts[parts.length - 1].trim();
  }

  // Extract name from winner cell text
  function extractWinnerName(raw) {
    let s = cleanWiki(raw);
    // Remove party notation: "(PN-PAS)" etc.
    s = s.replace(/\([^)]*\)/g, '').trim();
    // Remove trailing <br/> artifacts
    s = s.replace(/\s*<br[^>]*>/gi, ' ').trim();
    return s;
  }

  // State of the parser
  let pendingCode = null;
  let pendingName = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // State header
    const sm = line.match(STATE_RE);
    if (sm) {
      currentState = sm[1].trim();
      // Normalise "Federal Territory of Kuala Lumpur" etc.
      currentState = currentState
        .replace(/^Federal Territory of\s+/i, '')
        .trim();
      pendingCode = null;
      pendingName = null;
      continue;
    }

    // Seat code
    const cm = line.match(CODE_RE);
    if (cm) {
      pendingCode = normaliseCode(cm[1]);
      pendingName = null;
      continue;
    }

    // Seat name (only grab if we already have a pendingCode)
    if (pendingCode && !pendingName && NAME_RE.test(line)) {
      // Extract name from [[...|Name]] or [[Name (...)]]
      const raw = line.replace(/^\|\s*rowspan=\d+\|\s*/, '');
      let name = extractLinkText(raw.trim());
      name = name
        .replace(/\s*\(federal constituency\)/i, '')
        .replace(/\s*\(state constituency\)/i, '')
        .trim();
      pendingName = name;
      continue;
    }

    // Winner row — has bgcolor and Font color
    if (pendingCode) {
      let winnerRaw = null;
      const wm1 = line.match(WINNER_RE);
      const wm2 = line.match(WINNER_RE2);
      if (wm1) winnerRaw = wm1[1];
      else if (wm2) winnerRaw = wm2[1];

      if (winnerRaw) {
        // Extract party from the raw content (before cleaning)
        const party = extractParty(winnerRaw);
        const name = extractWinnerName(winnerRaw);

        if (name) {
          results.push({
            state: currentState,
            seatCode: pendingCode,
            seatName: pendingName || '',
            winnerName: name,
            party,
          });
        }

        // Reset pending — we've consumed this seat block
        pendingCode = null;
        pendingName = null;
        continue;
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Step 3 — Build XLSX rows
// ---------------------------------------------------------------------------

function buildRows(results, electoralMap, electionYear) {
  const rows = [];

  // Determine year type: 2022 = federal (MP), 2023 = state (ADUN)
  // We detect from seat code prefix: P = MP, N = ADUN
  for (const r of results) {
    const { state, seatCode, seatName, winnerName, party } = r;

    // Skip if no winner name
    if (!winnerName || winnerName.trim() === '') continue;

    const isFederal = seatCode.startsWith('P');
    const type = isFederal ? 'MP' : 'ADUN';
    const gender = guessGender(winnerName);

    let federalSeatCode = '';
    let federalSeatName = '';
    let stateSeatCode = '';
    let stateSeatName = '';
    let pollingDistrictsStr = '';

    if (isFederal) {
      // MP row: federalSeat = this seat, no state seat
      federalSeatCode = formatCodeWithDot(seatCode, 'P');
      federalSeatName = seatName;
      stateSeatCode = '';
      stateSeatName = '';
      // Aggregate polling districts from all child state seats
      const fedEntry = electoralMap.get(seatCode);
      if (fedEntry) {
        const allDistricts = [];
        for (const [, seat] of fedEntry.stateSeats) {
          allDistricts.push(...seat.pollingDistricts);
        }
        pollingDistrictsStr = allDistricts.join(';');
      }
    } else {
      // ADUN row: find which federal seat this state seat belongs to.
      // State seat codes (N.01, N.02 …) RESTART for each state, so we must
      // match on both the seat code AND the state name to avoid collisions.
      stateSeatCode = formatCodeWithDot(seatCode, 'N');
      stateSeatName = seatName;

      let foundFed = null;
      for (const [fedCode, fedEntry] of electoralMap) {
        // Only consider federal seats that belong to the same state
        if (fedEntry.state !== state) continue;
        if (fedEntry.stateSeats.has(seatCode)) {
          foundFed = { fedCode, fedEntry };
          break;
        }
      }

      if (foundFed) {
        federalSeatCode = formatCodeWithDot(foundFed.fedCode, 'P');
        federalSeatName = foundFed.fedEntry.name;
        const seatEntry = foundFed.fedEntry.stateSeats.get(seatCode);
        if (seatEntry) {
          pollingDistrictsStr = seatEntry.pollingDistricts.join(';');
        }
      } else {
        federalSeatCode = '';
        federalSeatName = '';
      }
    }

    rows.push({
      electedYear: electionYear,
      state,
      federalSeatCode,
      federalSeatName,
      stateSeatCode,
      stateSeatName,
      pollingDistricts: pollingDistrictsStr,
      type,
      name: winnerName,
      party,
      gender,
      address: '',
      email: '',
      phoneNumber: '',
      facebook: '',
      'twitter/𝕏': '',
    });
  }

  return rows;
}

/**
 * Format a normalised code back to the dot-notation used in the XLSX template.
 * "P001" → "P.001", "N01" → "N.01"
 */
function formatCodeWithDot(code, prefix) {
  const digits = code.slice(prefix.length);
  return `${prefix}.${digits}`;
}

// ---------------------------------------------------------------------------
// Step 4 — Write XLSX
// ---------------------------------------------------------------------------

function writeXlsx(rows, outputPath) {
  const headers = [
    'electedYear',
    'state',
    'federalSeatCode',
    'federalSeatName',
    'stateSeatCode',
    'stateSeatName',
    'pollingDistricts',
    'type',
    'name',
    'party',
    'gender',
    'address',
    'email',
    'phoneNumber',
    'facebook',
    'twitter/𝕏',
  ];

  const wsData = [headers, ...rows.map(r => headers.map(h => r[h] ?? ''))];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  XLSX.writeFile(wb, outputPath);
  console.log(`Written ${rows.length} rows to ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`Parsing electoral districts from ${ELECTORAL_DISTRICT_FILE}...`);
const electoralMap = parseElectoralDistricts(ELECTORAL_DISTRICT_FILE);
console.log(`  Loaded ${electoralMap.size} federal seats.`);

console.log(`Parsing election results from ${RESULTS_FILE}...`);
const results = parseResults(RESULTS_FILE);
console.log(`  Parsed ${results.length} winner records.`);

const rows = buildRows(results, electoralMap, Number(year));
console.log(`  Built ${rows.length} rows (after filtering empty names).`);

const outputPath = path.join(XLSX_DIR, `representative_${year}.xlsx`);
writeXlsx(rows, outputPath);
console.log('Done.');
