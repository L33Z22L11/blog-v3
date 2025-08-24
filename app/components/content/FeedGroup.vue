<script setup lang="ts">
import type { FeedEntry, FeedGroup } from '~/types/feed'

defineProps<{
	label?: string
	feeds: FeedGroup[]
}>()

// 友链浮现随机延迟
function getCardDelay(feed: FeedEntry) {
	let hash = 0
	for (const char of feed.link) {
		hash = hash * 31 + char.charCodeAt(0)
	}
	return (hash % 1000) / 1000
}
</script>

<template>
<h2 v-if="label" class="feed-label text-creative">
	{{ label }}
</h2>

<section v-for="group in feeds" :key="group.name" class="feed-group">
	<h3 class="feed-title text-creative">
		{{ group.name }}
	</h3>
	<p class="feed-desc">
		{{ group.desc }}
	</p>
	<TransitionGroup tag="menu" class="feed-list" appear name="float-in">
		<li
			v-for="entry in group.entries"
			:key="entry.link"
			:style="`--delay: ${getCardDelay(entry)}s;`"
		>
			<FeedCard v-bind="entry" />
		</li>
	</TransitionGroup>
</section>
</template>

<style lang="scss" scoped>
.feed-label {
	margin: 2rem 1rem -1rem;
}

.feed-group {
	// position: relative;
	container-type: inline-size;
	margin: 2rem 1rem;
}

.feed-title {
	position: sticky;
	opacity: 0.5;
	top: 0;
	margin-bottom: -0.3em;
	mask-image: linear-gradient(#FFF 50%, transparent);
	font-size: 5em;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: transparent;
	transition: color 0.2s;
	z-index: -1;
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
	grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
	gap: 0.2rem 0.5rem;
	margin: 1rem auto;

	@mixin feed-narrow {
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		font-size: 0.9em;

		:deep(.feed-card) {
			flex-direction: column;
			text-align: center;

			.avatar.avatar {
				margin: 0 0 0.2rem;
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
</style>
