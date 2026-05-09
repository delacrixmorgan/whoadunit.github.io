/**
 * convert-xlsx-to-json.cjs
 *
 * Reads representative_<year>.xlsx (two sheets: MP + ADUN) and outputs
 * public/data/representatives_<year>.json — an array of federal-seat objects,
 * each containing the MP record and an array of ADUN records.
 *
 * Usage:
 *   node data/scripts/convert-xlsx-to-json.cjs <year>
 *   node data/scripts/convert-xlsx-to-json.cjs 2022
 */

'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_PATH = path.join(__dirname, '../xlsx/representative_base.xlsx');
if (!fs.existsSync(BASE_PATH)) {
  console.log('representative_base.xlsx not found — running create-base-xlsx.cjs first...');
  execSync('node data/scripts/create-base-xlsx.cjs', { stdio: 'inherit', cwd: path.join(__dirname, '../..') });
}

const argYear = process.argv[2];
let years;

if (argYear) {
  if (!/^\d{4}$/.test(argYear)) {
    console.error('Usage: node data/scripts/convert-xlsx-to-json.cjs <year>');
    console.error('Example: node data/scripts/convert-xlsx-to-json.cjs 2022');
    process.exit(1);
  }
  years = [argYear];
} else {
  const manifestPath = path.join(__dirname, '../../public/data/representatives-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('No year argument given and manifest not found:', manifestPath);
    process.exit(1);
  }
  years = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`No year specified — using manifest: ${years.join(', ')}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function splitList(val) {
  if (!val || String(val).trim() === '') return [];
  return String(val).split(';').map(s => s.trim()).filter(Boolean);
}

function normalizeGender(val) {
  if (!val) return '';
  const v = String(val).trim().toLowerCase();
  if (v === 'male'   || v === 'm') return 'M';
  if (v === 'female' || v === 'f') return 'F';
  return '';
}

function normalizeCode(val) {
  if (!val) return '';
  // Remove dot: "P.001" → "P001", "N.01" → "N01"
  return String(val).replace('.', '').trim();
}

function readSheet(wb, sheetName) {
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.warn(`Warning: sheet "${sheetName}" not found in workbook.`);
    return [];
  }
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

function mapRepresentative(row) {
  return {
    electedYear: row['electedYear'] ? Number(row['electedYear']) : null,
    state: row['state'] || '',
    federalSeatCode: normalizeCode(row['federalSeatCode']),
    federalSeatName: row['federalSeatName'] || '',
    stateSeatCode: normalizeCode(row['stateSeatCode']),
    stateSeatName: row['stateSeatName'] || '',
    pollingDistricts: splitList(row['pollingDistricts']),
    name: row['name'] || '',
    party: row['party'] || '',
    gender: normalizeGender(row['gender']),
    address: row['address'] || '',
    email: splitList(row['email']),
    phoneNumber: splitList(row['phoneNumber']),
    facebook: splitList(row['facebook']),
    twitter: splitList(row['twitter/\uD835\uDD4F']),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function convertYear(year) {
  const INPUT_PATH  = path.join(__dirname, `../xlsx/representative_${year}.xlsx`);
  const OUTPUT_PATH = path.join(__dirname, `../../public/data/representatives_${year}.json`);

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Input file not found: ${INPUT_PATH}`);
    console.error('Run: node data/scripts/create-base-xlsx.cjs  to create the template first.');
    process.exit(1);
  }

  const wb = XLSX.readFile(INPUT_PATH);

  const mpRows   = readSheet(wb, 'MP');
  const adunRows = readSheet(wb, 'ADUN');

  const mpRecords   = mpRows.map(mapRepresentative).filter(r => r.name);
  const adunRecords = adunRows.map(mapRepresentative).filter(r => r.name);

  console.log(`\n[${year}] MP sheet:   ${mpRecords.length} records`);
  console.log(`[${year}] ADUN sheet: ${adunRecords.length} records`);

  const seatMap = new Map();

  for (const mp of mpRecords) {
    const code = mp.federalSeatCode;
    if (!code) continue;
    if (!seatMap.has(code)) {
      seatMap.set(code, {
        federalSeatCode: code,
        federalSeatName: mp.federalSeatName,
        state: mp.state,
        mp: null,
        aduns: [],
      });
    }
    const seat = seatMap.get(code);
    if (!seat.mp || (mp.electedYear ?? 0) > (seat.mp.electedYear ?? 0)) {
      seat.mp = {
        electedYear: mp.electedYear,
        stateSeatCode: mp.stateSeatCode,
        stateSeatName: mp.stateSeatName,
        pollingDistricts: mp.pollingDistricts,
        name: mp.name,
        party: mp.party,
        gender: mp.gender,
        address: mp.address,
        email: mp.email,
        phoneNumber: mp.phoneNumber,
        facebook: mp.facebook,
        twitter: mp.twitter,
      };
    }
  }

  for (const adun of adunRecords) {
    const code = adun.federalSeatCode;
    if (!code) continue;
    if (!seatMap.has(code)) {
      seatMap.set(code, {
        federalSeatCode: code,
        federalSeatName: adun.federalSeatName,
        state: adun.state,
        mp: null,
        aduns: [],
      });
    }
  }

  for (const adun of adunRecords) {
    const code = adun.federalSeatCode;
    if (!code) continue;
    const seat = seatMap.get(code);
    if (!seat) continue;
    seat.aduns.push({
      electedYear: adun.electedYear,
      stateSeatCode: adun.stateSeatCode,
      stateSeatName: adun.stateSeatName,
      pollingDistricts: adun.pollingDistricts,
      name: adun.name,
      party: adun.party,
      gender: adun.gender,
      address: adun.address,
      email: adun.email,
      phoneNumber: adun.phoneNumber,
      facebook: adun.facebook,
      twitter: adun.twitter,
    });
  }

  const output = Array.from(seatMap.values()).sort((a, b) => {
    const numA = parseInt(a.federalSeatCode.replace(/\D/g, ''), 10);
    const numB = parseInt(b.federalSeatCode.replace(/\D/g, ''), 10);
    return numA - numB;
  });

  for (const seat of output) {
    seat.aduns.sort((a, b) => {
      const numA = parseInt(a.stateSeatCode.replace(/\D/g, ''), 10);
      const numB = parseInt(b.stateSeatCode.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');

  console.log(`[${year}] Written ${output.length} federal seats to ${OUTPUT_PATH}`);
  console.log(`[${year}]   MPs:   ${output.filter(s => s.mp).length}`);
  console.log(`[${year}]   ADUNs: ${output.reduce((sum, s) => sum + s.aduns.length, 0)}`);
}

for (const year of years) {
  convertYear(String(year));
}
