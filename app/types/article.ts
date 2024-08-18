export default interface ArticleProps {
    title: string
    description?: string
    link?: string
    date?: string
    updated?: string
    categories?: string[]
    tags?: string[]
    type?: 'tech' | 'story' | undefined
    cover?: string
    references?: { title: string, link: string }[]
}
