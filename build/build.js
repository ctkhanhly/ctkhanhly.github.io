'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { SECTIONS, renderHome, renderSectionList, renderPost } = require('./templates');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

function slugify(text) {
    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function estimateReadTime(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} Min Read`;
}

// Post-process marked's output to add stable ids to h1/h2/h3 (for the ToC
// sidebar and deep links), without depending on a specific marked renderer
// API version. Every heading in the post body becomes a ToC entry, indented
// by level, mirroring the post's actual outline.
function addHeadingIds(html) {
    const toc = [];
    const seen = new Map();
    const withIds = html.replace(/<h([123])>(.*?)<\/h\1>/gs, (match, level, inner) => {
        const text = inner.replace(/<[^>]+>/g, '').trim();
        let base = slugify(text) || `section-${toc.length + 1}`;
        const count = seen.get(base) || 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count}`;
        toc.push({ id, text, level: Number(level) });
        return `<h${level} id="${id}" data-toc-target="">${inner}</h${level}>`;
    });
    return { html: withIds, toc };
}

function loadPosts(section) {
    const dir = path.join(CONTENT_DIR, section.slug);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
            const raw = fs.readFileSync(path.join(dir, file), 'utf8');
            const { data, content } = matter(raw);
            const slug = data.slug || slugify(path.basename(file, '.md'));
            const { html, toc } = addHeadingIds(marked.parse(content));
            return {
                slug,
                title: data.title || slug,
                date: data.date || null,
                excerpt: data.excerpt || '',
                readTime: data.readTime || estimateReadTime(content),
                html,
                toc,
            };
        })
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function writeFile(relPath, contents) {
    const fullPath = path.join(ROOT, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, contents);
    console.log('wrote', relPath);
}

function clean(section) {
    const outDir = path.join(ROOT, section.slug);
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
}

function build() {
    writeFile('index.html', renderHome());

    let totalPosts = 0;
    SECTIONS.forEach((section) => {
        clean(section);
        const posts = loadPosts(section);
        totalPosts += posts.length;

        writeFile(path.join(section.slug, 'index.html'), renderSectionList(section, posts));

        posts.forEach((post) => {
            writeFile(
                path.join(section.slug, post.slug, 'index.html'),
                renderPost(section, post, post.html, post.toc)
            );
        });
    });

    console.log(`\nBuilt home + ${SECTIONS.length} sections + ${totalPosts} post(s).`);
}

build();
