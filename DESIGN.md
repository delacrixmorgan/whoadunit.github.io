<!-- SEED: updated to reflect A3 (More Colourful) direction chosen during prototype review. Re-run /impeccable document once there's code to capture final resolved tokens and components. -->

---
name: Whoadunit
description: A civic education site that helps Malaysians find their representatives and take action.
colors:
  rose:        "#e8614a   — warm red-orange, discovery + search"
  rose-light:  "#fce7e3   — rose section background"
  leaf:        "#2d9e6b   — forest green, knowledge + MP"
  leaf-light:  "#d4f0e4   — leaf section background"
  violet:      "#5b5bd6   — blue-violet, state + ADUN"
  violet-light:"#e0e0fa   — violet section background"
  gold:        "#e8a320   — amber, delight + action + contact"
  gold-light:  "#fef4d6   — gold section background"
  paper:       "#fdf9f4   — warm off-white, nav and white cards"
  ink:         "#1a1714   — near-black warm tint"
  ink-soft:    "#3e3a36   — secondary text"
  ink-faint:   "#7a746e   — placeholders, metadata"
typography:
  display:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "clamp(1.75rem, 4.5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "0.7rem"
    fontWeight: 700
    letterSpacing: "0.08em"
---

# Design System: Whoadunit

## 1. Overview

**Creative North Star: "The Civic Playground"**

Whoadunit is a museum you walk through — but one with the energy of a science centre, not a gallery. Each section is an exhibit, but the exhibits have personality: saturated colour, bold type, scenario cards you want to read, statistics that make you stop. The aesthetic is Kurzgesagt-meets-civic-institution: the explanatory clarity of a great explainer video, the permanence and trustworthiness of public education. Colourful, confident, never noisy.

The colour language is vivid and intentional: four fully saturated hues — rose, leaf, violet, gold — each anchored by a light tint for section backgrounds and its full saturated version for cards, stat blocks, buttons, and badges. Every section has a dominant colour, and that colour appears at full saturation somewhere on the screen (not just as a faint wash). Multiple colours appear together on the same page, and that's the point: the palette is a celebration, not a palette.

Typography is heavy and tight. Display and headline weights are 800. Letter-spacing is compressed. Coloured words in headlines are allowed and encouraged — the key word in each heading inherits the section's dominant colour. This is how you make civic content feel urgent without being alarming.

Motion is purposeful: scroll-driven reveals, staggered entrances, stat numbers that count up. The tone is "discover with us," not "here is a form to complete."

**Key Characteristics:**
- Saturated four-colour system (rose, leaf, violet, gold) — each colour fully owned by a section
- Light tints for section backgrounds; full saturated colour for cards, buttons, rep cards, stat blocks
- 800-weight display and headline typography with tight tracking
- Coloured words in headlines (the key noun/verb inherits its section colour)
- Rainbow chips — each example gets its own colour, not a monochrome chip set
- Decorative colour blobs (large circles, low opacity) add energy to section backgrounds
- Scroll-driven storytelling with orchestrated entrances
- Progressive reveal: sections gate on user progress, not pre-rendered below the fold
- Works confidently on mobile, desktop, and classroom projector

### Named Rules
**The Gated Reveal Rule.** Sections are not pre-rendered below the fold. Section 2 (Understand) appears only after a representative is selected. Section 3 (Act) appears only after Section 2 is scrolled through. Animate with `opacity` + `transform`; never hide content with `display: none` after it has been revealed.

**The Full-Saturation Rule.** Each section uses its light tint as the background, but the dominant colour must appear at full saturation somewhere on the screen — in a rep card, a stat block, a button, or a headline word. A section that is only a faint wash has broken the system.

## 2. Colors

The palette is fully saturated and fully distinct. Each colour role maps to a section of the experience, and each colour has two variants: a **light** tint for surfaces and a **vivid** version for high-contrast elements.

### Discovery — Rose
- **Rose** (`#e8614a`): The discovery colour. Rep card backgrounds for search section, primary CTA buttons, search field border, headline colour word on Section 1. Copy button hover state.
- **Rose Light** (`#fce7e3`): Section 1 background. Search dropdown hover. Step pill background for Section 1.

### Knowledge — Leaf
- **Leaf** (`#2d9e6b`): The knowledge colour. MP rep card background, diff tile background (MP column), contact card header for MP. Leaf-coloured headline word on Section 2.
- **Leaf Light** (`#d4f0e4`): Section 2 background. Chip colour for education/knowledge examples. Step pill background for Section 2.

### State — Violet
- **Violet** (`#5b5bd6`): The state colour. ADUN rep card background, diff tile background (ADUN column), contact card header for ADUN section. Violet headline word on Section 3.
- **Violet Light** (`#e0e0fa`): Section 3 background. Chip colour for state/local examples. Step pill background for Section 3. Contact row icon background.

### Action + Delight — Gold
- **Gold** (`#e8a320`): The action and delight colour. Stat block backgrounds, progress bar fill, completeness percentage text. Gold headline word on Section 4.
- **Gold Light** (`#fef4d6`): Section 4 background. Copy button default state. Chip colour for delight/action examples. Step pill background for Section 4.

### Neutral
- **Paper** (`#fdf9f4`): White card surfaces (explainer panels, contact rows, completeness box). Nav background. Never pure `#fff`.
- **Ink** (`#1a1714`): Primary text. Near-black with warm tint. Never pure `#000`.
- **Ink Soft** (`#3e3a36`): Body text, secondary content.
- **Ink Faint** (`#7a746e`): Placeholders, metadata labels, muted captions.

### Named Rules
**The Two-Tier Colour Rule.** Every named colour exists in two tiers: light (for section backgrounds, chip backgrounds, step pills) and vivid (for cards, buttons, badges, headline words, stat blocks). Never use only one tier — a section must show both.

**The Ink Anchor Rule.** Vivid colour backgrounds (rep cards, stat blocks, diff tiles) use white text. Light colour backgrounds (sections, panels) use ink-dark text. Never pair light-tinted text on a light-tinted surface.

**The Page Theme Rule.** Single-topic pages (anything other than the four-step homepage narrative) own one theme colour — chosen to match the page's role: gold for action/contribution, rose for discovery, leaf for education, violet for state/local content. On such a page, the header uses the theme's light tint, and every other section alternates between that same light tint and `paper`. Accents (eyebrows, keyword spans, decorative blobs, stat numbers, step badges) stay in the theme colour across both the tinted and the paper sections so the page reads as one. The Full-Saturation Rule still applies — at least one card, button, or stat block must render the theme at full saturation.

## 3. Typography

**Body Font:** Plus Jakarta Sans (warm geometric sans). Weights used: 400, 600, 700, 800.

**Character:** Single typeface throughout. The brand's personality comes from the weight contrast between 800-weight headlines and 400-weight body text — not from a serif/sans split. Heavy headlines create urgency; open body text maintains legibility and trust.

### Hierarchy
- **Display** (800, clamp(2.5rem, 7vw, 5rem), line-height 0.98, letter-spacing -0.025em): Used once per section hero. Compressed, commanding. The coloured keyword is styled in its section's vivid colour.
- **Headline** (800, clamp(1.75rem, 4.5vw, 3rem), line-height 1.05, letter-spacing -0.02em): Section subheadings. The key noun inherits its section colour.
- **Title** (700, 1.0625rem, line-height 1.35): Card titles, panel headers.
- **Body** (400, 1rem, line-height 1.65): All explanatory prose. Capped at 65ch. Never more.
- **Label** (700, 0.7rem, letter-spacing 0.08em, UPPERCASE): Metadata, tags, step labels.

### Named Rules
**The Coloured Keyword Rule.** In every display and headline, the most important noun or verb is wrapped in a `<span>` styled in its section's vivid colour. "Who represents **you?**" in rose. "Meet your **Member of Parliament**" in leaf. "Meet your **State Assembly Members**" in violet. "Now **contact them**" in gold.

**The 65-Character Rule.** Body text never exceeds 65ch. Enforced at component level.

**The Weight Contrast Rule.** Headlines are 800. Body is 400. Nothing in between except Title (700) on card headers. No 600-weight prose.

## 4. Elevation

Whoadunit is mostly flat, but not rigidly so. The **Colourful Rule** takes precedence over the original Flat Rule: vivid card backgrounds replace the need for shadows on representative cards. Buttons use a **hard colour-matched shadow** (`box-shadow: 0 4px 0 [shadow-colour]`) to create a tactile, playful feel — like a physical button you press.

### Shadow Vocabulary
- **Button Hard Shadow** (`box-shadow: 0 4px 0 [darkened-colour]`): Applied to primary buttons. Lifts on hover to `0 6px 0`. Creates a pressing/depth effect. Examples: rose button uses `#c84a35` shadow; leaf button uses `#1e7050` shadow.
- **Card Border** (`border: 2px solid rgba(26,23,20,0.07)`): White/paper cards on light section backgrounds use a faint ink border instead of a shadow. Keeps flatness where colour contrast handles hierarchy.
- **No diffuse ambient shadows** except on white explainer panels inside vivid sections (optional, light).

### Named Rules
**The Hard Shadow Rule.** Buttons use `box-shadow: 0 Npx 0 [shadow-colour]` — a hard, directional shadow with no blur. This is the only allowed box-shadow on interactive elements. Diffuse ambient shadows (`box-shadow: 0 8px 24px rgba(0,0,0,0.1)`) are only permitted on white/paper cards that appear inside vivid-colour section backgrounds.

## 5. Components

### Step Pills
Each section opens with a step pill: a pill-shaped label with a coloured circular number badge and uppercase text. The pill background is the section's light tint; the number badge is the section's vivid colour with white text. Example: Section 2 uses leaf-light background + leaf circle + "2 · YOUR MP — NATIONAL".

### Search Field
- **Border:** 2.5px solid rose (vivid), matching the discovery section colour
- **Shape:** Fully rounded pill
- **Shadow:** Hard shadow `4px 4px 0 rose` — reinforces the tactile feel
- **Focus:** Shadow deepens to `6px 6px 0 rose`
- **Dropdown:** Rounded (20px), faint ink border, rose-tinted hover

### Representative Profile Cards
- **Background:** Full vivid colour — leaf for MP cards, violet for ADUN cards
- **Text:** White throughout
- **Avatar:** Circular, white border at 35% opacity
- **Badge:** Frosted white pill (`rgba(255,255,255,0.25)`)
- **Corner radius:** 24px

### Explainer Panels (signature component)
White/paper background panels inside section-coloured backgrounds. `border: 2px solid rgba(26,23,20,0.08)`. Corner radius 24px. Contain: a bold question headline (700, 1.125rem), body text (400, 0.9rem, max 60ch), and rainbow chip set below.

### Rainbow Chips
Each example chip in an explainer panel uses a different colour. Within an MP panel (leaf section): first chip rose-light/rose, second leaf-light/leaf, third violet-light/violet, fourth gold-light/gold. The rainbow treatment signals "these are distinct examples" and adds visual energy. Font-weight 600.

### Stat Blocks (signature component)
Full vivid-colour background cards (gold, rose, or violet depending on context). White or ink text. Large display-size number (clamp(4rem, 10vw, 7rem), weight 800, letter-spacing -0.03em). Eyebrow label in uppercase, 0.65rem, 0.75 opacity. Caption text below (0.9rem). Corner radius 24px.

### Diff Comparison Tiles
Side-by-side tiles (MP vs ADUN). Leaf background for MP tile, violet background for ADUN tile. White text throughout. Role label uppercase 700 at 0.65rem, 0.7 opacity. Name 800-weight 1.25rem. Scope text 0.8rem at 0.75 opacity. Bullet points with white-circle markers at 0.6 opacity.

### Contact Cards (signature component)
White paper cards with a vivid-colour header (leaf for MP, violet for ADUN). Header shows representative name (800-weight) and role. Contact rows use colour-coded icons: rose-light circle for email, leaf-light for phone, violet-light for office. Copy button: gold-light background, gold text — turns gold-vivid on hover with white text.

### Profile Completeness (signature component)
White paper card inside the contact section. Percentage shown in gold-vivid at 1.75rem 800-weight. Progress bar uses gold as fill colour, 12px height pill-shaped. Missing field tags: rose-light background, rose text. Tone: inviting ("Help us make this more complete"), not clinical.

### Decorative Blobs
Large circles (width/height 300–600px) absolutely positioned in section corners. `opacity: 0.18`. Colour matches the section's vivid colour. A secondary blob in a contrasting colour (gold or rose) at smaller scale in the opposite corner adds energy. `border-radius: 50%`. `pointer-events: none`.

### Share Section
Full rose-vivid background card (not a section, but an inline block). White headline 800-weight. White body text at 0.85 opacity. Corner radius 24px. CTA buttons: white ghost on rose background.

## 6. Do's and Don'ts

### Do:
- **Do** use full vivid colour on representative cards, stat blocks, and diff tiles — not just as accents but as full card backgrounds with white text.
- **Do** colour the key word in every display and headline with its section's vivid colour.
- **Do** use rainbow chips — assign a different colour to each example chip in a set of four.
- **Do** include decorative blobs in section corners to add energy without adding clutter.
- **Do** use hard-shadow buttons (`box-shadow: 0 4px 0 [darkened-colour]`) — not diffuse shadows.
- **Do** give every statistic and chart a scroll-triggered entrance animation.
- **Do** make body text blocks 65ch maximum at every viewport.
- **Do** design every layout to work at classroom projector scale (1280px+, viewed from 3m+).
- **Do** include bilingual labels (BM/EN) in every wayfinding element.
- **Do** ensure all text meets WCAG AA: ink on light backgrounds, white on vivid backgrounds.
- **Do** give every single-topic page one theme colour. Use the theme's light tint for the header, alternate light-tint and paper for the remaining sections, and keep all accents in the theme colour.

### Don't:
- **Don't** revert to the old pastel-only system. Pastels are now light tints used as section backgrounds. The vivid colours are the system.
- **Don't** use monochrome chip sets — rainbow chips are the rule for example clusters of 4+.
- **Don't** use diffuse ambient box-shadows on interactive elements. Hard shadows only.
- **Don't** use pure black (`#000`) or pure white (`#fff`). Paper and ink.
- **Don't** make the interface look like JPN.gov.my, Malaysiakini, or a generic SaaS dashboard.
- **Don't** use gradient text, glassmorphism, or stripe card borders.
- **Don't** animate CSS layout properties. Reveals and entrances use `opacity` + `transform` only.
- **Don't** add a fourth typeface, a serif display, or an italic style. Plus Jakarta Sans only, four weights.
- **Don't** mute the colour to pastel on sections that already have a light-tint background — something on the screen must be vivid.
- **Don't** mix more than one theme colour across a single non-narrative page's sections. Multi-colour section flow is reserved for the homepage narrative.
