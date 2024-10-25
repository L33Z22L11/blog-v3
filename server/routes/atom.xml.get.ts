import { serverQueryContent } from '#content/server'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'
import xml2js from 'xml2js'
import type ArticleProps from '~/types/article'

function getUrl(path: string | undefined) {
    return new URL(path ?? '', blogConfig.url).toString()
}

export default defineEventHandler(async (event) => {
    const feed = {
        $: { xmlns: 'http://www.w3.org/2005/Atom' },
        id: blogConfig.url,
        title: blogConfig.title,
        updated: new Date().toISOString(),
        author: {
            name: blogConfig.author.name,
            email: blogConfig.author.email,
            uri: blogConfig.author.homepage,
        },
        link: [{ $: { href: getUrl('atom.xml'), rel: 'self' } }],
        generator: {
            $: { uri: 'https://github.com/L33Z22L11/blog-v3', version },
            _: 'Zhilu Blog',
        },
        icon: blogConfig.favicon,
        logo: blogConfig.author.avatar,
        rights: `© ${new Date().getFullYear()} Zhilu`,
        subtitle: blogConfig.subtitle,
        entry: <ArticleProps>[],
    }

    const posts = await serverQueryContent(event)
        .where({ _original_dir: { $eq: '/posts' } })
        .sort({ updated: -1 })
        .limit(blogConfig.feed.limit)
        .find()

    posts.forEach((post) => {
        feed.entry.push({
            id: getUrl(post._path),
            title: post.title ?? '',
            updated: new Date(post.updated).toISOString(),
            author: { name: post.author || blogConfig.author.name },
            content: {
                $: { type: 'html' },
                // TODO: 渲染文章内容
                _: `<![CDATA[<img src="${post.image}" alt="${post.title}"/><p>${post.description}</p>]]>`,
            },
            link: { $: { href: getUrl(post._path) } },
            summary: post.description,
            category: { $: { term: post.categories?.[0] } },
            published: new Date(post.date).toISOString(),
        })
    })

    const builder = new xml2js.Builder()
    const xml = builder.buildObject({ feed })

    setHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
    return xml
})
