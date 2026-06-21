import type { FeedEntry, FeedGroup } from '~/types/feed'
import XmlBuilder from 'fast-xml-builder'
import blogConfig, { myFeed } from '~~/blog.config'
import feeds from '~/feeds'

const runtimeConfig = useRuntimeConfig()

const builder = new XmlBuilder({
	attributeNamePrefix: '$',
	format: true,
	ignoreAttributes: false,
})

function mapEntry(item: FeedEntry) {
	return {
		$text: item.title || item.sitenick || item.author,
		$type: 'rss',
		$xmlUrl: item.feed,
		$created: toZonedTemporal(item.date).toInstant().toString(),
		$description: item.desc,
		$htmlUrl: item.link || item.feed,
	}
}

function flattenGroups(groups: FeedGroup[]) {
	return groups.flatMap(({ entries }) => entries.filter(({ feed }) => feed).map(mapEntry))
}

export default defineEventHandler(async (_e) => {
	const outlines = [
		mapEntry(myFeed),
		...flattenGroups(feeds),
	]

	const opml = {
		$version: '2.0',
		head: {
			title: `${blogConfig.title}的友链订阅`,
			dateCreated: toZonedTemporal(blogConfig.timeEstablished).toInstant().toString(),
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
