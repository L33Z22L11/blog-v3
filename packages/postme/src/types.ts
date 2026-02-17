import type { ReadTimeResults } from 'reading-time'

export interface Root {
	type: 'root'
	children: Child[]
}

export interface Element {
	type: 'element'
	tag: string
	props: Record<string, unknown>
	children: Child[]
}

export interface Text {
	type: 'text'
	value: string
}

export type Node = Root | Element | Text

export type Child = Element | Text

export interface ArticleCollection {
	[collection: string]: {
		[slug: string]: ArticleSchema
	}
}

export interface ArticleSlug {
	[slug: string]: {
		collection: string
		path: string
	}
}

export type ArticleType = 'tech' | 'story'

export interface ArticleSchema {
	title?: string
	description?: string
	date?: string
	updated?: string
	published?: string
	categories?: string[]
	tags?: string[]
	type?: ArticleType

	image?: string
	recommend?: number | true
	references?: { title?: string, link?: string }[]
	coverFilter?: string
	coverDim?: boolean
	hideInfo?: boolean

	/** TODO */
	draft?: boolean
	permalink?: string
	aside?: string[]

	readingTime?: ReadTimeResults
	slug: string
}

export interface Article {
	body: Root
	frontmatter: ArticleSchema
	slots?: Record<string, Element>
}
