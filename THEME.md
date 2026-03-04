# THEME — Le vie della parità · Design System

## Overview

This document describes the visual identity for **le vie della parità**, a map-based memorial
project dedicated to the *Pietre d'Inciampo* in Milan. The design language draws on the
physicality of the brass Stolperstein: warm gold against dark, weathered surfaces.

---

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--gold` | `#d4af37` | Primary accent, SVG path, borders, interactive elements |
| `--gold-bright` | `#ffdf00` | Highlight states, map marker glow |
| `--gold-dark` | `#c9a227` | Grid lines, secondary accents |
| `--bg-dark` | `#1a1310` | Splash overlay background, info panel background |
| `--bg-darker` | `#120f0c` | Deeper dark surfaces |
| `--text-warm` | `#f5f0e8` | Body text on dark backgrounds |
| `--text-muted` | `#9a8f7e` | Secondary/caption text on dark backgrounds |

Map tile: CartoDB Voyager (`rastertiles/voyager`) — neutral, low-saturation base that lets the
gold markers stand out.

---

## Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / Titles | Playfair Display | 400, 700 | Serif, used for `h1`–`h2` and splash title |
| UI / Body | Inter | 400, 500, 600 | Sans-serif, used for all interface copy |

**Type scale** (approximate):

| Label | Size | Weight |
|---|---|---|
| Splash title | `clamp(2rem, 5vw, 3rem)` | 400 |
| Splash subtitle | `0.75rem` + 0.14em tracking | 600 uppercase |
| Info panel title | `1.1rem` | 400 |
| Body text | `0.82–0.95rem` | 400 |
| Caption / footer | `0.7rem` | 400 uppercase |

---

## Spacing Tokens

Spacing follows a base-8 grid:

| Token | Value |
|---|---|
| `xs` | `0.5rem` (8 px) |
| `sm` | `1rem` (16 px) |
| `md` | `1.5rem` (24 px) |
| `lg` | `2rem` (32 px) |
| `xl` | `2.5rem` (40 px) |

---

## Component Specs

### Splash screen (`.splash-overlay`)

- Full-screen fixed overlay, `z-index: 9999`
- Background: `--bg-dark` with a city-grid pattern (faint gold lines, 48 px × 48 px)
- Exit animation: `opacity → 0, visibility: hidden` over 0.8 s (`ease`)
- SVG logo: 160 × 24 px dashed path (`strokeDasharray: 6 4`) with 5 square stones animating
  via `stoneAppear` keyframe (scale + opacity, staggered 0.2 s per stone)
- CTA button: gold border, transparent fill → gold fill on hover/focus

### App header (`.app-header`)

- Absolute, top-left (`top: 1rem; left: 1rem`), `z-index: 800`
- Semi-transparent dark background (`rgba(26,19,16,0.82)`) with `backdrop-filter: blur(8px)`
- Gold border `rgba(212,175,55,0.35)`
- Contains: mini SVG logo · app name · ℹ toggle button
- `aria-expanded` on info button reflects panel open/closed state

### Info panel (`.info-panel`)

- Absolute, below header (`top: 3.5rem; left: 1rem`), `z-index: 800`
- Same dark-glass treatment as header
- Slides in with `opacity + translateY` transition (0.2 s `ease`)
- `aria-hidden` toggles with open/closed state
- Contains: project description, artist credit, gold marker legend

---

## Keyframes

```css
/* Full motion */
@media (prefers-reduced-motion: no-preference) {
  @keyframes stoneAppear {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}
/* Reduced motion: opacity fade only */
@media (prefers-reduced-motion: reduce) {
  @keyframes stoneAppear { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeInUp    { from { opacity: 0; } to { opacity: 1; } }
}
```

---

## Accessibility

- All interactive elements have `:focus-visible` styles (no `outline: none` without a
  replacement).
- `aria-hidden="true"` is set on purely decorative SVGs.
- `aria-expanded` / `aria-controls` / `aria-hidden` are used on the info toggle and panel.
- The splash CTA receives `autoFocus` so keyboard users can dismiss immediately.
- Colour contrast: gold (`#d4af37`) on dark (`#1a1310`) ≈ 7.8 : 1 — exceeds WCAG AA for normal
  text and WCAG AAA for large text. Note: `--gold-bright` (`#ffdf00`) has a higher contrast
  (~12 : 1) on `--bg-dark`, while `--gold-dark` (`#c9a227`) is approximately 6.8 : 1 and
  should only be used for decorative or large text elements where AA large-text (3 : 1) applies.
- All motion animations respect `prefers-reduced-motion`: when reduced motion is preferred,
  scale/translate animations are replaced with simple opacity fades.

---

## Tone of Voice

- **Language**: Italian throughout the interface.
- **Register**: Respectful, understated, commemorative. Avoid sensationalism.
- **Labels**: Use lowercase Italian in display headings (*le vie della parità*) for stylistic
  consistency; uppercase only for short subtitles/captions.
- **Link copy**: Descriptive, never "click here".
