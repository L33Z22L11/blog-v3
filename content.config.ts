import { defineCollection, z } from '@nuxt/content'
import blogConfig from './blog.config'

export const collections = {
	content: defineCollection({
		source: '**',
		type: 'page',
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.string().optional(),
			updated: z.string().optional(),
			categories: z.array(z.string()).default(blogConfig.defaultCategory),
			tags: z.array(z.string()),
			type: z.enum(['tech', 'story']).optional(),

			image: z.string().optional(),
			recommend: z.number().optional(),
			references: z.array(z.object({
				title: z.string().optional(),
				link: z.string().optional(),
			})).optional(),
			draft: z.boolean().default(false),

			readingTime: z.object({
				text: z.string(),
				minutes: z.number(),
				time: z.number(),
				words: z.number(),
			}).optional(),
		}),
	}),
}
