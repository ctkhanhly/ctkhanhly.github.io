# ctkhanhly.github.io

Personal site on GitHub Pages: a keyboard-navigable command palette on the
home page leading into three sections (Tech Blogs, Code, Book Review), each
a list of markdown posts. No framework, no client router — `build/build.js`
compiles `content/**/*.md` into plain static HTML files that GitHub Pages
serves directly. See `docs/tech/architecture.md` for the full design
rationale (local-only file, not deployed — `docs/` is gitignored).

## Commands

```bash
npm install          # first time only
npm run build         # regenerate index.html, <section>/index.html, <section>/<slug>/index.html
python3 -m http.server        # serve the repo root, default port 8000 -> http://localhost:8000
python3 -m http.server 5500    # same, on a different port -> http://localhost:5500
```

There is no dev-server auto-rebuild — after editing `content/`, `build/`,
`css/`, or `js/`, you must re-run `npm run build` before refreshing the
browser or pushing.

## Adding a blog post

Create `content/<section>/<slug>.md` where `<section>` is one of
`tech-blogs`, `code`, `book-review`:

```markdown
---
title: My Post Title
date: 2026-07-27
excerpt: One or two sentences shown in the section list.
---

Post body in markdown. Any heading level (#, ##, ###) becomes a ToC entry
in the post's sidebar index, nested by level.
```

Then `npm run build`. This writes `<section>/<slug>/index.html`; if a
`.md` file is deleted, rerunning the build also deletes its stale output
directory (`clean()` in `build/build.js` wipes `<section>/` before
regenerating it).

Commit both the source `.md` and the generated HTML, then push — GitHub
Pages serves whatever's committed, there's no build step in CI.

## Gotchas learned the hard way

- **`background` vs `background-dark`**: the Tailwind color config
  (`build/templates.js` `TAILWIND_CONFIG`) has *separate* light/dark tokens
  — `background: '#f9f9fb'` (light) and `background-dark: '#0A0A0A'` (dark).
  `dark:bg-background` is a real, valid Tailwind class that silently
  resolves to the **light** color, so dark mode looks broken but throws no
  error. Same trap exists for `surface` vs no dark counterpart — always
  pair `dark:` with an explicit `-dark`-suffixed token (`background-dark`,
  `border-dark`, `text-dark`, `on-tertiary-container`, `tertiary-container`,
  `secondary-fixed-dim`), never assume the base token auto-adapts.
- **Internal links must be absolute root paths** (`/tech-blogs/`, not
  `tech-blogs/index.html` or `../tech-blogs/`). This repo is a
  `username.github.io` repo, served at the domain root both locally
  (`python3 -m http.server` from repo root) and in production, so `/...`
  paths resolve identically in both. Every page is a real static file at
  a real path — there's no SPA router or `404.html` redirect trick.
- **`assets/` is intentionally gitignored and never committed.** The logo
  and intro video are referenced by their CloudFront URLs directly
  (`https://d10weyj3t86y7.cloudfront.net/assets/...`) in
  `build/templates.js` (`LOGO_URL`, `VIDEO_URL`), not local paths.
- Dark mode is applied via a small blocking inline script in `<head>`
  (`NO_FLASH_THEME_SCRIPT` in `templates.js`) that reads `localStorage`
  before paint, so there's no flash of the wrong theme. The toggle click
  handler lives in `js/interactions.js`.
- The `toc-link` active/inactive class lists in `js/interactions.js`
  (`TOC_ACTIVE_CLASSES` / `TOC_INACTIVE_CLASSES`) must stay in sync with the
  literal classes used in `renderPost()` in `build/templates.js` — the
  ToC scroll-highlighter does raw class add/remove, not a data-attribute
  toggle, so if you restyle the ToC links, update both places.
- No visual browser testing tool was available in the session that built
  this (Chrome extension wasn't connected) — changes were verified via
  `curl`/grep against the generated HTML, not by actually looking at it. Do
  a manual pass in a real browser after any template/CSS change.
