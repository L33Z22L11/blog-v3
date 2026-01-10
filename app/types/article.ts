import type { AppConfig } from 'nuxt/schema'
import type { MetaSlotsTree } from 'rehype-meta-slots'
import type { ArticleSchema } from '~~/content.config'

export type ArticleOrderType = keyof AppConfig['article']['order']

export interface ArticleProps extends ArticleSchema {
	path: string

	meta?: {
		coverDim?: boolean
		coverFilter?: string
		hideInfo?: boolean
		slots?: Record<string, MetaSlotsTree>
	}
}
