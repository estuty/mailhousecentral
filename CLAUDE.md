# Mailhouse Central website

Static marketing site for both products: the free Mailhouse plugin (public, https://github.com/estuty/mailhouse)
and Mailhouse Central, the paid multi-site dashboard (private repository https://github.com/estuty/mailhouse-central,
live at https://app.mailhousecentral.com/). No framework and no build step; keep it that way.

- One page, `index.html`. Live at https://mailhousecentral.com/ through the Cloudflare Worker `mailhousecentral`
  (Workers Builds deploys every push to `main`); GitHub Pages is not used. Never give the
  Worker a wildcard route: `app.mailhousecentral.com` is the Central dashboard on its own server.
- `styles.css`: design tokens at the top (`--ink` navy franking ink, `--paper` cool page, `--sky` airmail blue,
  `--red` postmark red, used sparingly; `--good`, `--waiting`, `--off` are the dashboard's own status colours).
  Light and dark themes via `prefers-color-scheme` plus `data-theme`. Fonts are self-hosted in `assets/fonts/`:
  Archivo (headings and UI, uses the width axis), Literata (prose), JetBrains Mono (real code only).
- The hero is a sorting rack, one pigeonhole per site, using the dashboard's real states (connected, pending,
  not reporting). Site names are `.example` domains. It is an illustration, not a screenshot.
- The perforated edge (`.perf`, `.tear`) is the one structural motif: the single-use enrolment token as a stamp,
  and the seam between what a site owns and what the centre owns. Don't spread it to other elements.
- `site.js`: mobile menu, the hero's one stamp from pending to connected (once, when seen; static under
  reduced motion), and the plugin's latest release from the GitHub API, filling `data-plugin-version`,
  `data-plugin-date`, `data-plugin-zip` and `data-plugin-notes`. The HTML keeps a working fallback for each.
- Mailhouse Central is live (1.0.2 since November 2026). Only state what is released: Central's features go
  under "What Mailhouse Central does", the plugin's in its own section. Check claims against Central's README,
  `docs/architecture/` or code, and the plugin's readme.txt. Don't link to the private repository or publish
  its internal docs. Central's running version under Releases is typed by hand: update it on each deploy.
- Contact form (live): `<section id="contact">` posts to the Worker `mailhouse-contact`
  (https://mailhouse-contact.estuty777.workers.dev/), built from `contact-worker/` by Workers Builds on every push
  to `main`. It sends as contact@mailhousecentral.com (domain onboarded for Email Sending) with the visitor as
  Reply-To. The form's topics must match `TOPICS` in `contact-worker/src/index.js`. The recipient is the
  `CONTACT_TO` secret in the dashboard: never commit it.
- Pricing: the Mailhouse plugin is free (GPL), including its connector to Central; Mailhouse Central is a paid
  service. No prices have been set: don't invent figures, plans or tiers until they are given.
- Check changes at 1440, 820 and 390 px wide, light and dark: no horizontal scrolling, links and anchors resolve.

Preview: `python3 -m http.server 8000`.
