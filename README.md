# generate_to_excel.py / generate_to_json.py

Two-step pipeline: Wikipedia election article → xlsx → `representatives_YEAR.json`

## Requirements

```bash
pip install openpyxl
```

---

## generate_to_excel.py

Parses a Malaysian Wikipedia election results article (MediaWiki format) and produces an `.xlsx` file.

### Usage

```bash
python3 generate_to_excel.py [input.md] [output.xlsx] [electedYear]
```

| Argument | Default | Description |
|---|---|---|
| `input.md` | `wiki.md` | Wikipedia article saved as plain text (MediaWiki format) |
| `output.xlsx` | `output.xlsx` | Path for the generated spreadsheet |
| `electedYear` | *(blank)* | Year to populate the `electedYear` column |

### Input format

The script expects a Wikipedia article containing two tables:

1. **Summary table** — rows starting with `| style="text-align:left;" |PXXX` — extracts `federalSeatName`, `state`, and `party`
2. **Detailed candidate table** — blocks starting with `| rowspan=N| PXXX` — extracts the winner's `name`

Winner names are parsed from four MediaWiki formats:
- `{{Font color|white|Name|link=Name}}`
- `[[Link|Display Name]]`
- `[[Name]]`
- Plain text before `<br`

### Example

```bash
python3 generate_to_excel.py wiki.md representitive_2022.xlsx 2022
python3 generate_to_excel.py ge14_results.md ge14_representatives.xlsx 2018
```

---

## generate_to_json.py

Converts an `.xlsx` file (produced by `generate_to_excel.py`) into a `representatives_YEAR.json` file.

### Usage

```bash
python3 generate_to_json.py [input.xlsx] [output.json]
```

| Argument | Default | Description |
|---|---|---|
| `input.xlsx` | `output.xlsx` | xlsx file to convert |
| `output.json` | `representatives_YEAR.json` | Output path; derived from `electedYear` column if omitted |

### Example

```bash
# Filename derived from electedYear column
python3 generate_to_json.py representitive_2022.xlsx
# → representatives_2022.json

# Explicit output path
python3 generate_to_json.py representitive_2022.xlsx public/data/representatives_2022.json
```

---

## Column schema

| Column | Source | Notes |
|---|---|---|
| `federalSeatCode` | Parsed | e.g. `P001` |
| `federalSeatName` | Parsed | e.g. `Padang Besar` |
| `stateSeatCode` | *(blank)* | Populated from state election articles |
| `stateSeatName` | *(blank)* | Populated from state election articles |
| `status` | Fixed | Always `Active` |
| `type` | Fixed | `MP` for federal election articles |
| `name` | Parsed | Winning candidate's full name |
| `party` | Parsed | Specific party, e.g. `PAS`, `DAP`, `UMNO` |
| `state` | Parsed | e.g. `Perlis`, `Selangor` |
| `gender` | *(blank)* | Fill in manually |
| `electedYear` | Argument | e.g. `2022` |
| `email` | *(blank)* | Fill in manually |
| `phoneNumber` | *(blank)* | Fill in manually |
| `facebook` | *(blank)* | Fill in manually |
| `twitter` | *(blank)* | Fill in manually |

## Sample output row

```json
{
  "federalSeatCode": "P049",
  "federalSeatName": "Tanjong",
  "stateSeatCode": "",
  "stateSeatName": "",
  "status": "Active",
  "type": "MP",
  "name": "Lim Hui Ying",
  "party": "DAP",
  "state": "Pulau Pinang",
  "gender": "",
  "electedYear": 2022,
  "email": "",
  "phoneNumber": "",
  "facebook": "",
  "twitter": ""
}
```
