import re
import sys
import openpyxl


def extract_display_name(text):
    """Extract display name from [[link|display]] or [[name]] wiki markup."""
    m = re.search(r'\[\[[^\|\]]+\|([^\]]+)\]\]', text)
    if m:
        return m.group(1).strip()
    m = re.search(r'\[\[([^\|\]]+)\]\]', text)
    if m:
        return m.group(1).strip()
    return ""


def extract_winner_name(line):
    """Extract winner's personal name from a MediaWiki winner cell."""
    # {{Font color|white|NAME|link=...}} or {{Font color|white|NAME}}
    m = re.search(r'\{\{Font color\|white\|([^|{}\n]+?)(?:\|link=|\}\})', line)
    if m:
        return m.group(1).strip()
    # [[link|display name]]
    m = re.search(r'\[\[[^\|\]]+\|([^\]]+)\]\]', line)
    if m:
        return m.group(1).strip()
    # [[name]]
    m = re.search(r'\[\[([^\|\]]+)\]\]', line)
    if m:
        return m.group(1).strip()
    # Plain text before <br or <ref
    m = re.search(r'\|\s*([A-Z][^<{[|\n]+?)\s*(?:<br|<ref)', line)
    if m:
        return m.group(1).strip()
    return ""


def extract_party(cell_text):
    """Extract specific party from a cell like ' style="..."|PN (PAS) ' or 'Ind'."""
    text = re.sub(r'style="[^"]*"\s*\|', '', cell_text).strip()
    # "COALITION (PARTY)" — return the specific party
    m = re.search(r'\(([A-Z]+)\)', text)
    if m:
        return m.group(1)
    # Bare word (e.g. "Ind", "WARISAN")
    m = re.match(r'^([A-Za-z]+)', text)
    if m:
        return m.group(1)
    return ""


input_file   = sys.argv[1] if len(sys.argv) > 1 else "wiki.md"
output_file  = sys.argv[2] if len(sys.argv) > 2 else "output.xlsx"
elected_year = int(sys.argv[3]) if len(sys.argv) > 3 else ""

lines = open(input_file, encoding='utf-8').readlines()

# Phase 1: Summary table — P-code, seat name, state, winning party
# Rows start with: | style="text-align:left;" |PXXX [[...]]  || state || ... || || party ||
summary = {}
for line in lines:
    if not line.startswith('| style="text-align:left;" |P'):
        continue
    cells = line.split('||')
    if len(cells) < 8:
        continue
    m = re.search(r'\|(P\d{3})\s', cells[0])
    if not m:
        continue
    code = m.group(1)
    seat_name = extract_display_name(cells[0])
    state = re.sub(r'style="[^"]*"\s*\|', '', cells[1]).strip()
    party = extract_party(cells[7])
    summary[code] = {"federalSeatName": seat_name, "state": state, "party": party}

# Phase 2: Detailed candidate table — winner name per P-code
# Each block: "| rowspan=N| PXXX" then seat name, voters, then winner cell (3 lines down)
detail = {}
i = 0
while i < len(lines):
    m = re.match(r'^\| rowspan=\d+\| (P\d{3})$', lines[i].strip())
    if m:
        code = m.group(1)
        winner_line = lines[i + 3].strip() if i + 3 < len(lines) else ''
        detail[code] = extract_winner_name(winner_line)
    i += 1

# Build xlsx — single sheet, unified schema for both MPs and ADUNs
all_codes = sorted(set(list(summary) + list(detail)))

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Representatives"
ws.append([
    "federalSeatCode", "federalSeatName", "stateSeatCode", "stateSeatName",
    "status", "type", "name", "party", "state", "gender",
    "electedYear", "email", "phoneNumber", "facebook", "twitter",
])

for code in all_codes:
    s = summary.get(code, {})
    ws.append([
        code,
        s.get("federalSeatName", ""),
        "",                           # stateSeatCode — populated from state election articles
        "",                           # stateSeatName — populated from state election articles
        "Active",
        "MP",
        detail.get(code, ""),
        s.get("party", ""),
        s.get("state", ""),
        "",                           # gender — not in election result articles
        elected_year,
        "",                           # email
        "",                           # phoneNumber
        "",                           # facebook
        "",                           # twitter
    ])

wb.save(output_file)
print(f"Saved {output_file} with {len(all_codes)} representatives")

missing = [c for c in all_codes if not detail.get(c)]
if missing:
    print(f"WARNING: {len(missing)} entries with no name resolved: {missing}")
