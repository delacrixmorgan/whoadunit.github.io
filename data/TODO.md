# TODO 

# MethodologyPage — Drenched Dark Inversion (Gold + White on Ink)

## Context

[MethodologyPage.jsx](src/pages/MethodologyPage.jsx) is the only page on Whoadunit whose subject *is* sources, gaps, and accountability. The current treatment cycles through paper / violet-light / rose-light section backgrounds, which makes it visually identical to the rest of the brand — the page reads as "another colorful section" rather than "the receipts."

The redesign drops every section background to warm ink (`--ink: #1a1714`) and lets gold (`--gold: #e8a320`) and white be the only marks on it. The intent is editorial/documentary — like a printed evidence index or a museum's archive room. It separates the methodology page from every other page on the site without inventing new visual language: the codebase already runs this exact pattern in [VolunteerPage's PhilosophySection](src/pages/VolunteerPage.jsx) via `.v-section--ink`. We extend that pattern across four sections rather than introduce a one-off.

**Color strategy:** Drenched — the surface IS the color. Gold appears at full saturation only on two callout blocks (the pull-quote and the closing CTA), so it reads as evidence stamps inside an ink page rather than decoration.

**Scene that forces dark:** A skeptical Malaysian on their phone at midnight, having just read a politician headline, lands here to verify before they cite anything. They want primary documents, not marketing.

**What this is NOT:** crypto/luxury/finance dark mode. To stay civic: keep the warm ink (never pure `#000`), keep the brand's playful copy intact, no neon glows, no gradient borders, no glassmorphism beyond the existing `rgba(255,255,255,0.04)` card surfaces already established in PhilosophySection.

## Design Decisions

| Concern | Decision |
|---|---|
| Section backgrounds (4) | All four switch to `var(--ink)` with white text. Reuse the existing `.v-section--ink` pattern. |
| Display/headline keyword color | All `kw-*` spans become `kw-gold`. The colored words ("view", "sourced", "order", "honest gaps") all become gold. |
| Eyebrow labels | Gold (`var(--gold)`) — currently they switch tone per section; now uniform. |
| Body / sub copy | `rgba(255,255,255,0.65)` (matches PhilosophySection convention). |
| Lead-principle card (Principle 01) | Frosted-on-ink: `rgba(255,255,255,0.04)` background, `1px solid rgba(255,255,255,0.12)` border. Number badge "01" in gold. |
| Annotation cards (02 / 04) | Same frosted-on-ink treatment. Top-bar accent stripe (`.ann-card__topbar`) becomes gold. |
| Annotation line (03 — CC BY-SA pill) | Pill becomes gold-saturated with ink text. |
| Timeline dots | **All gold** (uniform). Tag text (REF / SE / GE15) preserves election-type semantics; year + title carry the rest. |
| Timeline body / year | Year in `rgba(255,255,255,0.55)`, title white 800-weight, body `rgba(255,255,255,0.65)`. |
| Source chips ("Wikipedia ↗") | Default: gold text, gold underline. Hover: white text, white underline. (Inverts current ink-faint → violet hover.) |
| Missing-list bullets (icons) | Number circles become gold-saturated with ink text (currently rose). |
| Pull-quote (`.missing-pull`) | **Gold-saturated background, ink text** (currently rose-saturated, white text). The interior blob becomes `rgba(26,23,20,0.08)` so it reads as a darker patch on gold rather than a lighter one. |
| Closing CTA (`.closing-cta`) | **Gold-saturated background, ink text.** "Find my representative →" button switches from `.btn--white` (white-on-rose) to ink-on-white treatment that pops against the gold card. |
| DecoBlobs (all 4 instances) | All `tone="gold"` at low opacity (0.07–0.10), matching PhilosophySection convention. The current rose/violet blobs are removed. |
| Hero (`.page-hero.bg-paper`) | Becomes `bg-ink`. The `.bg-ink` class already exists at [src/styles/index.css:243](src/styles/index.css#L243). |

## Implementation

Two files only. No new components.

### 1. [src/pages/MethodologyPage.jsx](src/pages/MethodologyPage.jsx)

JSX-level changes (everything else stays):

- **Hero (line 31):** `className="page-hero bg-paper"` → `className="page-hero bg-ink"`. Both DecoBlobs become `tone="gold"` (drop the violet one). Eyebrow `style={{ color: 'var(--gold)' }}` already correct. Keyword span stays `kw-gold`.
- **PrinciplesSection (line 54):** `m-section--paper` → `m-section--ink`. The eyebrow color stays gold. Keyword span stays `kw-gold`.
- **SourcesSection (line 101):** `m-section--violet` → `m-section--ink`. Single DecoBlob becomes `tone="gold"`. Eyebrow `style={{ color: 'var(--violet)' }}` → `'var(--gold)'`. Headline keyword `kw-violet` → `kw-gold`. Each timeline item's `dot` field is unused after CSS change but leave the data alone — CSS will override visual.
- **GapsSection (line 132):** `m-section--rose` → `m-section--ink`. DecoBlob `tone="rose"` → `tone="gold"`. Eyebrow color `var(--rose)` → `var(--gold)`. Keyword `kw-rose` → `kw-gold`. Button class `btn--rose` → `btn--ink` (new — see CSS below) or reuse `btn--ink` if already present; if not, use the existing `.btn--white` and accept ink-on-white inside the gold pull below.
- **ClosingSection (line 168):** `m-section--paper` → `m-section--ink`. Inside `.closing-cta`, the button `.btn--white` (white background, rose text) becomes a new pairing — see CSS below; keep classname or swap to a new modifier.

### 2. [src/styles/index.css](src/styles/index.css)

Add a new section variant and override the methodology-specific classes when nested inside it. Single contained block at the end of the methodology section CSS (after line 1237). No global token changes — no other page is affected.

```css
/* === Methodology dark inversion === */
.m-section--ink {
  background: var(--ink);
  color: white;
}

/* page-hero on ink — eyebrow already overridden inline; sub copy needs help */
.page-hero.bg-ink .page-hero__sub { color: rgba(255, 255, 255, 0.65); }

/* Frosted cards on ink (principles + annotations) */
.m-section--ink .lead-principle,
.m-section--ink .ann-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.m-section--ink .lead-principle__blob { background: rgba(232, 163, 32, 0.18); }
.m-section--ink .lead-principle__eyebrow { color: var(--gold); }
.m-section--ink .lead-principle__title { color: white; }
.m-section--ink .lead-principle__body { color: rgba(255, 255, 255, 0.65); }

.m-section--ink .ann-card__topbar { background: var(--gold); }
.m-section--ink .ann-card__num { color: var(--gold); }
.m-section--ink .ann-card__title { color: white; }
.m-section--ink .ann-card__body { color: rgba(255, 255, 255, 0.65); }

.m-section--ink .ann-line__num { color: var(--gold); }
.m-section--ink .ann-line__text { color: white; }
.m-section--ink .ann-line__pill {
  background: var(--gold);
  color: var(--ink);
}

.m-section--ink .ann-block {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.m-section--ink .ann-block__num,
.m-section--ink .ann-block__title { color: var(--gold); }
.m-section--ink .ann-block__body { color: rgba(255, 255, 255, 0.65); }

/* Timeline */
.m-section--ink .timeline-item::before { background: rgba(255, 255, 255, 0.12); }
.m-section--ink .timeline-dot,
.m-section--ink .timeline-dot--rose,
.m-section--ink .timeline-dot--leaf,
.m-section--ink .timeline-dot--violet,
.m-section--ink .timeline-dot--gold {
  background: var(--gold);
  color: var(--ink);
}
.m-section--ink .timeline-content__year { color: rgba(255, 255, 255, 0.55); }
.m-section--ink .timeline-content__title { color: white; }
.m-section--ink .timeline-content__body { color: rgba(255, 255, 255, 0.65); }
.m-section--ink .source-chip {
  color: var(--gold);
  border-bottom-color: var(--gold);
}
.m-section--ink .source-chip:hover {
  color: white;
  border-bottom-color: white;
}
.m-section--ink .source-chip__arrow { color: var(--gold); }
.m-section--ink .source-chip:hover .source-chip__arrow { color: white; }

/* Missing list */
.m-section--ink .missing-list li { border-bottom-color: rgba(255, 255, 255, 0.10); color: white; }
.m-section--ink .missing-list__icon {
  background: var(--gold);
  color: var(--ink);
}

/* Pull-quote — gold-saturated, ink text */
.m-section--ink .missing-pull {
  background: var(--gold);
  color: var(--ink);
}
.m-section--ink .missing-pull__blob { background: rgba(26, 23, 20, 0.10); }
.m-section--ink .missing-pull__eyebrow { color: rgba(26, 23, 20, 0.65); }
.m-section--ink .missing-pull__quote { color: var(--ink); }

/* Closing CTA — gold-saturated, ink text */
.m-section--ink .closing-cta {
  background: var(--gold);
  color: var(--ink);
}
.m-section--ink .closing-cta__blob { background: rgba(26, 23, 20, 0.08); }
.m-section--ink .closing-cta h3,
.m-section--ink .closing-cta p { color: var(--ink); }

/* Buttons inside gold callouts */
.m-section--ink .btn--rose {
  background: var(--ink);
  color: white;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.4);
}
.m-section--ink .btn--rose:hover { box-shadow: 0 6px 0 rgba(0, 0, 0, 0.4); }
.m-section--ink .btn--white {
  background: var(--ink);
  color: white;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.4);
}
```

The button overrides nest under `.m-section--ink` so the global `.btn--rose` / `.btn--white` definitions stay intact for every other page. JSX classnames don't have to change.

## Why this respects the brand

- **Existing pattern, extended.** `.v-section--ink` is already in CSS and battle-tested. We don't introduce new tokens or new fonts.
- **Color strategy:** drenched ink + single accent (gold). Aligns with DESIGN.md's "Drenched" register option. The two saturated gold blocks satisfy the Full-Saturation Rule.
- **Headline keywords:** still in their section's "vivid" colour — but now there's only one section colour. `kw-gold` already exists.
- **Typography:** unchanged. Same Plus Jakarta Sans, same 800-weight headlines, same 65ch body cap.
- **No banned patterns:** no gradient text, no glassmorphism (the 0.04 card surfaces match PhilosophySection precedent), no side-stripe borders, no diffuse shadows on interactive elements (hard shadows preserved).
- **Reflex check:** "transparency page → white + gold accents" is the first reflex. We avoided it. "Civic dark mode → navy + gold" (gov't bond aesthetic) is the second. We avoided it too — warm ink + amber gold + the brand's playful copy keep this away from the luxury/finance/crypto trap.

## Critical files

- [src/pages/MethodologyPage.jsx](src/pages/MethodologyPage.jsx) — JSX class swaps and DecoBlob tone/colour swaps only.
- [src/styles/index.css](src/styles/index.css) — append the `.m-section--ink` block (after line 1237).
- [src/components/DecoBlob.jsx](src/components/DecoBlob.jsx) — read-only reference; already supports `tone="gold"`.
- [src/pages/VolunteerPage.jsx:308-357](src/pages/VolunteerPage.jsx#L308) — read-only reference; the canonical dark/gold pattern this redesign extends.

## Verification

1. `npm run dev` and visit `/methodology` — confirm:
   - Hero, all 4 sections render dark with gold + white only.
   - No violet or rose backgrounds remain.
   - Timeline reads cleanly: gold dots, white titles, gold "Wikipedia ↗" chips.
   - The two gold callouts (pull-quote, closing CTA) read as bright stamps against the ink.
2. Visit every other page (`/`, `/find`, `/learn`, `/seat`, `/volunteer`) — confirm no regression. The override is namespaced under `.m-section--ink`, so no global tokens shifted, but verify VolunteerPage's PhilosophySection (which uses the same dark pattern) still looks identical.
3. Resize from desktop → 820px → mobile. The responsive grid breakpoints inside `.principles-grid` and `.missing-grid` (already defined) are untouched.
4. Tab through interactive elements (source chips, "Help fix a gap →" button, "Find my representative →" button) — confirm contrast on focus/hover.
5. Toggle `prefers-reduced-motion: reduce` in DevTools — Reveal animations should be instant; nothing else animates.
6. WCAG AA quick check: white on `#1a1714` is ~16:1; gold (`#e8a320`) on `#1a1714` is ~7.5:1; ink on gold is ~11:1. All above AA.
