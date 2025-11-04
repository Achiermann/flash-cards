# STYLE-GUIDE

The main stylesheet is main.css
All fields, inputs, buttons should be defined globaly in the main.css

## Visual direction

Minimal, readable, high-contrast, subtle elevation.

## Tokens (defined in `styles/main.css`)

- Colors: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-brand`.
- Radii: `--radius-sm`, `--radius`, `--radius-lg`
- Shadows: `--shadow-sm`, `--shadow-lg`
- Spacing: `--space-1 .. --space-7`

## Rules

- Buttons and inputs use tokens only (no inline magic numbers).
- Focus visible rings on all interactive controls.
- Class naming: `component-name-element-modifier` (kebab-case).

## Inspiration

Style it like https://achiachi.ch/
Screenshot 2025-11-03 at 10.40.00 in the root directory.
Font family is "Cutive Mono" from google fonts. 
I especially like the pattern of the titles having the light red backround, and the content text having no background.

take studio-sidefin-logo.png, put it in the public folder and make it the logo for the main page.


...
