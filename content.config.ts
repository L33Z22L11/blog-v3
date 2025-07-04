import { defineCollection, z } from '@nuxt/content'

export const collections = {
    content: defineCollection({
        source: '**',
        type: 'page',
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            date: z.string().optional(),
            updated: z.string().optional(),
            categories: z.array(z.string()),
            tags: z.array(z.string()),
            type: z.enum(['tech', 'story']).optional(),
            image: z.string().optional(),
            recommend: z.number().optional(),
            readingTime: z.any().optional(),
        }),
    }),
}
