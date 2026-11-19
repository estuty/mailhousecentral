# Mailhouse Central website

The public website for Mailhouse Central, the dashboard for running newsletters across many WordPress sites
that run the [Mailhouse plugin](https://github.com/estuty/mailhouse). Mailhouse Central itself is in private
development; this site explains what it is, how it works and where it's up to.

A static site with no build step: plain HTML, CSS, a little JavaScript and fonts.

| File | What |
|---|---|
| `index.html` | The whole site: how it works, connecting a site, safeguards, failure behaviour, roadmap, what works today, questions |
| `styles.css`, `site.js` | Styles (light and dark), the mobile menu, and the hero's one stamp from pending to connected |
| `assets/fonts/` | Archivo, Literata, JetBrains Mono (latin, variable), SIL OFL 1.1, see `OFL.txt` |
| `assets/og.png` | Social preview image, rendered from `og-source.html` at 1200×630 |
| `favicon.svg` | The Mailhouse mark |
| `contact-worker/` | Cloudflare Worker that emails contact form messages to you; deployed to Cloudflare separately |

## Preview

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Publish

Live on GitHub Pages at https://estuty.github.io/mailhousecentral/, served from the `gh-pages` branch.
`.github/workflows/publish.yml` copies `main` to `gh-pages` on every push, so pushing to `main` is all it takes.
`.nojekyll` tells Pages to serve the files as they are.

The `og:image` and `og:url` tags use the GitHub Pages address. If the site moves to its own domain, update them
in `index.html`.

## Contact form

The form at the bottom of the page posts to a Cloudflare Worker (`contact-worker/`) that emails each message
through Cloudflare Email Service. It stays hidden until the Worker is deployed. Follow
`contact-worker/README.md`, then put the Worker's address in the form's `action` and remove `hidden` from the
contact section and its two links.

## Keep it current

- The roadmap section and the status line in the hero follow `docs/architecture/10-roadmap.md` in the
  Mailhouse Central repository. Update both when a milestone is accepted.
- "What works today" lists only what is built. Move items into it from the roadmap as they ship.
- Every claim comes from Mailhouse Central's README, its architecture documents or its code. The repository is
  private, so the site links only to the public plugin.
