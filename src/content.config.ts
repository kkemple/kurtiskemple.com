import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const homepageSectionSchema = z.enum([
	"applied-ai-agentic-systems",
	"market-research-competitive-intelligence",
	"developer-enablement-platform-strategy",
	"clarity-power-agency",
]);

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.string().transform((str) => new Date(str)),
		image: z.string().optional(),
		featured: z.boolean().optional(),
		hide: z.boolean().optional(),
		homepage: z
			.object({
				section: homepageSectionSchema,
				order: z.number().int().positive(),
			})
			.optional(),
	}),
});

export const collections = { blog };
