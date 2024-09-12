import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
    let totalWords = 0

    const posts = await serverQueryContent(event).find()

    posts.forEach(async (post) => {
        totalWords += post.readingTime.words
    })

    return totalWords
})
