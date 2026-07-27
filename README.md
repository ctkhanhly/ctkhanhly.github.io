# ctkhanhly.github.io

Personal site: a keyboard-navigable command palette on the home page leading
into three sections — Tech Blogs, Code, and Book Reviews — each a list of
markdown posts.

## How it works

There's no framework or client-side router. `build/build.js` reads markdown
files from `content/<section>/`, renders them with `marked`, and writes plain
static HTML files (`index.html`, `<section>/index.html`,
`<section>/<slug>/index.html`) to the repo root — those generated files are
what GitHub Pages serves. Navigation between pages is real `<a href>` links;
`js/interactions.js` layers on keyboard navigation (arrow keys + Enter), a
click-sound, and the dark-mode toggle on top.

## Adding a post

1. Create `content/<section>/<slug>.md` (section is one of `tech-blogs`,
   `code`, `book-review`) with frontmatter:

   ```markdown
   ---
   title: My Post Title
   date: 2026-07-27
   excerpt: One or two sentences shown in the section list.
   ---

   Post body in markdown goes here.
   ```

2. Rebuild:

   ```bash
   npm install   # first time only
   npm run build
   ```

3. Commit both the source `.md` file and the generated HTML output, then
   push.

## Local preview

```bash
npm run build
python3 -m http.server
```

Then open `http://localhost:8000`.
