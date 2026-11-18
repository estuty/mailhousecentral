# Mailhouse Central website

Static marketing site for Mailhouse Central, the multi-site newsletter dashboard (private repository
https://github.com/estuty/mailhouse-central). Its sites run the public Mailhouse plugin
(https://github.com/estuty/mailhouse). No framework and no build step; keep it that way.

- One page, `index.html`. Published to GitHub Pages from `gh-pages`, which a workflow mirrors from `main`.
- `styles.css`: design tokens at the top (`--ink` navy franking ink, `--paper` cool page, `--sky` airmail blue,
  `--red` postmark red, used sparingly; `--good`, `--waiting`, `--off` are the dashboard's own status colours).
  Light and dark themes via `prefers-color-scheme` plus `data-theme`. Fonts are self-hosted in `assets/fonts/`:
  Archivo (headings and UI, uses the width axis), Literata (prose), JetBrains Mono (real code only).
- The hero is a sorting rack, one pigeonhole per site, using the dashboard's real states (connected, pending,
  not reporting). Site names are `.example` domains. It is an illustration, not a screenshot.
- The perforated edge (`.perf`, `.tear`) is the one structural motif: the single-use enrolment token as a stamp,
  and the seam between what a site owns and what the centre owns. Don't spread it to other elements.
- `site.js`: mobile menu, and the hero's one stamp from pending to connected (once, when seen; static under
  reduced motion).
- Mailhouse Central is in development and not deployed. Only state what it does or is designed to do, and say
  which: built features go under "What works today", the rest is the roadmap or the design. Check claims against
  its README, `docs/architecture/` or code. Don't link to the private repository or publish its internal docs.
- Check changes at 1440, 820 and 390 px wide, light and dark: no horizontal scrolling, links and anchors resolve.

Preview: `python3 -m http.server 8000`.
