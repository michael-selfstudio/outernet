import sharp from 'sharp';
import type { ImageMetadata } from 'astro';

/**
 * A blurred 24px copy of an image, inlined as a data URI, painted under the
 * real picture while it travels. The picture then surfaces out of its own
 * colours instead of out of an empty box — the Kultura canvas placeholders,
 * done at build time per image instead of by a script.
 *
 * Blurred here rather than with a CSS filter: a stretched 24px image shows
 * its pixels, and a filter on every tile would cost frames while scrolling.
 */
const cache = new Map<string, Promise<string>>();

export function placeholder(image: ImageMetadata): Promise<string | undefined> {
	// Astro attaches the source path to imported images (non-enumerable).
	const fsPath = (image as ImageMetadata & { fsPath?: string }).fsPath;
	if (!fsPath) return Promise.resolve(undefined);
	let pending = cache.get(fsPath);
	if (!pending) {
		pending = sharp(fsPath)
			.resize({ width: 24 })
			.blur(1.2)
			.webp({ quality: 55 })
			.toBuffer()
			.then((buffer) => `data:image/webp;base64,${buffer.toString('base64')}`);
		cache.set(fsPath, pending);
	}
	return pending;
}
