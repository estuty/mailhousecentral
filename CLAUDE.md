# Mailhouse website

Static marketing site for the Mailhouse WordPress plugin (the plugin lives in a separate repository,
https://github.com/estuty/mailhouse). No framework and no build step; keep it that way.

- `index.html` (home), `docs.html` (generated, don't edit by hand: edit `docs.template.html` and run
  `python3 build_docs.py [path/to/mailhouse]`).
- `styles.css`: design tokens at the top (`--ink` navy franking ink, `--paper` cool page, `--sky` airmail blue,
  `--red` postmark red, used sparingly). Light and dark themes via `prefers-color-scheme` plus `data-theme`.
  Fonts are self-hosted in `assets/fonts/`: Archivo (headings and UI, uses the width axis), Literata (prose),
  JetBrains Mono (real code only).
- The perforated edge (`.perf`, `.tear`) is the one structural motif: stamps for transports, and the seam
  between the two plugins Mailhouse replaces. Don't spread it to other elements.
- `site.js`: mobile menu, the hero postmark that re-stamps through the transports (paused off-screen and
  under reduced motion), and the docs contents.
- Only state what Mailhouse actually does; check claims against the plugin's README, readme.txt or code.
  There are no product screenshots yet; if added, they must be real captures.
- Check changes at 1440, 820 and 390 px wide, light and dark: no horizontal scrolling, links and anchors resolve.

Preview: `python3 -m http.server 8000`.
