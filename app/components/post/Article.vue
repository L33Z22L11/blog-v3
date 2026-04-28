<script setup lang="ts">
import type { ArticleProps } from '~/types/article'

const props = defineProps<{ useUpdated?: boolean } & ArticleProps>()
const showAllDate = isTimeDiffSignificant(props.date, props.updated)
</script>

<template>
<UtilLink class="article-card card upraise">
	<NuxtImg v-if="image" class="article-cover" :src="image" :alt="title" />
	<article>
		<h2 class="article-title text-creative">
			{{ title }}
		</h2>

		<p v-if="description" class="article-description">
			{{ description }}
		</p>

		<div class="article-info">
			<UtilDate
				v-if="date && (showAllDate || !useUpdated)"
				:date
				icon="tabler:pencil-minus"
			/>

			<UtilDate
				v-if="updated && (showAllDate || useUpdated)"
				:class="{ 'use-updated': useUpdated }"
				:date="updated"
				icon="tabler:clock-edit"
			/>

			<span v-if="categories" :style="{ color: getCategoryColor(categories[0]) }">
				<Icon :name="getCategoryIcon(categories[0])" />
				{{ categories[0] }}
			</span>

			<span v-if="readingTime?.words" class="article-words">
				<Icon name="tabler:pilcrow" />
				{{ formatNumber(readingTime?.words) }}字
			</span>
		</div>
	</article>
</UtilLink>
</template>

<style lang="scss" scoped>
.article-card {
	container-type: inline-size;
	position: relative;
	margin: 1em 0;
	border-radius: 0.8em;
	color: var(--c-text);
	animation: float-in 0.2s var(--delay) backwards;

	> article {
		display: grid;
		gap: 0.5em;
		padding: 1em;
	}
}

.article-info {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em clamp(1em, 5%, 1.5em);
	font-size: 0.8em;
	color: var(--c-text-2);

	&:empty {
		display: none;
	}

	.use-updated {
		order: -1;
	}
}

.article-title {
	font-size: 1.2em;
	color: var(--c-text);
}

.article-description {
	font-size: 0.9em;
	color: var(--c-text-2);
}

.article-cover {
	position: absolute;
	opacity: 0.8;
	inset-inline-end: 0;
	top: 0;
	width: calc(40% + 2em);
	height: 100%;
	margin: 0;
	mask-image: linear-gradient(to var(--end), transparent, #FFF 50%);
	transition: opacity 0.2s;
	object-fit: cover;

	:hover > & {
		opacity: 1;
	}

	& + article {
		position: relative;
		width: 60%;
	}

	@mixin cover-narrow {
		position: revert;
		width: 100%;
		height: auto;
		max-width: none;
		max-height: 256px;
		aspect-ratio: 2.4;
		margin-bottom: -10%;
		mask-image: linear-gradient(#FFF 50%, transparent);

		& + article {
			width: auto;

			> .article-title {
				text-shadow: 0 0 0.2em var(--ld-bg-card), 0 0 0.5em var(--ld-bg-card), 0 0 1em var(--ld-bg-card);
			}
		}
	}

	@media (max-width: $breakpoint-phone) {
		@include cover-narrow;
	}

	@container (max-width: #{$breakpoint-phone}) {
		@include cover-narrow;
	}
}
</style>
