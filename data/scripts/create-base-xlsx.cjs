/**
 * create-base-xlsx.cjs
 *
 * Creates (or regenerates) representative_base.xlsx — the blank template
 * with two sheets (MP and ADUN) used as the canonical data-entry format.
 *
 * Usage:
 *   node data/scripts/create-base-xlsx.cjs
 */

'use strict';

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const OUTPUT_PATH = path.join(__dirname, '../xlsx/representative_base.xlsx');

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

// MP sheet note: stateSeatCode / stateSeatName refer to the state seat the MP's
// own polling districts belong to (carried over from the 2022 data structure).
// ADUN sheet: federalSeatCode / federalSeatName are the parent federal seat.

function createSheet(note) {
  const wsData = [HEADERS];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths for readability
  ws['!cols'] = HEADERS.map((h) => {
    if (h === 'pollingDistricts') return { wch: 60 };
    if (h === 'name') return { wch: 36 };
    if (['federalSeatName', 'stateSeatName', 'state'].includes(h)) return { wch: 28 };
    if (['federalSeatCode', 'stateSeatCode'].includes(h)) return { wch: 16 };
    return { wch: 18 };
  });

  return ws;
}

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, createSheet('MP'), 'MP');
XLSX.utils.book_append_sheet(wb, createSheet('ADUN'), 'ADUN');

XLSX.writeFile(wb, OUTPUT_PATH);
console.log(`Created ${OUTPUT_PATH}`);
console.log('  Sheet "MP"   — one row per federal seat winner');
console.log('  Sheet "ADUN" — one row per state seat winner');
console.log('');
console.log('Column reference:');
HEADERS.forEach((h) => console.log(`  ${h}`));
