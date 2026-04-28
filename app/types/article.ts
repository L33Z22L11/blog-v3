import type { AppConfig } from 'nuxt/schema'
import type { ArticleSchema } from '~~/content.config'
import type { MetaSlotsTree } from '~~/remark-plugins/rehype-meta-slots'

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
