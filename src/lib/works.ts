import { getCollection } from 'astro:content';
import type { Category } from './site';

/** Published works in index order (by number), optionally of one kind. */
export async function getWorks(category?: Category) {
	const works = await getCollection('works', ({ data }) => !data.draft && (!category || data.category === category));
	return works.sort((a, b) => a.data.number.localeCompare(b.data.number));
}
