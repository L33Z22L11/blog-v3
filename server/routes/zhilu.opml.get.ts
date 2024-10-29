import blogConfig, { feedEntry } from '~~/blog.config'
import { XMLBuilder } from 'fast-xml-parser'
import friends from '~/friends'
import subscriptions from '~/subscriptions'
import type { FeedEntry, FeedGroup } from '~/types/feed'

const runtimeConfig = useRuntimeConfig()

const xmlBuilderOptions = {
    attributeNamePrefix: '$',
    format: true,
    ignoreAttributes: false,
}

const builder = new XMLBuilder(xmlBuilderOptions)

function mapEntry(item: FeedEntry) {
    return {
        $text: item.title || item.sitenick || item.author,
        $description: item.desc,
        $htmlUrl: item.link || item.feed,
        $created: new Date(item.date).toISOString(),
        $type: 'rss',
        $title: item.title || item.sitenick || item.author,
        $xmlUrl: item.feed,
    }
}

function flattenGroups(groups: FeedGroup[]) {
    return groups.flatMap(group =>
        group.entries.filter(entry => entry.feed).map(mapEntry))
}

export default defineEventHandler(async (event) => {
    const outlines = [
        mapEntry(feedEntry),
        ...flattenGroups(subscriptions),
        ...flattenGroups(friends),
    ]

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
