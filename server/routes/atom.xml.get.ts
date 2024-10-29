import { serverQueryContent } from '#content/server'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'
import { XMLBuilder } from 'fast-xml-parser'

const runtimeConfig = useRuntimeConfig()

const xmlBuilderOptions = {
    attributeNamePrefix: '$',
    cdataPropName: '$',
    format: true,
    ignoreAttributes: false,
    textNodeName: '_',
}

const builder = new XMLBuilder(xmlBuilderOptions)

function getUrl(path: string | undefined) {
    return new URL(path ?? '', blogConfig.url).toString()
}

function renderContent(post: Record<string, string>) {
    return builder.build({
        img: post.image ? { $src: post.image } : undefined,
        p: post.description,
        a: {
            $href: getUrl(post._path),
            _: '点击查看全文',
        },
    })
}

export default defineEventHandler(async (event) => {
    const posts = await serverQueryContent(event)
        .where({ _original_dir: { $eq: '/posts' } })
        .sort({ updated: -1 })
        .limit(blogConfig.feed.limit)
        .find()

    const entries = posts.map(post => ({
        id: getUrl(post._path),
        title: post.title ?? '',
        updated: new Date(post.updated).toISOString(),
        author: { name: post.author || blogConfig.author.name },
        content: {
            $type: 'html',
            $: renderContent(post),
        },
        link: { $href: getUrl(post._path) },
        summary: post.description,
        category: { $term: post.categories?.[0] },
        published: new Date(post.date).toISOString(),
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
        rights: `© ${new Date().getFullYear()} Zhilu`,
        subtitle: blogConfig.subtitle || blogConfig.description,
        entry: entries,
    }

    setHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
    return builder.build({
        '?xml': { $version: '1.0', $encoding: 'UTF-8' },
        feed,
    })
})
