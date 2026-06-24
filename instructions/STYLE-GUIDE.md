# STYLE-GUIDE

> **Source of truth:** the **Design Handoff** in `instructions/Design Handoff/`
> (`DESIGN-HANDOFF.md`, `design-tokens.css`, `assets/reference-app.png`).
> This guide is a short pointer to it. If anything here disagrees with the
> Design Handoff, the Design Handoff wins. When in doubt, match the screenshot.

The main stylesheet is `styles/main.css`.
All fields, inputs, buttons, selects and labels are defined **globally** in
`styles/main.css` so children inherit — never re-style controls per component.

## Visual direction

Minimal, flat, and quiet, with soft pastel accents. Mostly-white surfaces:
white panels on a near-white canvas, separated by hairline dividers. Color
appears only in small doses (pastel pills, highlight markers). Flat — effectively
no shadows in the main views; real shadows are reserved for popovers and the
expanded detail panel. High readability: generous line-height, plain sans-serif,
lots of whitespace. Near-black text (`#262626` / `#272727`), never pure black
(single exception: the custom checkbox border).

## Tokens (defined in `styles/main.css`, copied from `Design Handoff/design-tokens.css`)

- Surfaces/text: `--color-app-bg`, `--color-bg`, `--color-surface`, `--color-text`,
  `--color-line`, `--color-muted`.
- Borders: `--color-border`, `--color-border-soft`.
- Accent: `--color-brand` (white — the "on-dark" surface), `--color-brand-hover`,
  `--color-brand-contrast`, `--color-title`.
- Feedback: `--color-error`, `--color-success`.
- Markers (rich text): `--marker-yellow|green|blue|pink`, `--marker-to-do`, `--marker-done`.
- Spacing: `--space-1 .. --space-7` (4, 8, 12, 16, 24, 32, 48px).
- Radii: `--radius-sm` (4), `--radius-btn` (6), `--radius` (15), `--radius-lg` (16).
- Button fills: `--btn-bg`, `--btn-bg-hover`, `--btn-primary-hover`.
- Elevation: `--shadow-sm`/`--shadow` (none), `--shadow-lg` (popovers/detail only).
- Topic pill scale: `.topic-c0 .. .topic-c9` (muted text on flat pastel, square).

## Type

- **Body / chrome:** Inter (`--font-primary`).
- **Main content panel and its children:** Helvetica (`--font-content`).
- **Wordmark:** Nabla (`--font-display`), inflated/rounded display font — the one
  decorative element.
- **Monospace** (table headers, pills): JetBrains Mono (`--font-mono`).

## Rules

- Buttons, inputs, selects use tokens only (no inline magic numbers).
- Inputs show focus by switching their **border** to `--color-line` (no ring);
  every other interactive control has a visible `:focus-visible` outline.
- Default button = `#ededed` fill; `.primary` = near-black fill + white text;
  `.secondary` = white fill, border, fully-rounded pill (icon-only = circles).
- Square pastel pills for tags; square `2px #000` checkboxes.
- Class naming: `component-name-element-modifier` (kebab-case).

## Local notes (project-specific overrides on top of the Design Handoff)

- The app keeps its decorative **background SVG** (`/background.svg`) as the
  canvas; the white panels float on top of it (rather than the flat `#fbfbfb`
  canvas described in the handoff).
- The **Learn** button keeps its existing green accent for now.
- The wordmark reads **"flashcards"**.
- The pastel pill treatment is applied to the **language picker / language tags**.
- The language picker stays as a small floating control, top-right.
