const _appConfig = useAppConfig()

export type ArticleCategory = keyof typeof _appConfig.article.categories & string

export default interface ArticleProps {
    title: string
    description?: string
    link?: string
    date?: string
    updated?: string
    categories?: [ArticleCategory, ...string[]]
    tags?: string[]
    type?: 'tech' | 'story' | undefined
    cover?: string
    cover_revert?: boolean
    references?: ({ title: string, link: string } & string)[]
}
