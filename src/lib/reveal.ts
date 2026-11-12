/**
 * Things marked `data-reveal` arrive as they enter the screen: the class
 * `is-in` is set once and kept. What arriving looks like is up to each
 * component's CSS — the index lets its pictures rise out of a mask, the case
 * study fades text up. Without scripts, or with reduced motion, nothing is
 * hidden in the first place (the CSS waits for html.js and motion).
 *
 * The observer watches each element's parent, not the element: a picture
 * waiting behind `clip-path: inset(100% …)` is entirely clipped, and Chromium
 * counts the element's own clip-path, so it would never be seen arriving.
 */
export function reveal() {
	const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
	if (!items.length) return () => {};
	const byWatcher = new Map<Element, HTMLElement[]>();
	items.forEach((el) => {
		const watcher = el.parentElement ?? el;
		byWatcher.set(watcher, [...(byWatcher.get(watcher) ?? []), el]);
	});
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				byWatcher.get(entry.target)?.forEach((el) => el.classList.add('is-in'));
				io.unobserve(entry.target);
			}
		},
		// A little before the bottom edge, so the motion is seen, not missed.
		{ rootMargin: '0px 0px -8% 0px' },
	);
	byWatcher.forEach((_, watcher) => io.observe(watcher));
	return () => io.disconnect();
}
