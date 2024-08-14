export default interface ArticleProps {
    title: string
    description?: string
    link?: string
    date?: string
    updated?: string
    category?: string[]
    tags?: string[]
    type?: 'tech' | 'story' | undefined
    cover?: string
    references?: { title: string, link: string }[]
}
