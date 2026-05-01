# Design

## Visual Theme

Calm civic tool. Pastel sage green as a soft identity accent. Warm cream base tinted toward green at very low chroma. The vibe: a well-printed document with a lofi, unhurried quality — easy on the eyes, immediately trustworthy.

**Scene sentence:** A Malaysian citizen searching on their phone during lunch break to find out which ADUN represents their neighborhood — bright ambient light, quick task, needs to find it fast and feel confident in the result.

**Mode:** Light default. Dark mode is an equal-citizen toggle, not an afterthought.

## Color Strategy

**Restrained with pastel identity** — soft sage green at reduced chroma (~0.065) and raised lightness (~52%). Secondary is dusty mauve for lofi warmth; tertiary is faded periwinkle. Surfaces are warm cream (hue ~95). No saturated accents. No gradients on text.

### Light Mode (OKLCH)
- Primary: `oklch(52% 0.065 148)` — soft sage green
- Primary container: `oklch(93% 0.025 148)` — barely-there sage wash
- On-primary: `oklch(99% 0.004 148)` — near-white
- On-primary-container: `oklch(30% 0.055 148)` — muted forest
- Secondary: `oklch(54% 0.045 340)` — dusty mauve
- Secondary container: `oklch(92% 0.018 340)` — blush wash
- Tertiary: `oklch(57% 0.050 255)` — faded periwinkle
- Tertiary container: `oklch(93% 0.020 255)` — lavender wash
- Background: `oklch(98% 0.005 95)` — warm cream
- Surface: `oklch(98% 0.005 95)`
- Surface container lowest: `oklch(99.5% 0.003 95)`
- Surface container low: `oklch(96.5% 0.007 95)`
- Surface container: `oklch(94.5% 0.008 95)`
- Surface container high: `oklch(92% 0.009 148)`
- Surface container highest: `oklch(89% 0.010 148)`
- On-surface: `oklch(22% 0.008 148)` — near-black with green tint
- On-surface-variant: `oklch(44% 0.018 148)` — medium sage-grey
- Outline: `oklch(66% 0.012 148)`
- Outline-variant: `oklch(87% 0.008 148)`
- Error: `oklch(52% 0.14 25)`

### Dark Mode (OKLCH)
- Primary: `oklch(75% 0.060 148)` — soft sage
- Primary container: `oklch(30% 0.042 148)` — muted forest
- On-primary: `oklch(18% 0.040 148)` — very dark sage
- On-primary-container: `oklch(88% 0.030 148)` — light sage
- Background: `oklch(16% 0.006 100)` — warm dark
- Surface: `oklch(16% 0.006 100)`
- Surface container lowest: `oklch(11% 0.005 100)`
- Surface container low: `oklch(19% 0.008 100)`
- Surface container: `oklch(22% 0.008 100)`
- Surface container high: `oklch(27% 0.010 148)`
- Surface container highest: `oklch(32% 0.010 148)`
- On-surface: `oklch(90% 0.007 148)`
- On-surface-variant: `oklch(76% 0.012 148)`
- Outline: `oklch(54% 0.014 148)`
- Outline-variant: `oklch(31% 0.010 148)`

## Typography

- **Display / Headings:** Libre Baskerville (serif) — used for h1, h2, brand name. Gives civic authority.
- **Body / UI:** Inter (sans-serif) — labels, inputs, tables, navigation. Gives modern readability.

### Scale (1.35 ratio)
- `--text-xs`: 0.72rem / 1.5 — labels, badges
- `--text-sm`: 0.82rem / 1.6 — secondary info, meta
- `--text-base`: 0.95rem / 1.65 — body text
- `--text-md`: 1.1rem / 1.5 — subheadings, section titles
- `--text-lg`: 1.4rem / 1.3 — card headings, medium titles
- `--text-xl`: 1.9rem / 1.2 — page titles
- `--text-2xl`: 2.6rem / 1.1 — hero headings
- `--text-3xl`: 3.5rem / 1.05 — display

Body max-width: 68ch.

## Components

### Cards
- Radius: 14px for most cards, 20px for hero/featured
- Border: 1px outline-variant
- Background: surface-container-low
- Hover: subtle shadow lift (`0 2px 12px oklch(18% 0.008 155 / 0.08)`) and `translateY(-1px)`
- No nested cards

### Buttons
- Primary: forest green background, near-white text. Radius 8px. No opacity-hover — use a 5% lightness bump.
- Tonal: secondary-container background
- Outline: transparent with outline-variant border, primary text
- All minimum 44px touch target

### Badges
- Radius: 999px
- MP: primary-container / on-primary-container
- ADUN: tertiary-container / on-tertiary-container
- Active: tertiary-container
- Inactive: surface-container-highest / on-surface-variant

### Navigation
- Active link: primary color with bottom border
- Header: surface-container-low background, thin outline-variant bottom border
- Height: 64px desktop

### Inputs
- Background: surface-container-highest
- Focus ring: primary color at 3px offset
- Border-radius: 10px

### Progress bars
- Track: surface-container-high
- Fill: color-coded (tertiary ≥75%, primary ≥50%, outline <50%)
- Height: 8px, fully rounded

## Spacing

- Page padding: 24px mobile, 24px–32px desktop
- Section vertical spacing: 48px–64px between major sections
- Card internal: 20px–28px
- Stack gap (tight): 4px–8px
- Stack gap (comfortable): 12px–16px
- Stack gap (open): 24px–32px

## Motion

- Page enter: `fadeSlideUp` 280ms ease-out — `from { opacity: 0; translateY(10px) }` to `{ opacity: 1; translateY(0) }`
- Card hover: `translateY(-1px)` 150ms ease-out
- Button press: `scale(0.98)` 80ms ease-out
- Progress fill: width transition 600ms ease-out
- No bounce, no elastic, no layout property animation

## Logo / Brand Mark

The "W" lettermark in a rounded-square container uses Libre Baskerville. Color: primary on primary-container. The tagline below is set in uppercase Inter at 0.65rem tracking 0.05em.
