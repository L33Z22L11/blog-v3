import type { FeedEntry, FeedGroup } from '~/types/feed'
import { XMLBuilder } from 'fast-xml-parser'
import blogConfig, { myFeed } from '~~/blog.config'
import friends from '~/friends'
import subscriptions from '~/subscriptions'

const runtimeConfig = useRuntimeConfig()

const builder = new XMLBuilder({
	attributeNamePrefix: '$',
	format: true,
	ignoreAttributes: false,
})

function mapEntry(item: FeedEntry) {
	return {
		$text: item.title || item.sitenick || item.author,
		$type: 'rss',
		$xmlUrl: item.feed,
		$created: new Date(item.date).toISOString(),
		$description: item.desc,
		$htmlUrl: item.link || item.feed,
	}
}

function flattenGroups(groups: FeedGroup[]) {
	return groups.flatMap(group =>
		group.entries.filter(entry => entry.feed).map(mapEntry))
}

export default defineEventHandler(async (_e) => {
	const outlines = [
		mapEntry(myFeed),
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

	return builder.build({
		'?xml': { $version: '1.0', $encoding: 'UTF-8' },
		opml,
	})
})
