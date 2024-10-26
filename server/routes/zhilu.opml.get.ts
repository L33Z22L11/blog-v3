import blogConfig from '~~/blog.config'
import { XMLBuilder } from 'fast-xml-parser'
import friend from '~/assets/friend'
import type { FriendGroup } from '~/types/friend'

const runtimeConfig = useRuntimeConfig()

const xmlBuilderOptions = {
    attributeNamePrefix: '$',
    format: true,
    ignoreAttributes: false,
}

const builder = new XMLBuilder(xmlBuilderOptions)

export default defineEventHandler(async (event) => {
    const outlines = [
        {
            $type: 'rss',
            $text: blogConfig.title,
            $xmlUrl: new URL('/feed.xml', blogConfig.url).toString(),
            $description: blogConfig.description as string | undefined,
            $htmlUrl: blogConfig.url,
            $title: blogConfig.title,
        },
    ]

    friend.forEach((group: FriendGroup) => group.items.forEach((item) => {
        if (!item.feed)
            return
        const title = item.title || item.sitenick || item.author
        outlines.push({
            $type: 'rss',
            $text: title,
            $xmlUrl: item.feed,
            $description: item.desc,
            $htmlUrl: item.link || item.feed,
            $title: title,
        })
    }))

    const opml = {
        $version: '2.0',
        head: {
            title: `${blogConfig.title}的友链订阅`,
            dateCreated: new Date(blogConfig.timeEstablished).toISOString(),
            dateModified: runtimeConfig.public.buildTime,
            ownerName: blogConfig.author.name,
            ownerEmail: blogConfig.author.email,
            ownerId: blogConfig.author.homepage,
            docs: 'https://opml.org/spec2.opml',
        },
        body: { outline: outlines },
    }

    setHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
    return builder.build({
        '?xml': { $version: '1.0', $encoding: 'UTF-8' },
        opml,
    })
})
