import type { ReadTimeResults } from 'reading-time'

const _appConfig = useAppConfig()

export type ArticleCategory = keyof typeof _appConfig.article.categories & string
export type ArticleOrderType = 'date' | 'updated'

export default interface ArticleProps extends Partial<{
    path: string
    readingTime: ReadTimeResults

    title: string
    description: string
    link: string
    date: string
    updated: string
    categories: string[]
    tags: string[]
    type: 'tech' | 'story'
    image: string
    cover_revert: boolean
    hideInfo: boolean
    recommend: number
    references: { title: string, link: string }[]
}> { }
