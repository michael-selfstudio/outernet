/**
 * The few things the pages do once they are in the browser. Everything is
 * wired on `astro:page-load`, which fires on the first load and after every
 * client-side navigation, and torn down on `astro:before-swap`.
 */
import { reveal } from './reveal';

let teardown: (() => void)[] = [];

export function start() {
	document.addEventListener('astro:after-swap', () => {
		// The swap replaces <html>'s attributes with the new page's; restore
		// the flag the inline script set on the first load.
		document.documentElement.classList.add('js');
	});

	document.addEventListener('astro:page-load', () => {
		teardown.forEach((fn) => fn());
		teardown = [markLoaded(), playClips(), reveal()];
	});
}

/** Let each picture fade in over its blurred copy once it has decoded. */
function markLoaded() {
	const images = document.querySelectorAll<HTMLImageElement>('.media img');
	images.forEach((img) => {
		const done = () => img.setAttribute('data-loaded', '');
		if (img.complete && img.naturalWidth) done();
		else {
			img.addEventListener('load', done, { once: true });
			// A broken image should still show its blur, not stay invisible.
			img.addEventListener('error', done, { once: true });
		}
	});
	return () => {};
}

/**
 * Clips play only while on screen and only once they can play through;
 * until then the still stays. Nothing plays for people who asked the system
 * for less motion.
 */
function playClips() {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
	const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
	if (!videos.length) return () => {};
	const io = new IntersectionObserver(
		(entries) => {
			for (const { target, isIntersecting } of entries) {
				const video = target as HTMLVideoElement;
				if (isIntersecting) {
					video.preload = 'auto';
					video.play().then(
						() => video.setAttribute('data-playing', ''),
						() => undefined,
					);
				} else video.pause();
			}
		},
		{ rootMargin: '25% 0px' },
	);
	videos.forEach((v) => io.observe(v));
	return () => io.disconnect();
}
