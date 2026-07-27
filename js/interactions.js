/* Progressive enhancement shared by every generated page: dark-mode toggle,
   command-palette / list keyboard navigation, and the reading ToC highlighter.
   Loaded at the end of <body>, so the DOM is already parsed — no need to wait
   for DOMContentLoaded. */
(function () {
    function updateThemeIcon(btn) {
        var isDark = document.documentElement.classList.contains('dark');
        btn.textContent = isDark ? 'light_mode' : 'dark_mode';
    }

    function initThemeToggle() {
        var buttons = document.querySelectorAll('[data-theme-toggle]');
        buttons.forEach(updateThemeIcon);
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                buttons.forEach(updateThemeIcon);
            });
        });
    }

    function initKeyNav() {
        var containers = document.querySelectorAll('[data-keynav]');
        if (!containers.length) return;

        containers.forEach(function (container) {
            var searchInput = container.querySelector('[data-palette-search]');
            var activeIndex = 0;

            function visibleRows() {
                return Array.prototype.slice
                    .call(container.querySelectorAll('.palette-row'))
                    .filter(function (row) {
                        return row.style.display !== 'none';
                    });
            }

            function setActive(index, opts) {
                var rows = visibleRows();
                if (!rows.length) return;
                activeIndex = ((index % rows.length) + rows.length) % rows.length;
                rows.forEach(function (row, i) {
                    row.dataset.active = String(i === activeIndex);
                });
                if (opts && opts.sound && window.Sound) window.Sound.playMove();
            }

            function confirmActive() {
                var rows = visibleRows();
                var row = rows[activeIndex];
                if (!row) return;
                if (window.Sound) window.Sound.playConfirm();
                var href = row.getAttribute('href');
                if (href) setTimeout(function () { window.location.href = href; }, 70);
            }

            visibleRows().forEach(function (row, i) {
                row.addEventListener('mouseenter', function () { setActive(i); });
                row.addEventListener('click', function () {
                    if (window.Sound) window.Sound.playConfirm();
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    var query = searchInput.value.trim().toLowerCase();
                    container.querySelectorAll('.palette-row').forEach(function (row) {
                        var haystack = (row.dataset.search || row.textContent || '').toLowerCase();
                        row.style.display = haystack.indexOf(query) === -1 ? 'none' : '';
                    });
                    setActive(0);
                });
            }

            setActive(0);
            container.__setActive = setActive;
            container.__confirmActive = confirmActive;
            container.__activeIndex = function () { return activeIndex; };
        });

        document.addEventListener('keydown', function (event) {
            var container = document.querySelector('[data-keynav]');
            if (!container) return;

            var withinContainer = container.contains(event.target);
            var noSpecificFocus = event.target === document.body;
            if (!withinContainer && !noSpecificFocus) return;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                container.__setActive(container.__activeIndex() + 1, { sound: true });
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                container.__setActive(container.__activeIndex() - 1, { sound: true });
            } else if (event.key === 'Enter' || event.key === 'ArrowRight') {
                event.preventDefault();
                container.__confirmActive();
            }
        });
    }

    // Must mirror the exact class lists used for toc-link active/inactive
    // state in build/templates.js `renderPost`.
    var TOC_ACTIVE_CLASSES = ['border-secondary', 'dark:border-secondary-fixed-dim', 'text-primary', 'dark:text-text-dark', 'font-medium'];
    var TOC_INACTIVE_CLASSES = ['border-transparent', 'text-on-surface-variant/60', 'dark:text-on-tertiary-container/60', 'hover:text-primary', 'dark:hover:text-text-dark'];

    function initToc() {
        var sections = document.querySelectorAll('[data-toc-target]');
        var navLinks = document.querySelectorAll('[data-toc-link]');
        if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    var isActive = link.getAttribute('href') === '#' + id;
                    link.classList.remove.apply(link.classList, isActive ? TOC_INACTIVE_CLASSES : TOC_ACTIVE_CLASSES);
                    link.classList.add.apply(link.classList, isActive ? TOC_ACTIVE_CLASSES : TOC_INACTIVE_CLASSES);
                });
            });
        }, { rootMargin: '0px 0px -60% 0px', threshold: 0.1 });

        sections.forEach(function (sec) { observer.observe(sec); });
    }

    function initSideNavCollapse() {
        var nav = document.querySelector('[data-side-nav]');
        if (!nav) return;
        var toggle = nav.querySelector('[data-side-nav-toggle]');
        var stored = localStorage.getItem('navCollapsed');
        var collapsed = stored === null ? true : stored === 'true';

        function apply() {
            nav.dataset.collapsed = String(collapsed);
            var icon = toggle && toggle.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = collapsed ? 'menu' : 'menu_open';
        }

        apply();
        if (toggle) {
            toggle.addEventListener('click', function () {
                collapsed = !collapsed;
                localStorage.setItem('navCollapsed', String(collapsed));
                apply();
            });
        }
    }

    initThemeToggle();
    initKeyNav();
    initToc();
    initSideNavCollapse();
    document.querySelectorAll('[data-mute-toggle]').forEach(function (btn) {
        if (window.Sound) window.Sound.initMuteButton(btn);
    });
})();
