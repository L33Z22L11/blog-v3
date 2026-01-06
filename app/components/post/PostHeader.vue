<script setup lang="ts">
import type ArticleProps from '~/types/article'

defineOptions({ inheritAttrs: false })
const props = defineProps<ArticleProps>()

const appConfig = useAppConfig()

const coverFilter = computed(() => props.meta?.coverFilter || (props.meta?.coverDim && 'brightness(0.75)') || undefined)
const categoryLabel = computed(() => props.categories?.[0])
const categoryIcon = computed(() => getCategoryIcon(categoryLabel.value))

const shareText = `【${appConfig.title}】${props.title}\n\n${
	props.description ? `${props.description}\n\n` : ''}${
	new URL(props.path!, appConfig.url).href}`

const { copy, copied } = useCopy(shareText)
</script>

<template>
<!-- 💩夸克浏览器，桌面端只有IE不支持 :has() 了 -->
<div class="post-header" :class="{ 'has-cover': image }">
	<Pic v-if="image" class="post-cover" :src="image" :alt="title" :filter="coverFilter" />
	<div class="post-nav">
		<div class="operations">
			<ZButton
				:icon="copied ? 'ph:check-bold' : 'ph:share-bold' "
				@click="copy()"
			>
				文字分享
			</ZButton>
		</div>

		<div v-if="!meta?.hideInfo" class="post-info">
			<UtilDate
				v-if="date"
				v-tip
				tip-prefix="创建于"
				:date="date"
				icon="ph:calendar-dots-bold"
			/>

			<UtilDate
				v-if="updated && isTimeDiffSignificant(date, updated, .999)"
				v-tip
				tip-prefix="修改于"
				:date="updated"
				icon="ph:calendar-plus-bold"
			/>

			<span v-if="categoryLabel">
				<Icon :name="categoryIcon" />
				{{ categoryLabel }}
			</span>

			<span>
				<Icon name="ph:paragraph-bold" />
				{{ formatNumber(readingTime?.words) }} 字
			</span>
		</div>
	</div>

	<h1 class="post-title" :class="getPostTypeClassName(type)">
		{{ title }}
	</h1>
</div>
</template>

<style lang="scss" scoped>
.post-header {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;
	margin: 0.5rem;
	border-radius: 1rem;
	background-color: var(--c-bg-2);
	color: var(--c-text);

	@media (max-width: $breakpoint-mobile) {
		margin: 0;
		border-radius: 0;
	}

	&:hover .operations,
	&:focus-within .operations {
		opacity: 1;
	}

	&.has-cover {
		contain: paint; // overflow hidden + position relative
		min-height: 16rem;
		max-height: 20rem;
		color: white;
		transition: font-size 0.2s;

		.post-info {
			filter: drop-shadow(0 1px 2px #000);
		}

		.post-title {
			background-image: linear-gradient(transparent, #0003, #0005);
			text-shadow: var(--text-black-shadow);

			&.text-story {
				text-align: center;
			}
		}
	}
}

.operations {
	position: absolute;
	opacity: 0;
	inset-inline-end: 1em;
	color: var(--c-text-1);
	transition: opacity 0.2s;
	z-index: 1;
}

.post-cover {
	position: absolute;
	inset: 0;

	> :deep(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.post-title {
	padding: 0.8em 1rem;
	font-size: 1.6em;
	line-height: 1.2;
	z-index: 1;
}

.post-nav {
	padding: 0.8em 1rem;
	font-size: 0.8em;

	.post-info {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em 1.2em;
		column-gap: clamp(1em, 3%, 1.5em);
	}
}
</style>
