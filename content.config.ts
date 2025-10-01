import { defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import blogConfig from './blog.config'

const articleSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	date: z.string().optional(),
	updated: z.string().optional(),
	categories: z.array(z.string()).default([blogConfig.defaultCategory]),
	tags: z.array(z.string()).default([]),
	type: z.enum(['tech', 'story']).optional(),

	image: z.string().optional(),
	recommend: z.number().optional(),
	references: z.array(z.object({
		title: z.string().optional(),
		link: z.string().optional(),
	})).optional(),
	draft: z.boolean().default(false),
	permalink: z.string().optional(),

	readingTime: z.object({
		text: z.string(),
		minutes: z.number(),
		time: z.number(),
		words: z.number(),
	}),
})

export const collections = {
	content: defineCollection(asSitemapCollection({
		source: '**',
		type: 'page',
		schema: articleSchema,
	})),
}
