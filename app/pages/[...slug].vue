<script setup lang="ts">
import type { Child, Element, Node, Root, Text } from 'postme/types'
import type { VNode } from 'vue'
import { Alert, Badge, Blur, CardList, Chat, Copy, EmojiClock, FeedCard, FeedGroup, Folding, Key, LinkBanner, LinkCard, MdTitle, MusicScore, Pic, Poetry, ProseA, ProseCode, ProsePre, ProseTable, Quote, Tab, Timeline, Tip, VideoEmbed } from '#components'
import { pascal } from 'radash'

const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: post } = await useFetch(`/api/content/${route.path}.md`)

// const contentStore = useContentStore()
// const { toc, meta } = storeToRefs(contentStore)

// const excerpt = computed(() => post.value?.description || '')

// function setTocAndMeta() {
// 	// toc.value = post.value?.body.toc
// 	// meta.value = post.value?.meta
// }

// setTocAndMeta()

// if (post.value) {
// 	useSeoMeta({
// 		title: post.value.title,
// 		ogType: 'article',
// 		ogImage: post.value.image,
// 		description: post.value.description,
// 	})
// 	layoutStore.setAside(post.value.meta?.aside as WidgetName[] | undefined)
// }
// else {
// 	const event = useRequestEvent()
// 	event && setResponseStatus(event, 404)
// 	route.meta.title = '404'
// 	layoutStore.setAside(['blog-log'])
// }

// if (import.meta.dev) {
// 	watchEffect(() => {
// 		setTocAndMeta()
// 		layoutStore.setAside(post.value?.meta?.aside as WidgetName[] | undefined)
// 	})
// }

const components = { Alert, Badge, Blur, CardList, Chat, Copy, EmojiClock, FeedCard, FeedGroup, Folding, Key, LinkBanner, LinkCard, MdTitle, MusicScore, Pic, Poetry, ProseA, ProseCode, ProsePre, ProseTable, Quote, Tab, Timeline, Tip, VideoEmbed }

function getComponent(key: string) {
	if (['a', 'code', 'pre', 'table'].includes(key))
		return components[`Prose${pascal(key)}`] || key
	return components[pascal(key)] || key
}

function Render() {
	const nodeTypeMap = {
		root: (node: Root) => h(
			'article',
			{ class: 'article' },
			node.children.map(renderNode),
		),
		text: (node: Text) => node.value,
		element: (node: Element) => {
			return h(getComponent(node.tag), node.props, getSlots(node))
		},
	}

	function renderNode(node: Node): VNode | null {
		const nodeTypeRender = nodeTypeMap[node.type]
		if (!nodeTypeRender)
			console.error('未知节点类型:', node.type)
		return nodeTypeRender?.(node) || null
	}

	function getSlots(node: Element) {
		const defaultChildren: VNode[] = []
		const slots: Record<string, () => VNode[]> = {}

		node.children.forEach((child: Child) => {
			const isSlot = child.type === 'element' && child.tag === 'component-slot'
			if (!isSlot) {
				defaultChildren.push(renderNode(child))
				return
			}
			const slotName = Object.keys(child.props || {})[0]!.slice(7)
			slots[slotName] = () => child.children.map(renderNode)
		})

		return { default: () => defaultChildren, ...slots }
	}

	return renderNode(post.value.body)
}
</script>

<template>
<template v-if="post">
	<PostHeader v-bind="post.frontmatter" />
	<PostExcerpt v-if="post.frontmatter.description" :excerpt="post.frontmatter.description" />
	<Render />
	<!-- <ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/> -->

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
