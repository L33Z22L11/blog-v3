<script setup lang="ts">
import type { ArticleProps } from '~/types/article'
import { Temporal } from 'temporal-polyfill'

const props = defineProps<{
	to?: string
	useUpdated?: boolean
} & ArticleProps>()

const mainDate = computed(() => props.useUpdated ? props.updated : props.date)
</script>

<template>
<li class="article-item">
	<UtilDate class="dim-hover" :date="mainDate" format="monthDay" />

	<div class="gradient-card">
		<UtilLink class="article-link scrollbar-hidden scrollcheck-x" :to :title="description">
			<span class="article-title">
				{{ title }}
			</span>

			<UtilDate
				v-if="date && useUpdated && isTimeDiffSignificant(date, updated)"
				class="dim-hover info"
				:date="date"
				:format="updated && Temporal.PlainDate.from(date).year === Temporal.PlainDate.from(updated).year ? 'date' : 'monthDay'"
			/>

			<ul v-if="tags?.length" class="dim-hover info tag-list">
				<li v-for="tag in tags" :key="tag" v-text="tag" />
			</ul>
		</UtilLink>
	</div>
</li>
</template>

<style lang="scss" scoped>
.article-item {
	display: flex;
	align-items: center;
	column-gap: 0.5em;
	min-width: 0;
	margin: var(--archive-item-gap, 0.2em) 0;
	transition: all 0.2s;
	animation: float-in 0.2s var(--delay) backwards;

	@media (max-width: $breakpoint-mobile) {
		font-size: 0.9em;
	}

	.dim-hover {
		opacity: 0.4;
		transition: opacity 0.2s;
	}

	:deep(time) {
		font-variant-numeric: tabular-nums;
	}

	.info {
		font-size: 0.8em;
	}

	&:hover,
	&:focus-within {
		.article-title {
			color: var(--c-text);
		}

		.dim-hover {
			opacity: 1;
		}
	}
}

.gradient-card {
	flex-grow: 1;
	min-width: 0;
}

.article-link {
	--scrollbar-height: 0px;

	display: flex;
	align-items: baseline;
	gap: 1em;
	padding: 0.3em 0.6em;
	white-space: nowrap;

	> .tag-list {
		display: flex;
		flex-wrap: nowrap;
		gap: 0.5em;
		margin-left: auto;

		&::before {
			content: "#";
			opacity: 0.5;
		}
	}
}
</style>
