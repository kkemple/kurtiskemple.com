// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

const homepageSectionSchema = z.enum([
	"applied-ai-agentic-systems",
	"market-research-competitive-intelligence",
	"developer-enablement-platform-strategy",
	"clarity-power-agency",
]);
// 2. Define your collection(s)
const blogCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.string(),
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

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	blog: blogCollection,
};
