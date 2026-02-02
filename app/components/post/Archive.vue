<script setup lang="ts">
import type { ArticleProps } from '~/types/article'
import { isSameYear } from 'date-fns'

const props = defineProps<{
	to?: string
	useUpdated?: boolean
} & ArticleProps>()

const mainDate = computed(() => props.useUpdated ? props.updated : props.date)
</script>

<template>
<li class="article-item">
	<NuxtTime
		v-if="mainDate"
		:datetime="mainDate"
		:title="getLocaleDatetime(mainDate)"
		month="2-digit"
		day="2-digit"
	/>

	<div class="gradient-card">
		<UtilLink class="article-link scrollcheck-x" :to :title="description">
			<span class="article-title">
				{{ title }}
			</span>

			<NuxtTime
				v-if="date && useUpdated && isTimeDiffSignificant(date, updated)"
				class="info"
				:datetime="date"
				:title="getLocaleDatetime(date)"
				:year="isSameYear(date, updated ?? 0) ? undefined : 'numeric'"
				month="2-digit"
				day="2-digit"
			/>

			<ul class="info tag-list">
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
	gap: 0.5em;
	margin: 0.2em 0;
	transition: all 0.2s;
	animation: float-in 0.2s var(--delay) backwards;

	@media (max-width: $breakpoint-mobile) {
		font-size: 0.9em;
	}

	time {
		opacity: 0.4;
		font-variant-numeric: tabular-nums;
	}

	.info {
		opacity: 0.4;
		font-size: 0.8em;
	}

	&:hover,
	&:focus-within {
		.article-title {
			color: var(--c-text);
		}

		> time, .info {
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
	scrollbar-width: none;

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
