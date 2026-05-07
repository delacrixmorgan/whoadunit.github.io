const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../mw/2022/wip.mw');
const outputPath = path.join(__dirname, '../xlsx/kedah.xlsx');

function parseWinner(line) {
  const m = line.match(/bgcolor="[^"]+"\s*\|\s*(.*)/);
  if (!m) return { name: '', party: '' };

  let content = m[1].trim();

  // Strip {{Font color|white|CONTENT}}
  const fontMatch = content.match(/\{\{Font color\|white\|(.+)\}\}/);
  if (fontMatch) content = fontMatch[1];

  // Strip wiki links: [[Link|Display]] or [[Display]]
  content = content.replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1');

  const [namePart, partyPart = ''] = content.split(/<br\s*\/?>/);
  const name = namePart.trim();

  const partyRaw = partyPart.replace(/[()]/g, '').trim();
  const party = partyRaw.includes('–') ? partyRaw.split('–').pop().trim()
              : partyRaw.includes('-') ? partyRaw.split('-').pop().trim()
              : partyRaw;

  return { name, party };
}

const raw = fs.readFileSync(inputPath, 'utf8');
const blocks = raw.split(/\|-\s*align="center"/);

const results = [];

for (const block of blocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) continue;

  const codeMatch = lines[0].match(/^\|\s*rowspan=\d+\|\s*(N\d+)/);
  if (!codeMatch) continue;

  const stateSeatCode = codeMatch[1];

  const nameLine = lines.find(l => l.includes('state constituency'));
  const stateSeatName = nameLine?.match(/\[\[[^\]|]+\|([^\]]+)\]\]/)?.[1]?.trim() || '';

  const winnerLine = lines.find(l => /rowspan=\d+\s*bgcolor=/i.test(l) && l.includes('('));
  const { name, party } = winnerLine ? parseWinner(winnerLine) : { name: '', party: '' };

  results.push({ stateSeatCode, stateSeatName, name, party });
}

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(results);
xlsx.utils.book_append_sheet(wb, ws, 'ADUN');
xlsx.writeFile(wb, outputPath);

console.log(`Wrote ${results.length} rows to ${outputPath}`);
