/**
 * The site's map: what the navigation lists and what each kind of work is
 * called. Copy is Dilar's own, from the "Rooms" of the first home page in the
 * Figma file — the page itself was set aside, its words were not.
 */

export const SITE = {
	name: 'outernet',
	author: 'Dilar',
	city: 'istanbul',
	email: 'dilaraabilek@gmail.com',
	description:
		'Outernet — the work of Dilar, a designer and artist in Istanbul investigating belonging, space, thresholds and boundaries.',
} as const;

export const CATEGORIES = {
	branding: { caption: 'branding', title: 'Branding', intro: 'Identities for people and small businesses.' },
	paintings: { caption: 'paintings', title: 'Paintings', intro: 'Works on canvas and paper.' },
	writings: { caption: 'writings', title: 'Writings', intro: 'Essays, notes and texts in progress.' },
	flowers: { caption: 'flower archive', title: 'Flower archive', intro: 'A flower, where I saw it, and a note.' },
	listening: { caption: 'listening', title: 'Listening', intro: 'Field recordings to press play on.' },
	audiovisual: { caption: 'audiovisual', title: 'Audiovisual', intro: 'Moving image and sound works.' },
	notes: { caption: 'notes', title: 'Notes', intro: 'Leave a note on the notepad.' },
} as const;

export type Category = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [Category, ...Category[]];

/** The navigation, in the order of the Figma top bar. */
export const NAV: { label: string; href: string; category?: Category }[] = [
	{ label: 'work', href: '/' },
	{ label: 'paintings', href: '/paintings', category: 'paintings' },
	{ label: 'writings', href: '/writings', category: 'writings' },
	{ label: 'flowers', href: '/flowers', category: 'flowers' },
	{ label: 'listening', href: '/listening', category: 'listening' },
	{ label: 'audiovisual', href: '/audiovisual', category: 'audiovisual' },
	{ label: 'notes', href: '/notes', category: 'notes' },
	{ label: 'info', href: '/info' },
];

/** `/info/` and `/info` are the same page; compare without the slash. */
export const samePath = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '') || (a === '/' && b === '');
