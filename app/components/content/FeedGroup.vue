<script setup lang="ts">
import type { FeedEntry, FeedGroup } from '~/types/feed'
import { shuffle } from 'radash'

const props = defineProps<FeedGroup & { shuffle?: boolean }>()
const route = useRoute()
const entries = ref(props.entries)

// 友链浮现随机延迟
function getCardDelay(feed: FeedEntry) {
	let hash = 0
	for (const char of feed.link) {
		hash = hash * 31 + char.charCodeAt(0)
	}
	return (hash % 1000) / 1000
}

const shuffleEntries = () => entries.value = shuffle(entries.value)

onMounted(() => {
	if (props.shuffle && route.query.shuffle !== 'false')
		shuffleEntries()
})

if (import.meta.dev) {
	watch(() => props.entries, (newEntries) => {
		entries.value = newEntries
	})
}
</script>

<template>
<section class="feed-group">
	<h3 class="feed-title">
		<button v-if="props.shuffle" role="button" title="点击随机排序" @click="shuffleEntries" v-text="name" />
		<span v-else v-text="name" />
	</h3>
	<p class="feed-desc" v-text="desc" />

	<TransitionGroup tag="menu" class="feed-list" name="float-in">
		<li
			v-for="entry in entries"
			:key="entry.link"
			:style="`--delay: ${getCardDelay(entry)}s;`"
		>
			<FeedCard v-bind="entry" />
		</li>
	</TransitionGroup>
</section>
</template>

<style lang="scss" scoped>
.feed-group {
	container-type: inline-size;
	margin: 2em 1em;
}

.feed-title {
	position: sticky;
	opacity: 0.5;
	top: 0;
	margin-bottom: -0.3em;
	mask-image: linear-gradient(#FFF 50%, transparent);
	font-family: var(--font-stroke-free);
	font-size: 5em;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: transparent;
	transition: color 0.2s;
	-webkit-text-stroke: 1px var(--c-text-3);

	&::selection, :hover > & {
		color: var(--c-text-3);
	}
}

.feed-desc {
	text-align: center;
	color: var(--c-text-2);
}

.feed-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
	gap: 0.2em 0.5em;
	margin: 1em auto;

	@mixin feed-narrow {
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		font-size: 0.9em;

		:deep(.feed-card) {
			flex-direction: column;
			text-align: center;

			.avatar.avatar {
				margin: 0 0 0.2em;
			}
		}
	}

	@media (max-width: $breakpoint-phone) {
		@include feed-narrow;
	}

	@container (max-width: #{$breakpoint-phone}) {
		@include feed-narrow;
	}
}

:deep(.feed-card.feed-card) {
	width: auto;
	margin: 0;
}

.float-in-move {
	contain: paint; // 防止移动时出现滚动条
}
</style>
