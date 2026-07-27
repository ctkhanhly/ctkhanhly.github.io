'use strict';

const LOGO_URL = 'https://d10weyj3t86y7.cloudfront.net/assets/images/logo.jpg';
const VIDEO_URL = 'https://d10weyj3t86y7.cloudfront.net/assets/videos/viet_coffee.mp4';

const SECTIONS = [
    { slug: 'tech-blogs', label: 'Tech Blogs', description: '', icon: 'hub' },
    { slug: 'code', label: 'Code', description: '', icon: 'code' },
    { slug: 'book-review', label: 'Book Review', description: '', icon: 'menu_book' },
];

// Identical across all three docs/designs/*.html mockups.
const TAILWIND_CONFIG = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'surface-container': '#edeef0',
                'on-secondary-container': '#003666',
                'on-error-container': '#93000a',
                'border-subtle': '#E5E5E7',
                'secondary-container': '#51a0ff',
                'surface-container-low': '#f3f3f5',
                'primary-fixed': '#e4e2e4',
                'on-secondary-fixed': '#001c3a',
                'on-background': '#1a1c1d',
                secondary: '#005fae',
                'tertiary-container': '#211c1b',
                'tertiary-fixed-dim': '#cec4c2',
                surface: '#f9f9fb',
                'secondary-fixed-dim': '#a5c8ff',
                'surface-dim': '#d9dadc',
                'surface-tint': '#5f5e60',
                'tertiary-fixed': '#ebe0de',
                'error-container': '#ffdad6',
                'secondary-fixed': '#d4e3ff',
                'surface-container-high': '#e8e8ea',
                'on-surface-variant': '#46464a',
                'on-surface': '#1a1c1d',
                'on-error': '#ffffff',
                'on-secondary': '#ffffff',
                'text-dark': '#F2F2F2',
                'inverse-surface': '#2f3132',
                tertiary: '#040302',
                'on-tertiary-container': '#8c8382',
                'background-dark': '#0A0A0A',
                'on-primary-container': '#868587',
                'border-dark': '#262626',
                'on-secondary-fixed-variant': '#004785',
                background: '#f9f9fb',
                'surface-bright': '#f9f9fb',
                'surface-container-lowest': '#ffffff',
                error: '#ba1a1a',
                'inverse-primary': '#c8c6c8',
                'outline-variant': '#c7c6ca',
                'on-primary-fixed-variant': '#474649',
                'on-primary': '#ffffff',
                'inverse-on-surface': '#f0f0f2',
                'on-primary-fixed': '#1b1b1d',
                'primary-container': '#1d1d1f',
                primary: '#030304',
                'surface-variant': '#e2e2e4',
                'surface-container-highest': '#e2e2e4',
                'primary-fixed-dim': '#c8c6c8',
                'on-tertiary-fixed': '#1f1a19',
                outline: '#77767b',
                'on-tertiary-fixed-variant': '#4c4544',
                'on-tertiary': '#ffffff',
            },
            borderRadius: { DEFAULT: '0.125rem', lg: '0.25rem', xl: '0.5rem', full: '0.75rem' },
            spacing: {
                'stack-lg': '48px',
                'container-max': '1120px',
                'stack-md': '16px',
                'margin-mobile': '20px',
                'sidebar-width': '260px',
                gutter: '32px',
                'stack-sm': '8px',
            },
            fontFamily: {
                'headline-md': ['Hanken Grotesk'],
                'headline-lg': ['Hanken Grotesk'],
                'headline-xl': ['Hanken Grotesk'],
                'body-lg': ['Inter'],
                'body-md': ['Inter'],
                'label-mono': ['JetBrains Mono'],
                'headline-xl-mobile': ['Hanken Grotesk'],
                serif: ['Playfair Display', 'serif'],
            },
            fontSize: {
                'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
                'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
                'headline-xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
                'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
                'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'label-mono': ['13px', { lineHeight: '1.0', letterSpacing: '0.05em', fontWeight: '500' }],
                'headline-xl-mobile': ['36px', { lineHeight: '1.1', fontWeight: '700' }],
            },
        },
    },
};

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Applied before paint so the stored theme choice never flashes the wrong color scheme.
const NO_FLASH_THEME_SCRIPT = `
    (function () {
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    })();
`;

function head({ title, description }) {
    return `<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description || '')}">
<link rel="icon" href="${LOGO_URL}">
<script>${NO_FLASH_THEME_SCRIPT}</script>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>tailwind.config = ${JSON.stringify(TAILWIND_CONFIG)};</script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<link href="/css/styles.css" rel="stylesheet">
</head>`;
}

// Note: "background" in the color config above is the LIGHT page background
// (#f9f9fb). The dark equivalent is the separate "background-dark" token
// (#0A0A0A) — always pair dark: with -dark suffixed tokens, never bare
// "background"/"surface", or dark mode silently no-ops.
function header() {
    return `<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-subtle dark:border-border-dark flex justify-between items-center px-margin-mobile md:px-stack-lg h-16 max-w-container-max mx-auto left-0 right-0">
<a href="/" class="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform hover:opacity-70 transition-opacity">
<div class="w-[32px] h-[32px] overflow-hidden rounded-full border border-border-subtle dark:border-border-dark shrink-0">
<img src="${LOGO_URL}" alt="Ly Cao" class="w-full h-full object-cover">
</div>
<span class="font-label-mono text-label-mono uppercase tracking-widest text-primary dark:text-text-dark font-bold">Ly Cao</span>
</a>
<span class="material-symbols-outlined text-on-surface-variant dark:text-on-tertiary-container hover:opacity-70 transition-opacity cursor-pointer active:scale-95 transition-transform" data-theme-toggle="">dark_mode</span>
</header>`;
}

function footer() {
    return `<footer class="w-full border-t border-border-subtle dark:border-border-dark mt-stack-lg">
<div class="max-w-container-max mx-auto py-stack-md px-margin-mobile flex flex-col md:flex-row justify-between items-center opacity-60">
<span class="font-label-mono text-label-mono uppercase text-on-surface-variant dark:text-on-tertiary-container mb-4 md:mb-0">&copy; ${new Date().getFullYear()} Ly Cao</span>
<div class="flex gap-6">
<a class="font-label-mono text-label-mono uppercase text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-text-dark transition-colors" href="https://github.com/ctkhanhly/ctkhanhly.github.io">Source</a>
<a class="font-label-mono text-label-mono uppercase text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-text-dark transition-colors" href="mailto:ctkhanhly@gmail.com">Contact</a>
</div>
</div>
</footer>`;
}

function scripts() {
    return `<script src="/js/sound.js"></script>
<script src="/js/interactions.js"></script>`;
}

function page({ title, description, bodyClass, mainHtml }) {
    return `<!DOCTYPE html>
<html lang="en">
${head({ title, description })}
<body class="bg-surface dark:bg-background-dark text-on-surface dark:text-text-dark min-h-screen flex flex-col antialiased ${bodyClass || ''}">
${header()}
${mainHtml}
${footer()}
${scripts()}
</body>
</html>
`;
}

function renderHome() {
    const rowsHtml = SECTIONS.map((section, i) => `<a class="group palette-row px-6 py-3 flex items-center justify-between hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors duration-150 border-l-2 border-transparent" href="/${section.slug}/" data-search="${escapeHtml([section.label, section.description].filter(Boolean).join(' '))}" data-index="${i}">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant dark:text-on-tertiary-container row-icon" data-icon="${section.icon}">${section.icon}</span>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface dark:text-text-dark font-medium">${escapeHtml(section.label)}</span>
${section.description ? `<span class="font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container opacity-70">${escapeHtml(section.description)}</span>` : ''}
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant/50 dark:text-on-tertiary-container/50 opacity-0 group-hover:opacity-100 transition-opacity" data-icon="arrow_forward">arrow_forward</span>
</a>`).join('\n');

    const mainHtml = `<main class="flex-grow flex items-center justify-center pt-24 pb-24 px-margin-mobile">
<div class="w-full max-w-3xl bg-surface-container-lowest dark:bg-tertiary-container border border-border-subtle dark:border-border-dark rounded-xl ambient-shadow overflow-hidden flex flex-col" data-keynav="">
<video class="palette-video" src="${VIDEO_URL}" autoplay muted loop playsinline></video>
<div class="flex items-center px-6 py-4 border-b border-border-subtle dark:border-border-dark">
<span class="material-symbols-outlined text-on-surface-variant dark:text-on-tertiary-container mr-3" data-icon="search">search</span>
<input autofocus class="flex-grow bg-transparent border-none outline-none font-body-lg text-body-lg text-on-surface dark:text-text-dark placeholder:text-on-surface-variant/50 dark:placeholder:text-on-tertiary-container/50 focus:ring-0 p-0" placeholder="Search sections..." type="text" data-palette-search="">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined mute-toggle cursor-pointer" data-mute-toggle="" role="button" aria-label="Toggle sound" tabindex="0">volume_up</span>
<div class="hidden md:flex items-center gap-2">
<kbd class="font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container bg-surface-container-low dark:bg-white/5 px-2 py-1 rounded border border-border-subtle dark:border-border-dark">&uarr;&darr;</kbd>
<kbd class="font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container bg-surface-container-low dark:bg-white/5 px-2 py-1 rounded border border-border-subtle dark:border-border-dark">&crarr;</kbd>
</div>
</div>
</div>
<div class="px-6 py-2 bg-surface-container-low/50 dark:bg-white/5 border-b border-border-subtle dark:border-border-dark flex justify-between items-center">
<span class="font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container">Use &uarr; &darr; to move, &crarr; or &rarr; to select</span>
<span class="font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container">${SECTIONS.length} Sections</span>
</div>
<div class="flex flex-col py-2 max-h-[60vh] overflow-y-auto">
${rowsHtml}
</div>
<div class="bg-surface-container-low dark:bg-white/5 border-t border-border-subtle dark:border-border-dark p-3 flex justify-between items-center text-on-surface-variant dark:text-on-tertiary-container">
<span class="font-label-mono text-label-mono">Use arrows to navigate</span>
<span class="font-label-mono text-label-mono">Enter to select</span>
</div>
</div>
</main>`;

    return page({
        title: 'Ly Cao',
        description: 'Personal site — tech blogs, code notes, and book reviews.',
        mainHtml,
    });
}

function renderSectionList(section, posts) {
    const sidebarLinks = [{ slug: '', label: 'Command', icon: 'keyboard_command_key', href: '/' }].concat(
        SECTIONS.map((s) => ({ slug: s.slug, label: s.label, icon: s.icon, href: `/${s.slug}/` }))
    );
    const sidebarHtml = sidebarLinks
        .map((link) => {
            const isActive = link.slug === section.slug;
            const stateClasses = isActive
                ? 'bg-surface-container-low dark:bg-white/5 text-primary dark:text-text-dark'
                : 'text-on-surface-variant/70 dark:text-on-tertiary-container/70';
            return `<a class="side-nav-link flex items-center gap-3 py-2 px-2 rounded-DEFAULT hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors duration-200 ${stateClasses}" href="${link.href}" title="${escapeHtml(link.label)}">
<span class="material-symbols-outlined text-[20px] shrink-0">${link.icon}</span>
<span class="side-nav-label whitespace-nowrap ${isActive ? 'font-medium' : ''}">${escapeHtml(link.label)}</span>
</a>`;
        })
        .join('\n');

    const postsHtml = posts.length
        ? `<div class="absolute left-0 top-0 bottom-0 w-[1px] bg-border-subtle dark:bg-border-dark ml-[6px] md:ml-[11px] z-0"></div>
${posts
    .map((post, i) => `<a class="palette-row group relative block pl-8 md:pl-12 py-6 border-l-2 border-transparent border-b border-border-subtle/50 dark:border-border-dark/50 z-10 cursor-pointer stream-item" href="/${section.slug}/${post.slug}/" data-search="${escapeHtml(post.title + ' ' + (post.excerpt || ''))}" data-index="${i}">
<div class="absolute left-0 top-8 w-3 h-3 md:w-4 md:h-4 bg-surface dark:bg-background-dark border-2 border-border-subtle dark:border-border-dark rounded-full group-hover:border-primary dark:group-hover:border-secondary-fixed-dim transition-colors ml-0.5 md:ml-1"></div>
<div class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
<time class="font-label-mono text-label-mono text-on-surface-variant/70 dark:text-on-tertiary-container/70 shrink-0 uppercase tracking-wider">${formatDate(post.date)}</time>
</div>
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary dark:text-text-dark font-serif mb-3 group-hover:text-secondary dark:group-hover:text-secondary-fixed-dim transition-colors">${escapeHtml(post.title)}</h2>
${post.excerpt ? `<p class="font-body-md text-body-md text-on-surface-variant dark:text-on-tertiary-container line-clamp-2 md:line-clamp-3 mb-4 max-w-prose">${escapeHtml(post.excerpt)}</p>` : ''}
<div class="flex items-center gap-1 text-on-surface-variant dark:text-on-tertiary-container group-hover:text-primary dark:group-hover:text-text-dark transition-colors">
<span class="font-label-mono text-label-mono uppercase text-[11px]">Read</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</div>
</a>`)
    .join('\n')}`
        : `<div class="flex flex-col items-center justify-center py-24 text-center text-on-surface-variant dark:text-on-tertiary-container">
<span class="material-symbols-outlined text-[40px] opacity-40 mb-4">${section.icon}</span>
<p class="font-body-md text-body-md">No posts yet — check back soon.</p>
</div>`;

    const mainHtml = `<div class="flex flex-1 w-full max-w-[1200px] mx-auto relative pt-24">
<aside class="side-nav flex flex-col shrink-0 py-6 px-3 border-r border-border-subtle dark:border-border-dark sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto" data-side-nav="" data-collapsed="true">
<button class="mb-6 flex items-center justify-center w-8 h-8 shrink-0 rounded-DEFAULT text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors" data-side-nav-toggle="" aria-label="Toggle navigation" type="button">
<span class="material-symbols-outlined text-[20px]">menu</span>
</button>
<nav class="flex flex-col gap-1">
${sidebarHtml}
</nav>
</aside>
<main class="flex-1 min-w-0 w-full px-margin-mobile md:px-stack-lg py-stack-lg flex flex-col items-center">
<div class="w-full max-w-container-max flex flex-col" data-keynav="">
<header class="mb-stack-lg">
<h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary dark:text-text-dark font-serif italic">${escapeHtml(section.label)}</h1>
${section.description ? `<p class="font-body-lg text-body-lg text-on-surface-variant dark:text-on-tertiary-container max-w-2xl leading-relaxed mt-4">${escapeHtml(section.description)}</p>` : ''}
</header>
<div class="flex flex-col w-full relative">
${postsHtml}
</div>
</div>
</main>
</div>`;

    return page({
        title: `${section.label} | Ly Cao`,
        description: section.description || `${section.label} — Ly Cao`,
        mainHtml,
    });
}

function renderPost(section, post, contentHtml, toc) {
    const tocHtml = toc.length
        ? toc
              .map((item, i) => {
                  const isActive = i === 0;
                  const indentClass = item.level >= 3 ? 'pl-8' : 'pl-4';
                  const activeClasses = 'border-secondary dark:border-secondary-fixed-dim text-primary dark:text-text-dark font-medium';
                  const inactiveClasses = 'border-transparent text-on-surface-variant/60 dark:text-on-tertiary-container/60 hover:text-primary dark:hover:text-text-dark';
                  return `<a class="toc-link ${indentClass} -ml-[1px] border-l-2 transition-colors ${isActive ? activeClasses : inactiveClasses}" href="#${item.id}" data-toc-link="">${escapeHtml(item.text)}</a>`;
              })
              .join('\n')
        : '';

    const mainHtml = `<div class="flex max-w-container-max mx-auto pt-24 pb-stack-lg px-margin-mobile md:px-stack-lg min-h-screen">
${toc.length ? `<aside class="hidden lg:block w-sidebar-width shrink-0 pr-gutter sticky top-32 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
<div class="font-label-mono text-label-mono uppercase text-on-surface-variant dark:text-on-tertiary-container mb-6 tracking-widest">Index</div>
<nav class="flex flex-col gap-4 font-body-md text-body-md border-l border-border-subtle dark:border-border-dark">
${tocHtml}
</nav>
</aside>` : ''}
<main class="w-full max-w-[720px] mx-auto pb-stack-lg lg:mx-0 lg:pl-gutter xl:pl-stack-lg">
<a href="/${section.slug}/" class="font-label-mono text-label-mono uppercase text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-text-dark transition-colors inline-flex items-center gap-1 mb-6">
<span class="material-symbols-outlined text-[16px]">arrow_back</span> ${escapeHtml(section.label)}
</a>
<header class="mb-stack-lg">
<h1 class="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-primary dark:text-text-dark mb-stack-md">${escapeHtml(post.title)}</h1>
<div class="flex items-center gap-4 font-label-mono text-label-mono text-on-surface-variant dark:text-on-tertiary-container uppercase border-b border-border-subtle dark:border-border-dark pb-6">
<time datetime="${escapeHtml(String(post.date))}">${formatDate(post.date)}</time>
${post.readTime ? `<span>|</span><span>${escapeHtml(post.readTime)}</span>` : ''}
</div>
</header>
<article class="prose font-body-lg text-body-lg text-on-surface dark:text-text-dark">
${contentHtml}
</article>
</main>
</div>`;

    return page({
        title: `${post.title} | Ly Cao`,
        description: post.excerpt || section.description || `${post.title} — Ly Cao`,
        mainHtml,
    });
}

module.exports = { SECTIONS, renderHome, renderSectionList, renderPost, formatDate };
