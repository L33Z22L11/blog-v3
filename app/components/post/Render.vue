<script setup lang="ts">
import type { Child, Element, Node } from 'postme/types'
import type { VNodeChild } from 'vue'
import { Alert, Badge, Blur, CardList, Chat, Copy, EmojiClock, FeedCard, FeedGroup, Folding, Key, LinkBanner, LinkCard, MdTitle, MusicScore, Pic, Poetry, ProseA, ProseCode, ProsePre, ProseTable, Quote, Tab, Timeline, Tip, VideoEmbed } from '#components'
import { pascal } from 'radash'

const props = defineProps<{
	body: Node
}>()

const components: Record<string, Component> = { Alert, Badge, Blur, CardList, Chat, Copy, EmojiClock, FeedCard, FeedGroup, Folding, Key, LinkBanner, LinkCard, MdTitle, MusicScore, Pic, Poetry, ProseA, ProseCode, ProsePre, ProseTable, Quote, Tab, Timeline, Tip, VideoEmbed }

function getComponent(key: string) {
	if (['a', 'code', 'pre', 'table'].includes(key))
		return components[`Prose${pascal(key)}`] || key
	return components[pascal(key)] || key
}

function Render() {
	function renderNode(node: Node): VNodeChild {
		if (node.type === 'text') {
			return node.value
		}
		else if (node.type === 'element') {
			return h(getComponent(node.tag), node.props, getSlots(node))
		}
		else if (node.type === 'root') {
			return h(
				'article',
				{ class: 'article' },
				node.children.map(renderNode),
			)
		}
	}

	function getSlots(node: Element) {
		const defaultChildren: VNodeChild[] = []
		const slots: Record<string, () => VNodeChild[]> = {}

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

	return renderNode(props.body)
}
</script>

<template>
<Render />
</template>
