# Gender Assignment — Thought Process & Usage

## Overview

The `update_gender.py` script infers and writes the `gender` column (`Male` / `Female`) for every representative in the **MP** and **ADUN** sheets of a Malaysian representatives XLSX file. Because no ground-truth gender data was available, gender is inferred entirely from the representative's **full name** using a three-layer heuristic.

---

## How to Use

### Requirements

```bash
pip install openpyxl
```

### Run

```bash
python3 update_gender.py representative_2022.xlsx
```

The script overwrites the file in-place and prints a summary of Female / Male counts per sheet, followed by a full list of all Female-assigned names for review.

---

## Thought Process

### 1. Understanding the Dataset

The file contains two sheets of elected Malaysian representatives from the 2022 general election:

| Sheet | Description | Rows |
|-------|-------------|------|
| `MP`  | Members of Parliament (federal seats) | ~222 |
| `ADUN`| State Assembly Members (state seats) | ~600 |

The `gender` column (column J) was entirely empty in `ADUN` and partially filled in `MP`. The `name` column (column H) holds the representative's full name, sometimes with Wikipedia markup like `Halimaton Shaadiah Saad|link=Halimaton Shaadiah Saad}}`.

---

### 2. Name Cleaning

Before any matching, wiki-style markup is stripped:

```
Halimaton Shaadiah Saad|link=Halimaton Shaadiah Saad}}
→ Halimaton Shaadiah Saad
```

This is done with a simple regex: `\|link=.*?\}\}`.

---

### 3. Three-Layer Gender Assignment

Gender is assigned by checking three sources in order of priority:

#### Layer 1 — Explicit Male Override List (`MALE_EXPLICIT`)

A small set of names that superficially match female patterns but are verifiably male:

- Indian names with "common" endings: e.g., `Kumaran Krishnan`, `Sivanesan Achalingam`
- Chinese names that pattern-match female tokens: e.g., `Loi Kok Liang`, `Goh Choon Aik`
- Sikh names: `Jagdeep Singh Deo`

**Why first?** A name like `Kumaran Krishnan` would match the `\bnor\b` pattern if not blocked — the male list acts as a safety net.

#### Layer 2 — Explicit Female Name List (`FEMALE_EXPLICIT`)

A curated set of known female full names (lower-cased), compiled by examining every name in both sheets and cross-referencing with publicly available sources. Covers three communities:

- **Malay females**: `Siti Ashah Ghazali`, `Rohani Ibrahim`, `Sharifah Azizah Syed Zain`, `Dayang Noorazah Awang Sohor`, `Halimaton Shaadiah Saad`, etc.
- **Chinese females**: `Gan Ay Ling`, `Heng Lee Lee`, `Phee Syn Tze`, `Connie Tan Hooi Peng`, `Violet Yong Wui Wui`, etc.
- **Indian females**: `Thulsi Thivani Manogaran`, `Saraswathy Nallathanby`, `Bavani Veraiah @ Shasha`, `Wasanthee Sinnasamy`

#### Layer 3 — Regex Pattern Matching (`FEMALE_PATTERNS`)

When the full name is not in either explicit list, regex patterns are applied to the lower-cased name. Patterns fall into two groups:

**Multi-token patterns (checked first)** — prevent false positives from shorter tokens:

| Pattern | Catches |
|---------|---------|
| `\bheng lee lee\b` | Heng Lee Lee |
| `\blim siew khim\b` | Lim Siew Khim |
| `\bwong may\b` | Wong May Ing |
| `\bee chin\b` | Ee Chin Li |

**Single-token first-name patterns (checked after)**:

| Pattern | Female indicator |
|---------|-----------------|
| `\bsiti\b` | Siti (Malay female honorific/name) |
| `\bnor\b` | Nor / Nora (common Malay female prefix) |
| `\bnoor\b` | Noor (variant of Nur, female) |
| `\bsharifah\b` | Sharifah (female Malay title for Sayyidah) |
| `\bdayang\b` | Dayang (Sarawak female title) |
| `\bfatimah\b` | Fatimah (female Islamic name) |
| `\bhafidzah\b` | Hafidzah (female Malay name) |
| `\bmarina\b` | Marina (female) |
| `\bviolet\b` | Violet (female English/Chinese name) |
| `\bsandrea\b` | Sandrea (female) |
| `\bconnie\b` | Connie (female Chinese-English name) |
| `\bliow\b` | Liow (female Chinese family name in context) |
| `\bthulsi\b` | Thulsi (Tamil female name) |
| `\bwasanthee\b` | Wasanthee (Sinhala/Tamil female name) |
| `\bbavani\b` | Bavani (Tamil female name) |
| ... | (see full list in script) |

#### Default: Male

If no explicit or pattern rule triggers, the name is assigned **Male**. This reflects the reality that Malaysian elected representatives are overwhelmingly male (~85–90%), so defaulting to Male minimises false positives.

---

### 4. Why No External API / AI?

- The dataset is sensitive (elected officials' personal data); no data was sent to external services.
- The pattern-based approach is fully auditable, reproducible, and fast.
- A print-out of all Female-assigned names is included at the end of each run so assignments can be manually reviewed and corrected.

---

### 5. Known Limitations & How to Correct Errors

- **Ambiguous Chinese unisex names** (e.g., `Lee Kim Shin`, `Goh See Hua`) are in `FEMALE_EXPLICIT` based on best judgement — these may need manual verification.
- **`\bnor\b` is a broad pattern**: names like `Mohd Nor Hamzah` would match. The `MALE_EXPLICIT` list handles known false positives, but new ones should be added there.
- To correct a misassignment, add the full name (lower-cased) to `MALE_EXPLICIT` or `FEMALE_EXPLICIT` at the top of the script and re-run.

---

## Output Example

```
Loading 'representative_2022.xlsx' …

Updating gender columns …
  ADUN: 62 Female, 538 Male  (total 600)
  MP: 32 Female, 190 Male  (total 222)

Saved 'representative_2022.xlsx'.
Grand total — Female: 94, Male: 728

--- ADUN: Female representatives (62) ---
  Wan Badariyah Wan Saad
  Marzita Mansor
  ...
```
