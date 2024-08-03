export default interface ArticleProps {
    [key: string]: any
    title: string
    description?: string
    link?: string
    date?: string
    updated?: string
    category?: string[]
    tags?: string[]
    cover?: string
    banner?: string
}
