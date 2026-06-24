# Design Handoff — "Protokolle" Visual System

A complete description of the visual design so another engineer can build a **new** app with the **exact same look and feel**. This is a *design system* document: color, type, spacing, components, states, motion, and responsive behavior.

Everything here is derived strictly from the **current** code and the current screenshot — not from any earlier spec or mockup. Framed as a reusable system, with the Protokolle app as the worked example.

> Companion files in this folder:
> - `design-tokens.css` — the exact tokens, copy/paste ready.
> - `assets/reference-app.png` — current screenshot of the running app (the source of truth for the look). **When in doubt, match the screenshot.**

---

## 1. Design philosophy

The aesthetic is **minimal, flat, and quiet, with soft pastel accents.**

- **Calm, mostly-white surfaces.** The whole UI reads as white: a left sidebar column and a main content column, separated by a hairline. Color appears only in small doses (topic pills, the highlight markers in notes).
- **Flat.** No gradients, no heavy borders, effectively no visible shadows in the main views. Dividers are thin `1px` light-gray lines. The few real shadows are reserved for popovers and the expanded detail panel.
- **High readability.** Generous line-height (1.55 body), tight heading tracking, large hit areas, plain sans-serif type, lots of whitespace.
- **Pastel, never saturated.** Where color is used, it's a soft pastel fill paired with a muted "dusty" text tone. Strong/primary color is avoided.
- **One decorative element.** The only expressive piece is the wordmark ("protokolle" / "stiftungen"), set in an inflated, rounded display font. Everything else stays neutral.
- **Near-black, not pure black.** Text and strong fills use `#262626` / `#272727`, never `#000` (single exception: the custom checkbox border).

The screenshot in `assets/reference-app.png` is authoritative — match it pixel-for-feel.

---

## 2. Color

All colors are CSS custom properties (see `design-tokens.css`). Reference tokens in components; never hard-code raw values.

### Core palette

| Token | Value | Role |
|---|---|---|
| `--color-app-bg` | `#fbfbfb` | Canvas behind the panels (barely distinct from white) |
| `--color-bg` | `#ffffff` | Inputs, table backgrounds |
| `--color-surface` | `#ffffff` | Cards, sidebar, main panel |
| `--color-text` | `#262626` | Primary text |
| `--color-line` | `#272727` | Near-black: strong borders, dark fills, primary buttons, active nav |
| `--color-muted` | `#6b6b6b` | Secondary / meta text, placeholders |
| `--color-border` | `#6b6b6b` | Emphasized borders (table-header underline) |
| `--color-border-soft` | `#e5e5e5` | Default input border, row dividers |

### Accent

| Token | Value | Role |
|---|---|---|
| `--color-brand` | `#ffffff` | The "on-dark" surface — text/badges sitting on a dark fill render white |
| `--color-brand-hover` | `#dffdff` | Pale-cyan hover wash (selectable rows) |
| `--color-brand-contrast` | `#262626` | Text on brand surfaces |
| `--color-title` | `#ff8a96` | Defined accent token for the wordmark (see note in §3) |

> Convention to know: `--color-brand` is *white*. "Brand" here means "the color that shows on top of a dark fill" — e.g. the active nav item's text.

### Feedback

| Token | Value |
|---|---|
| `--color-error` | `#d33` |
| `--color-success` | `#2a8a3e` |

### Pastel families (highlight markers + todo washes)

Used by the rich-text note editor — soft, low-saturation fills:

| Token | Value | Use |
|---|---|---|
| `--marker-yellow` | `#fef3c7` | Highlighter |
| `--marker-green` | `#d1fae5` | Highlighter |
| `--marker-blue` | `#dbeafe` | Highlighter |
| `--marker-pink` | `#fce7f3` | Highlighter |
| `--marker-to-do` | `#ffe8d6` | "open todo" line wash |
| `--marker-done` | `#d6f5dd` | "done" line wash |

### Topic / category color scale (10 steps)

Topics get a **deterministic** color: hash the topic name and take `% 10`. Each step is **muted "dusty" text on a flat pastel fill**, and the pills are **square (no border-radius)**. Visible in the screenshot: `struktur` (pink), `herbsttour` (blue), `fotoshooting` (teal). Full list in `design-tokens.css`:

| # | Text | Fill | Hue |
|---|---|---|---|
| c0 | `#a8478f` | `#fce7f3` | dusty pink |
| c1 | `#8a54a6` | `#f3e8ff` | muted purple |
| c2 | `#6a5cb0` | `#ede9fe` | muted violet |
| c3 | `#4b6cb0` | `#dbeafe` | dusty blue |
| c4 | `#3d8893` | `#cffafe` | muted teal |
| c5 | `#4a9162` | `#d1fae5` | muted green |
| c6 | `#7c9148` | `#ecfccb` | muted lime |
| c7 | `#9e8a45` | `#fef3c7` | muted gold |
| c8 | `#b56b45` | `#ffe8d6` | muted terracotta |
| c9 | `#b4515e` | `#fee2e2` | dusty red |

```js
// hashing used to pick a topic color class (entry-list-item-topic-c{0..9})
let hash = 0;
for (let i = 0; i < topic.length; i++) hash = (hash * 31 + topic.charCodeAt(i)) | 0;
const index = Math.abs(hash) % 10;
```

### Theming (re-skinning a section)

The accent is swapped per area by **overriding tokens on a scoped class** — no component changes. The app does this for its second sub-app ("stiftungen"): same shell, blue accent instead of pink.

```css
/* scoped override on the sidebar element of the secondary app */
.sidebar-stiftungen {
  --color-brand: #e5f2ff;
  --color-title: #8ac5ff;
}
```

### Dark mode

There is **no functional dark mode**. The live system is light-only. (A `prefers-color-scheme` stub exists in a base reset file but is not imported into the running stylesheet — treat the app as light-only.)

---

## 3. Typography

### Font families

| Role | Stack | Notes |
|---|---|---|
| **Body / chrome** | `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Weight 400, `letter-spacing: -0.005em`. Sidebar, login, dialogs. |
| **Main content panel** | `Helvetica, "Helvetica Neue", Arial, sans-serif` | The main panel and **all its children** override Inter with Helvetica. Intentional — content reads in Helvetica, chrome in Inter. |
| **Wordmark** | `"Nabla"` | Inflated/rounded decorative display font, used only for the app title. |
| **Monospace** | `"JetBrains Mono", Menlo, Monaco, "SF Mono", "Courier New", monospace` | Table column headers and topic pills — gives data a tabular, technical feel. |

Loaded weights: Inter 400/500/600/700, JetBrains Mono 400/500/600/700. (Chivo Mono is also loaded as an available mono alternate.)

**Wordmark note:** it's implemented with the "Nabla" color font plus a custom `font-palette` whose `--color-title` (`#ff8a96`) accent is defined — but in the **current build the wordmark renders near-black** (see screenshot), at ~`2.2rem`, centered, `letter-spacing: -0.02em`. Reproduce the inflated/rounded display look at that size; the accent token is there if you want to tint it.

```css
@font-palette-values --nablaTitle {
  font-family: "Nabla";
  base-palette: 0;
  override-colors: 0 #ff8a96, 1 #ff8a96, 2 #ff8a96;
}
.sidebar-title {
  font-family: "Nabla";
  font-palette: --nablaTitle;
  font-size: 2.2rem;
  letter-spacing: -0.02em;
  margin: 20px auto;   /* centered in the sidebar */
}
```

### Base settings

- Root font size: **16px** (drops to **15px** below 768px).
- Body line-height **1.55**; body letter-spacing **−0.005em**.
- Headings (`h1–h6`): weight **700**, letter-spacing **−0.02em**, line-height **1.15**.
- `-webkit-font-smoothing: antialiased`.

### Type scale (as used)

| rem | px @16 | Where |
|---|---|---|
| 2.2 | 35 | Wordmark (Nabla) |
| 2.0 | 32 | Page title |
| 1.5 | 24 | Auth/workspace titles, list headings |
| 1.3 | 21 | Detail-panel title (700) |
| 1.1 | 18 | Section titles (600), grouped headings (800) |
| 1.0 | 16 | Body, list item titles (400) |
| 0.875 | 14 | Buttons, table cells, meta, table headers (mono) |
| 0.8125 | 13 | Filter labels, dense cells, captions |
| 0.8 | 13 | Topic pills (mono, 600), workspace name caption |
| 0.75 | 12 | Meta labels (uppercase) |
| 0.625 | 10 | Smallest dense meta labels |

### Recurring text treatments

- **Table column headers:** monospace, `0.875rem`, weight 500–600, `letter-spacing: 0.05em`; underlined by a 1–2px border. Sort columns show a ` ▲`/` ▼` glyph on the active column (visible on "Datum ▼").
- **Creator byline:** the " - Name" appended after an item title is very light gray (`rgb(195,195,195)`) — present but recessive.
- **Meta labels** (detail panel, e.g. "Thema", "Datum"): `0.75rem`, weight 600, uppercase, `letter-spacing: 0.05em`, muted.
- **Links / link-buttons:** muted, `underline` with `text-underline-offset: 3px`; underline removed on hover.

---

## 4. Spacing, radii, elevation

### Spacing scale

`--space-1`…`--space-7` = `4, 8, 12, 16, 24, 32, 48 px`. Use these everywhere — no magic numbers. Internal gaps land mostly on `space-2`/`space-3`/`space-4`; section rhythm uses `space-5`/`space-6`/`space-7`.

### Radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Inputs, small chips, markers |
| `--radius-btn` | 6px | Buttons, active nav item |
| `--radius` | 15px | Generic / mobile cards |
| `--radius-lg` | 16px | Cards, sidebar, main panel, list table |

Notable exceptions: **secondary buttons are fully rounded pills** (`999px`) — which is why the icon-only action buttons read as **circles**; **topic pills are square** (`0`).

### Elevation

Deliberately minimal:

- `--shadow-sm` / `--shadow` = **none**. Most surfaces are flat.
- **Panels** (sidebar + main): a literal, very soft `box-shadow: 2px 2px 5px rgba(0,0,0,0.1)`. Because the canvas (`#fbfbfb`) is nearly white and the shadow is faint, the panels read as near-flush white columns split by a hairline rather than obviously floating cards.
- `--shadow-lg` = `0 8px 24px rgb(0 0 0 / 0.06)` — only for **popovers and the expanded detail panel**.
- Sticky toolbar gets a faint downward edge: `0 6px 12px -8px rgb(0 0 0 / 0.18)`.

---

## 5. Layout & app shell

See `assets/reference-app.png`.

```
┌──────────────────────────────────────────────────────────┐  ← #fbfbfb canvas (≈white)
│ ┌────────────┐│ ┌────────────────────────────────┐ [P][s]│  ← app switcher: fixed top-right
│ │ protokolle ││ │  Alle Traktanden               │       │     two square buttons, active = dark
│ │ Soybomb    ││ │  Suche  Datum von  Datum bis  [Filter…]│
│ │            ││ │ ─────────────────────────────────────│
│ │ ▸ nav      ││ │  Thema  Traktanden     Datum▼  Aktionen│  ← sortable mono headers
│ │   (active  ││ │  [pill] Title · creator  date   ◯ ◯ ◯ │  ← circular icon actions
│ │    = dark) ││ │  ...                                   │
│ │            ││ │                                       │
│ │ ┌────────┐ ││ │                                       │
│ │ │ footer │ ││ │                                       │
│ └────────────┘│ └────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
   hairline divider between the two white columns
```

- **Container:** `display: flex; height: 100vh`.
- **Sidebar:** fixed `270px`, `position: sticky; top: 0`, white surface, `radius-lg`, ~`10px` margin, soft panel shadow, internal `gap: space-4`, vertical flex. Contents top→bottom: centered **wordmark**, small muted **workspace name** caption (e.g. "Soybomb"), the **nav buttons**, then a `margin-top: auto` **footer** pinning Archiv / Einstellungen / Abmelden to the bottom.
- **Main panel:** `flex: 1`, white surface, `radius-lg`, ~`20px` side margins, soft panel shadow, scrolls independently. Has **no top padding** so the sticky toolbar can pin flush to the top edge; top spacing is restored on other direct children.
- **App switcher:** small floating control, `position: fixed`, top-right (top-left on mobile). Two square `~2.25rem` buttons with single-letter labels (`p` / `s`) to switch sub-apps; the active one gets the dark fill + white label.
- **Sticky toolbar:** the list title + filter bar stick to the top of the main panel; they bleed full-width over the panel's side padding so the rounded corners clip them cleanly, with a faint bottom shadow.

> Note: the dark circular "N" badge sometimes visible at the very bottom-left of the screenshot is the Next.js dev-tools indicator, **not** part of the app UI — don't reproduce it.

---

## 6. Components

All form controls are styled **globally** (element selectors) so children inherit; controls are not re-styled per component.

### Buttons

| Variant | Look |
|---|---|
| **Default** | `--btn-bg #ededed` fill, `--color-text`, `radius-btn` (6px), padding `space-2 space-4`, weight 500, `0.875rem`. Hover → `#dcdcdc`. |
| **Primary** (`.primary`) | `--color-line` (`#272727`) fill, **white** text. Hover → `#3d3d3d`. Used for "Speichern". |
| **Secondary** (`.secondary`) | White fill, `1.9px` border (`#ededed`), **fully rounded pill** (`999px`). Hover fills with the border color. Used for "Filter zurücksetzen", "Abbrechen", and all **icon-only action buttons** (which therefore render as circles). |
| **Link button** | No fill/border, muted underlined text; hover darkens. Low-priority actions (auth screens). |

States: `:focus-visible` → `2px solid --color-line` outline, `2px` offset (all controls). `:disabled` → `opacity: 0.4; cursor: not-allowed`. Transition: `background-color, color 0.15s ease`.

### Row / item actions

Each list row ends with an **Aktionen** cell of **circular white outlined icon buttons** (the `.secondary` variant, icon-only): **Pencil** (edit), **Archive**, **Trash** — Lucide icons at `size 16`. (Grouped/open lists also use **MailPlus / MailMinus** to move items in/out of an inbox, at `size 14`.) Action clicks `stopPropagation` so they don't toggle the row.

### Inputs / textareas / selects

- Padding `space-3 space-4`, `1.5px solid --color-border-soft`, `radius-sm` (4px), white bg, full width.
- **Focus:** outline removed, **border switches to `--color-line`** (near-black) — focus shown by border, not a ring.
- **Select:** native caret removed (`appearance: none`), replaced by an inline SVG chevron on the right with extra right padding.
- **Textarea:** `resize: vertical`, `min-height: 100px`.
- **Labels:** block, weight 500, `margin-bottom: space-2`. Filter labels are smaller (`0.8125rem`) and sit above their field.

### Cards

White surface, `radius-lg`, padding `space-6`, flat (no shadow). Mobile: padding `space-5`, radius `15px`.

### Sidebar navigation

- **Nav button:** transparent, full-width, left-aligned, optional leading Lucide icon (`size 20`) with `gap: space-3`, padding `space-2 space-4`, weight 500.
- **Hover & active:** **dark fill** (`--color-line`) + white text (`--color-brand`), `radius-btn` corners. Hover and active look identical — strong, unambiguous selection (see "Alle Traktanden" active in the screenshot).
- **Count badge** (ToDo): `1.75rem` circle pushed right with `margin-left: auto`, white fill + dark text, weight 600. On the white sidebar the white fill is invisible, so it reads as just the number (e.g. "7").

### Tables (core data surface)

- **List table** (Alle/Offene Traktanden): white bg, `radius-lg`. Headers: monospace, `0.875rem`, weight 500, `letter-spacing 0.05em`, underlined by `1px --color-border`; sortable headers are `cursor: pointer` (hover → muted) and append ` ▲`/` ▼`. Rows divided by `1px --color-border-soft` (last none); row hover → `#fafafa`; whole row is clickable (`cursor: pointer`) and expands an inline detail panel; a selected row gets a `2px` brand outline (inset).
- **Uppercase-header tables** (todo / schedule lists): `thead` on white surface with a `2px --color-border` bottom border; headers uppercase, weight 600, `letter-spacing 0.05em`.
- **Member tables:** lighter — muted uppercase `0.8rem` headers, soft row dividers.

### Topic pills

Inline, **square** (no radius), padding `0.15em space-2`, monospace, `0.8rem`, weight 600, colored from the 10-step topic scale (§2). `box-decoration-break: clone` so wrapped pills keep their fill.

### Detail panel (expanded row)

White surface, `radius-lg`, padding `space-5`, **`--shadow-lg`** (one of the few elevated elements). Title `1.3rem`/700 with the light-gray creator byline; a meta row of uppercase `0.75rem`/600 muted labels (Thema, Datum) and values; thin dividers between header / meta / content. The action icon-buttons (Pencil / Archive / Trash) sit in the header. Inside a grouped list the panel renders edge-to-edge (negative side margins, no radius).

### Rich-text note editor

The content body supports inline formatting plus highlighting and todo lines:

- `mark.marker-{yellow|green|blue|pink}` → pastel fill, `radius-sm`, `padding: 0 2px`, `box-decoration-break: clone`.
- `.todo-line` → `--marker-to-do` wash; `.done-line` → `--marker-done` wash.
- Marker picker: a small popover (`--shadow-lg`) of square swatch buttons, each showing its own pastel.
- Editor placeholder text appears in muted color when empty.

### Filters bar

Horizontal flex, wraps, `align-items: flex-end`, transparent. Each field is `flex: 1; min-width: 200px` with a small label above a compact input; a "Filter zurücksetzen" secondary pill sits at the end. Collapses to a full-width vertical stack on mobile.

### Checkboxes

**Custom square checkboxes:** `appearance: none`, `1.1rem` square, **`2px solid #000`** (the only pure-black in the system), no radius, white bg. Deliberately graphic — not the rounded native control.

### Empty states

Centered, padding `space-7`, muted text, one short sentence (e.g. "Noch keine Traktanden. Erstelle dein erstes Traktandum.").

### Toasts

`react-hot-toast`, anchored **bottom-right**. Short, conversational success/error messages in the product's language.

### Auth / workspace screens

Centered single column on the canvas, `max-width ~400–440px`, vertical `gap`. Title `1.5rem`, stacked fields, full-width submit, muted underlined link-buttons for secondary actions. Selectable list rows are bordered and, on hover, gain a `--color-line` border + pale-cyan (`--color-brand-hover`) wash.

---

## 7. Iconography

- Library: **Lucide** (`lucide-react`) — thin line icons, consistent with the flat aesthetic.
- Sizes in use: **20px** (sidebar nav, mobile burger), **18px** ("Neues Traktandum" + button), **16px** (row/detail actions), **14px** (dense grouped-list actions).
- Icons seen: list/todo, tag, settings (gear), archive, log-out, pencil, trash, mail-plus/minus, plus, menu/close.
- Icon-only buttons always carry an `aria-label` or `title`.

---

## 8. Interaction & motion

- **Short, subtle transitions:** `0.15s ease` on `background-color`/`color` for buttons and nav. Nothing bouncy.
- **Sidebar drawer (mobile):** slides in via `transform: translateX(-100% → 0)` over `0.25s ease`.
- **Hover-reveal actions:** in the detail/notes view an edit button is `opacity: 0` and fades to `1` on hover (`opacity 0.15s ease`); always visible on mobile.
- **Row expansion:** clicking a table row toggles an inline detail panel beneath it; clicking again (or the panel header) collapses it.
- **Selection** is shown by fill or outline, never by text-color shifts. **Focus** is always visible.

---

## 9. Responsive behavior

Single breakpoint: **`max-width: 768px`**.

- Root font size **16px → 15px**.
- Layout switches from side-by-side flex to a stacked block; the **sidebar becomes a full-screen fixed overlay** sliding in from the left, toggled by a fixed **burger button** (top-right, `2.5rem` square). App switcher moves to top-left.
- **Tables** keep a `min-width` (~560px) and the wrapper scrolls horizontally — columns are preserved, not reflowed.
- **Forms** stack; buttons go **full width**.
- Card padding/section spacing step down a notch; card radius eases to `15px`.

---

## 10. Voice & content (design-relevant)

- **Language:** the UI is **German** (e.g. *Traktanden, Themen, ToDo, Archiv, Einstellungen, Abmelden, Filter zurücksetzen*). Tone is short, friendly, direct. Match your target locale but keep the brevity.
- **Dates:** rendered `dd.mm.yyyy` via `de-DE` locale (e.g. `17.06.2026`).
- **Sub-app model:** the shell can host more than one "app", switched via the floating `p`/`s` control, each with its own accent (pink vs. blue) and its own sidebar nav set. To replicate: keep the shell identical and vary only the accent tokens + nav items.

---

## 11. Accessibility notes

- Visible focus on every interactive control (`:focus-visible` outline; inputs change border on focus).
- Icon-only controls carry `aria-label`/`title`; the mobile menu toggles its label between open/close.
- Semantic tables for tabular data; semantic headings.
- Verify contrast when reusing the **muted-text-on-pastel** topic pills and `--color-muted` / light-gray byline text against WCAG AA — some dusty-on-pastel pairs are borderline at small sizes.

---

## 12. Build checklist (to reproduce the look)

1. Drop `design-tokens.css` into a global stylesheet; reference tokens only.
2. Load fonts: **Inter** (400/500/600/700), **JetBrains Mono** (400–700), **Nabla** (display, wordmark). Body → Inter; main content panel → the **Helvetica** stack.
3. Add global element styles for `button`, `input`, `textarea`, `select`, `label`, `a` so children inherit (don't re-style controls per component).
4. Build the **two white columns** (sidebar + main) on a `#fbfbfb` canvas with `radius-lg`, the faint `2px 2px 5px rgba(0,0,0,0.1)` panel shadow, and a hairline divider feel.
5. Keep everything **flat**; reserve `--shadow-lg` for popovers + the expanded detail panel only.
6. Use the **monospace, letter-spaced** treatment for sortable table headers (with ▲/▼); **square pastel pills** for topics; **circular white outlined** icon buttons (`.secondary`) for row actions; **square `2px #000`** checkboxes.
7. Implement the deterministic 10-step **topic color scale** (hash → `%10`).
8. Respect the single **768px** breakpoint and the sidebar-drawer behavior.
9. Compare side-by-side against `assets/reference-app.png`.
