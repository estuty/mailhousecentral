# Mailhouse website

The public website for [Mailhouse](https://github.com/estuty/mailhouse), the WordPress plugin that handles
SMTP and mail API delivery plus a self-hosted newsletter.
A static site with no build step: plain HTML, CSS, a little JavaScript and fonts.

| File | What |
|---|---|
| `index.html` | Home page: the problem, delivery, newsletter, privacy, getting started, testing, questions |
| `docs.html` | Admin, migration and developer guides, generated from the plugin's `docs/` folder |
| `docs.template.html` | The page `docs.html` is built from (header, contents, footer) |
| `build_docs.py` | Rebuilds `docs.html` from the plugin's guides |
| `styles.css`, `site.js` | Shared styles (light and dark) and the script for the menu, the hero postmark and the docs contents |
| `assets/fonts/` | Archivo, Literata, JetBrains Mono (latin, variable), SIL OFL 1.1, see `OFL.txt` |
| `assets/og.png` | Social preview image, rendered from `og-source.html` at 1200×630 |
| `favicon.svg` | The Mailhouse mark |

## Preview

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Publish

Any static host. Cloudflare Pages or Netlify: connect this repository, no build command, output directory `/`
(the repository root). Every push to `main` then updates the live site.

Once the site has a domain, make the `og:image` URL in `index.html` and `docs.html` absolute
(for example `https://mailhouse.example/assets/og.png`) so link previews pick it up.

## Keep it current

- Documentation: with the plugin cloned next to this repository (`../mailhouse`), run
  `pip install markdown pymdown-extensions && python3 build_docs.py`.
- Version number: the download buttons and the getting-started text name the current release (1.6.0).
  Update them when a new version ships; the links themselves always point to the latest release.
- Claims on the home page come from the plugin's `README.md` and `readme.txt`. Check them again when features change.
