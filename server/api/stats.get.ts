import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
    // 未指定请求方法会多次调用
    // console.log(new Error('服务端统计函数调用堆栈'))

    const stats = {
        totalWords: 0,
    }

    const posts = await serverQueryContent(event).find()

    posts.forEach(async (post) => {
        // console.log(`[stats] totalWords: ${stats.totalWords} += ${post.readingTime.words} @[${post.title}](${post._path})`)
        stats.totalWords += post.readingTime.words
    })

    return stats
})
