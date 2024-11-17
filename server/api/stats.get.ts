import { serverQueryContent } from '#content/server'

interface StatsEntry {
    posts: number
    words: number
}

export default defineEventHandler(async (event) => {
    const stats = {
        total: { posts: 0, words: 0 },
        annual: <StatsEntry[]>{},
    }

    const posts = await serverQueryContent(event).find()

    for (const post of posts) {
        stats.total.posts++
        stats.total.words += post.readingTime.words

        if (!post.date)
            continue
        const year = new Date(post.date).getFullYear()
        if (!stats.annual[year])
            stats.annual[year] = { posts: 0, words: 0 }

        stats.annual[year].posts++
        stats.annual[year].words += post.readingTime.words
    }

    return stats
})
