import type { ReadTimeResults } from 'reading-time'

const _appConfig = useAppConfig()

export type ArticleOrderType = keyof typeof _appConfig.article.order

export default interface ArticleProps extends Partial<{
    _path: string
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
    cover_revert: boolean
    hideInfo: boolean
    recommend: number | boolean
    references: { title: string, link: string }[]
    readingTime: ReadTimeResults
}> { }
