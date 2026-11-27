# Mailhouse Central website

The public website for both products: the free [Mailhouse plugin](https://github.com/estuty/mailhouse) for
WordPress, and Mailhouse Central, the paid dashboard that runs the newsletters of many Mailhouse sites (live at
https://app.mailhousecentral.com/; its repository is private).

A static site with no build step: plain HTML, CSS, a little JavaScript and fonts.

| File | What |
|---|---|
| `index.html` | The whole site: the plugin, how it works, what Central does, connecting a site, safeguards, failure behaviour, releases, pricing, questions |
| `styles.css`, `site.js` | Styles (light and dark), the mobile menu, the hero's one stamp from pending to connected, and the plugin's latest version read from GitHub |
| `assets/fonts/` | Archivo, Literata, JetBrains Mono (latin, variable), SIL OFL 1.1, see `OFL.txt` |
| `assets/og.png` | Social preview image, rendered from `og-source.html` at 1200×630 |
| `favicon.svg` | The Mailhouse mark |
| `contact-worker/` | Cloudflare Worker that emails contact form messages to you; deployed to Cloudflare separately |

## Preview

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Publish

Live at **https://mailhousecentral.com/** (and `www.`), served by the Cloudflare Worker `mailhousecentral`, a
static-assets Worker connected to this repository with Workers Builds: every push to `main` is built and deployed
within about a minute. Pushing to `main` is all it takes. Its two custom domains create their own DNS records
and certificates; `app.mailhousecentral.com` is the Central dashboard on its own server and is not routed through
the Worker. Don't add a wildcard route (`*.mailhousecentral.com/*`) to the Worker: it would catch every proxied
subdomain, the dashboard included if its record were ever switched to proxied.

A second copy still publishes to GitHub Pages (https://estuty.github.io/mailhousecentral/) through
`.github/workflows/publish.yml` and `.nojekyll`. It can be switched off under the repository's Settings → Pages.

`og:image`, `og:url` and the canonical link in `index.html` use https://mailhousecentral.com/.

## Contact form

The form at the bottom of the page posts to a Cloudflare Worker (`contact-worker/`) that emails each message
through Cloudflare Email Service. It stays hidden until the Worker is deployed. Follow
`contact-worker/README.md`, then put the Worker's address in the form's `action` and remove `hidden` from the
contact section and its two links.

## Keep it current

- **Plugin version: automatic.** `site.js` reads https://api.github.com/repos/estuty/mailhouse/releases/latest
  and fills every `data-plugin-version`, `data-plugin-date`, `data-plugin-zip` and `data-plugin-notes`. The
  values written in `index.html` are only the fallback if GitHub can't be reached; bump them now and then.
- **Central version: by hand.** GitHub can't be asked about a private repository, so "Running 1.0.2" under
  Releases is plain text. Change it whenever a new Central version is deployed (`scripts/deploy.sh`).
- New features go into "What Mailhouse Central does" or the plugin section once they're released, not before.
- Every claim comes from Mailhouse Central's README, its architecture documents or its code, or the plugin's
  readme.txt. The Central repository is private, so the site links only to the public plugin.
