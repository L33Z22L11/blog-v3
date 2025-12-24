import type { ReadTimeResults } from 'reading-time'
import type { MetaSlotsTree } from 'rehype-meta-slots'

// TODO 使用content类型，干掉这个文件
const _appConfig = useAppConfig()

export type ArticleOrderType = keyof typeof _appConfig.article.order

export default interface ArticleProps extends Partial<{
	path: string
	readingTime: ReadTimeResults

	title: string
	description: string
	link: string
	date: string
	updated: string
	published: string
	categories: string[]
	tags: string[]
	type: 'tech' | 'story'
	image: string
	recommend: number
	references: { title?: string, link?: string }[]

	meta: {
		coverRevert?: boolean
		hideInfo?: boolean
		slots?: Record<string, MetaSlotsTree>
	}
}> { }
