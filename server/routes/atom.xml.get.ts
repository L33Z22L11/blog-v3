import { serverQueryContent } from '#content/server'
import blogConfig from '~~/blog.config'
import { Feed } from 'feed'
import { setHeader } from 'h3'

function getUrl(path?: string) {
    return new URL(path ?? '', blogConfig.url).toString()
}

export default defineEventHandler(async (event) => {
    const feed = new Feed({
        id: blogConfig.url,
        title: blogConfig.title,
        updated: new Date(),
        generator: 'https://github.com/L33Z22L11/blog-v3',
        author: {
            ...blogConfig.author,
            link: blogConfig.author.homepage,
        },
        link: blogConfig.url,
        feedLinks: {
            atom: getUrl('atom.xml'),
        },
        description: blogConfig.description,
        language: blogConfig.language,
        image: blogConfig.author.avatar,
        favicon: blogConfig.favicon,
        copyright: blogConfig.copyright.abbr,
    })

    const posts = await serverQueryContent(event)
        .where({ _original_dir: { $eq: '/posts' } })
        .sort({ updated: -1 })
        .limit(blogConfig.feed.limit)
        .find()

    posts.forEach(async (post) => {
        feed.addItem({
            title: post.title ?? '',
            id: getUrl(post._path),
            link: getUrl(post._path),
            date: new Date(post.updated),
            description: post.description,
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
