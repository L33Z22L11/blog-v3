export default interface ArticleProps {
    [key: string]: any
    title: string
    description?: string
    link?: string
    date?: string
    updated?: string
    category?: string[]
    tags?: string[]
    type?: 'tech' | 'story' | undefined
    cover?: string
    banner?: string
}
