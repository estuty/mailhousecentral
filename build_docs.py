#!/usr/bin/env python3
"""Build docs.html from the Mailhouse plugin's guides.

Usage: python3 build_docs.py [path/to/mailhouse]   (default: ../mailhouse)
Needs: pip install markdown pymdown-extensions
"""
import html
import re
import sys
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "mailhouse"
REPO = "https://github.com/estuty/mailhouse/blob/main/"
GUIDES = [
    ("docs/ADMIN-GUIDE.md", "Admin guide"),
    ("docs/MIGRATING.md", "Migrating"),
    ("docs/DEVELOPER-GUIDE.md", "Developer guide"),
]

seen = set()


def slugify(value, sep="-"):
    base = re.sub(r"[^\w\s-]", "", value.lower()).strip()
    base = re.sub(r"[\s_-]+", sep, base) or "section"
    slug, n = base, 2
    while slug in seen:
        slug, n = f"{base}-{n}", n + 1
    seen.add(slug)
    return slug


docs, toc_groups, first_ids = [], [], {}
for rel, label in GUIDES:
    text = (SRC / rel).read_text(encoding="utf-8")
    md = markdown.Markdown(
        extensions=["tables", "pymdownx.superfences", "toc", "sane_lists"],
        extension_configs={"toc": {"slugify": slugify, "permalink": "#", "permalink_class": "anchor",
                                   "permalink_title": "Link to this section"}},
    )
    body = md.convert(text)
    tokens = md.toc_tokens
    first_ids[Path(rel).name] = tokens[0]["id"] if tokens else ""
    entries = []
    for top in tokens:
        for h2 in top.get("children", []):
            entries.append((h2["id"], h2["name"]))
    docs.append((rel, body))
    toc_groups.append((label, tokens[0]["id"] if tokens else "", entries))


def fix_links(body):
    def repl(m):
        href = m.group(1)
        if href.startswith(("http", "#", "mailto:")):
            return m.group(0)
        name = href.split("#")[0].split("/")[-1]
        if name in first_ids:
            frag = href.split("#")[1] if "#" in href else first_ids[name]
            return f'href="#{frag}"'
        path = href[3:] if href.startswith("../") else "docs/" + href
        return f'href="{REPO}{path}"'
    return re.sub(r'href="([^"]+)"', repl, body)


toc_html = []
for label, top_id, entries in toc_groups:
    toc_html.append(f'<p><a href="#{top_id}" style="color:inherit;text-decoration:none">{html.escape(label)}</a></p><ul>')
    for i, name in entries:
        toc_html.append(f'<li><a href="#{i}">{name}</a></li>')
    toc_html.append("</ul>")

articles = "\n".join(f'<article class="doc" data-source="{rel}">\n{fix_links(b)}\n</article>' for rel, b in docs)

page = (ROOT / "docs.template.html").read_text(encoding="utf-8")
page = page.replace("{{TOC}}", "\n".join(toc_html)).replace("{{CONTENT}}", articles)
(ROOT / "docs.html").write_text(page, encoding="utf-8")
print(f"docs.html written from {SRC}")
