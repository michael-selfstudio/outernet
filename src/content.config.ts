import { defineCollection, reference, type ImageFunction } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from '@/lib/site';

/**
 * Three kinds of content, each a plain YAML file a person can edit on
 * GitHub without touching code:
 *
 *   works/      one file per entry of the home index
 *   projects/   one folder per case study, images beside the YAML
 *   info.yaml   the CV on the info page
 */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'a colour like #9E4624');

/** Sizes are in pixels of the 1440-wide design; the site scales them. */
const works = defineCollection({
	loader: glob({ pattern: '*.yaml', base: './src/content/works' }),
	schema: ({ image }) =>
		z.object({
			number: z.string().regex(/^\d{3}$/),
			category: z.enum(CATEGORY_KEYS),
			title: z.string(),
			/** A case study this entry opens. Without one the entry is a quiet tile. */
			project: reference('projects').optional(),
			cover: image().optional(),
			alt: z.string().default(''),
			/** Field colour shown while there is no cover, or while it loads. */
			tone: hex,
			width: z.number().int().min(200).max(1360),
			height: z.number().int().min(200),
			align: z.enum(['start', 'center', 'end']),
			draft: z.boolean().default(false),
		}),
});

const media = (image: ImageFunction) =>
	z.object({
		image: image(),
		alt: z.string(),
		/** A looping clip that plays over the still once it can (muted, inline). */
		video: z.string().optional(),
		label: z.string().optional(),
		/** A card colour behind an image set in a mat, e.g. a poster. */
		background: hex.optional(),
		/** Image size inside the mat, in design pixels of the card. */
		mat: z.object({ width: z.number(), height: z.number() }).optional(),
	});

const projects = defineCollection({
	loader: glob({ pattern: '*/index.yaml', base: './src/content/projects', generateId: ({ entry }) => entry.split('/')[0] }),
	schema: ({ image }) => {
		const m = media(image);
		return z.object({
			title: z.string(),
			kicker: z.string(),
			/** Name of an SVG in src/assets/svg drawn instead of the title text. */
			logotype: z.string().optional(),
			accent: hex,
			lede: z.string(),
			description: z.string(),
			meta: z.array(z.object({ label: z.string(), lines: z.array(z.string()) })),
			hero: m,
			overview: z.object({ label: z.string(), text: z.string() }),
			columns: z.array(z.object({ label: z.string(), text: z.string() })),
			sections: z.array(
				z.discriminatedUnion('type', [
					z.object({
						type: z.literal('identity'),
						title: z.string(),
						primary: m.extend({ stars: z.boolean().default(false) }),
						side: z.array(m).length(2),
					}),
					z.object({
						type: z.literal('colour'),
						title: z.string(),
						swatches: z.array(z.object({ name: z.string(), hex })),
					}),
					z.object({
						type: z.literal('typography'),
						title: z.string(),
						faces: z
							.array(
								z.object({
									role: z.string(),
									name: z.string(),
									/** An SVG in src/assets/svg, or a family registered in astro.config. */
									specimen: z.union([
										z.object({ svg: z.string() }),
										z.object({ font: z.string() }),
									]),
								}),
							)
							.length(2),
					}),
					z.object({
						type: z.literal('statement'),
						label: z.string(),
						paragraphs: z.array(z.string()),
					}),
					z.object({
						type: z.literal('applications'),
						title: z.string(),
						rows: z.array(
							z.discriminatedUnion('layout', [
								z.object({ layout: z.literal('full'), item: m }),
								z.object({ layout: z.literal('pair'), items: z.array(m).length(2) }),
								z.object({ layout: z.literal('line'), text: z.string() }),
							]),
						),
					}),
				]),
			),
			credits: z.array(
				z.object({
					label: z.string(),
					list: z.array(z.string()).optional(),
					text: z.string().optional(),
					links: z.array(z.object({ label: z.string(), href: z.url() })).optional(),
				}),
			),
		});
	},
});

const info = defineCollection({
	loader: file('src/content/info/info.yaml'),
	schema: ({ image }) =>
		z.object({
			portrait: image().optional(),
			alt: z.string().default(''),
			columns: z.array(
				z.array(
					z.object({
						title: z.string(),
						entries: z.array(
							z.object({
								name: z.string(),
								lines: z.array(z.string()),
								link: z.url().optional(),
							}),
						),
					}),
				),
			),
		}),
});

export const collections = { works, projects, info };
