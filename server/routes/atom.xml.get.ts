import { Feed } from 'feed'
import { getQuery, setHeader } from 'h3'
import blogConfig from '~~/blog.config'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
    const feed = new Feed({
        id: blogConfig.url,
        title: blogConfig.title,
        updated: new Date(),
        generator: 'https://github.com/L33Z22L11/blog-v3',
        language: blogConfig.language,
        feedLinks: {
            atom: 'atom.xml',
        },
        author: {
            ...blogConfig.author,
            link: blogConfig.author.homepage,
        },
        link: blogConfig.url,
        description: blogConfig.description,
        image: blogConfig.author.avatar,
        favicon: blogConfig.favicon,
        copyright: blogConfig.copyright.abbr,
    })

    const posts = await serverQueryContent(event)
        .where({ _original_dir: { $eq: '/posts' } })
        .sort({ updated: -1 })
        .find()

    posts.forEach(async (post) => {
        feed.addItem({
            title: post.title ?? '',
            id: post._path,
            link: post._path ?? '',
            date: new Date(post.updated),
            description: post.description.toString(),
            category: post.categories,
            image: post.cover,
            author: post.author || blogConfig.author.name,
            published: new Date(post.date),
            copyright: post.copyright || blogConfig.copyright.abbr,
        })
    })

    setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
    return feed.atom1()
})
