document.addEventListener('DOMContentLoaded', () => {
    const interactiveSelector = [
        'a',
        'button',
        '.gallery-images',
        '.gallery-nav',
        '.gallery-dot'
    ].join(', ');

    function resolveImdbSearchUrl(item) {
        const explicitQuery = item.dataset.imdbQuery;
        const captionTitle = item.querySelector('.caption strong')?.textContent || '';
        const rawQuery = explicitQuery || captionTitle;
        const cleanQuery = rawQuery.replace(/\s*\([^)]*\)\s*/g, ' ').trim();

        if (!cleanQuery) {
            return '';
        }

        return `https://www.imdb.com/find/?q=${encodeURIComponent(cleanQuery)}`;
    }

    function resolveTargetUrl(item) {
        const explicitUrl = item.dataset.targetUrl || item.dataset.pageUrl || item.dataset.href;
        if (explicitUrl) {
            return explicitUrl;
        }

        return resolveImdbSearchUrl(item);
    }

    function navigateToItemTarget(item) {
        const targetUrl = resolveTargetUrl(item);
        if (!targetUrl) {
            return;
        }

        const openInNewTab = item.dataset.newTab === 'true' || targetUrl.includes('imdb.com');
        if (openInNewTab) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        window.location.href = targetUrl;
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        const targetUrl = resolveTargetUrl(item);
        if (!targetUrl) {
            return;
        }

        item.classList.add('is-clickable-item');
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'link');

        item.addEventListener('click', event => {
            if (event.target.closest(interactiveSelector)) {
                return;
            }

            navigateToItemTarget(item);
        });

        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigateToItemTarget(item);
            }
        });
    });
});