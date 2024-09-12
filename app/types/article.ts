import type { ParsedContent } from '@nuxt/content'
import type { ReadTimeResults } from 'reading-time'

const _appConfig = useAppConfig()

export type ArticleCategory = keyof typeof _appConfig.article.categories & string

export interface CustomArticleProps {
    title: string
    description: string
    link: string
    date: string
    updated: string
    categories: [ArticleCategory, ...string[]]
    tags: string[]
    type: 'tech' | 'story'
    cover: string
    cover_revert: boolean
    recommend: number | boolean
    references: { title: string, link: string }[]
    readingTime: ReadTimeResults
}

export default interface ArticleProps extends Partial<CustomArticleProps>, Partial<ParsedContent> {}
