import type { ParsedContent } from '@nuxt/content'
import { serverQueryContent } from '#content/server'
import { XMLBuilder } from 'fast-xml-parser'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'
import { getIsoDatetime } from '~/utils/time'

const runtimeConfig = useRuntimeConfig()

const builder = new XMLBuilder({
    attributeNamePrefix: '$',
    cdataPropName: '$',
    format: true,
    ignoreAttributes: false,
    textNodeName: '_',
})

function getUrl(path: string | undefined) {
    return new URL(path ?? '', blogConfig.url).toString()
}

function renderContent(post: ParsedContent) {
    return [
        post.image && `<img src="${post.image}" />`,
        post.description && `<p>${post.description}</p>`,
        `<a href="${getUrl(post._path)}">点击查看全文</a>`,
    ].join(' ')
}

export default defineEventHandler(async (e) => {
    const posts = await serverQueryContent(e)
        .where({ _original_dir: { $eq: '/posts' } })
        .sort({ updated: -1 })
        .limit(blogConfig.feed.limit)
        .find()

    const entries = posts.map(post => ({
        id: getUrl(post._path),
        title: post.title ?? '',
        updated: getIsoDatetime(post.updated),
        author: { name: post.author || blogConfig.author.name },
        content: {
            $type: 'html',
            $: renderContent(post),
        },
        link: { $href: getUrl(post._path) },
        summary: post.description,
        category: { $term: post.categories?.[0] },
        published: getIsoDatetime(post.published) ?? getIsoDatetime(post.date),
    }))

    const feed = {
        $xmlns: 'http://www.w3.org/2005/Atom',
        id: blogConfig.url,
        title: blogConfig.title,
        updated: runtimeConfig.public.buildTime,
        description: blogConfig.description, // RSS 2.0
        author: {
            name: blogConfig.author.name,
            email: blogConfig.author.email,
            uri: blogConfig.author.homepage,
        },
        link: [
            { $href: getUrl('atom.xml'), $rel: 'self' },
            { $href: blogConfig.url, $rel: 'alternate' },
        ],
        language: blogConfig.language, // RSS 2.0
        generator: {
            $uri: 'https://github.com/L33Z22L11/blog-v3',
            $version: version,
            _: 'Zhilu Blog',
        },
        icon: blogConfig.favicon,
        logo: blogConfig.author.avatar, // Ratio should be 2:1
        rights: `© ${new Date().getFullYear()} ${blogConfig.author.name}`,
        subtitle: blogConfig.subtitle || blogConfig.description,
        entry: entries,
    }

    return builder.build({
        '?xml': { $version: '1.0', $encoding: 'UTF-8' },
        '?xml-stylesheet': { $type: 'text/xsl', $href: '/assets/atom.xsl' },
        feed,
    })
})
