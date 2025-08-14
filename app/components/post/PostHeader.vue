<script setup lang="ts">
import type ArticleProps from '~/types/article'

defineOptions({ inheritAttrs: false })
const props = defineProps<ArticleProps>()

const appConfig = useAppConfig()

const categoryLabel = computed(() => props.categories?.[0])
const categoryIcon = computed(() => getCategoryIcon(categoryLabel.value))

const shareText = `【${appConfig.title}】${props.title}\n\n${
	props.description ? `${props.description}\n\n` : ''}${
	new URL(props.path!, appConfig.url).href}`

const { copy, copied } = useCopy(shareText)
</script>

<template>
<!-- 💩夸克浏览器，桌面端只有IE不支持 :has() 了 -->
<div class="post-header" :class="{ 'has-cover': image, 'text-revert': cover_revert }">
	<NuxtImg v-if="image" class="post-cover" :src="image" :alt="title" />
	<div class="post-nav">
		<div class="operations">
			<ZButton
				:icon="copied ? 'ph:check-bold' : 'ph:share-bold' "
				@click="copy()"
			>
				文字分享
			</ZButton>
		</div>
		<div v-if="!hideInfo" class="post-info">
			<time
				v-if="date"
				v-tip="`创建于 ${getLocaleDatetime(props.date)}`"
				:datetime="getIsoDatetime(date)"
			>
				<Icon name="ph:calendar-dots-bold" />
				{{ getPostDate(props.date) }}
			</time>

			<time
				v-if="isTimeDiffSignificant(date, updated, .999)"
				v-tip="`修改于 ${getLocaleDatetime(props.updated)}`"
				:datetime="getIsoDatetime(updated)"
			>
				<Icon name="ph:calendar-plus-bold" />
				{{ getPostDate(props.updated) }}
			</time>

			<span v-if="categoryLabel" class="article-category">
				<Icon :name="categoryIcon" />
				{{ categoryLabel }}
			</span>

			<span class="wordcount">
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

	&:hover .operations {
		opacity: 1;
	}

	&.has-cover {
		position: relative;
		overflow: hidden;
		min-height: 256px;
		max-height: 320px;
		text-shadow: 0 1px 1px #0003, 0 1px 2px #0003;
		color: white;
		transition: font-size 0.2s;
		z-index: 0;

		&:hover {
			font-size: 0.8em;
		}

		.post-title {
			background-image: linear-gradient(transparent, #0003, #0005);

			&.text-story {
				text-align: center;
			}
		}

		&.text-revert {
			text-shadow: 0 0 2px #FFF, 0 1px 0.5em #FFF;
			color: #333;

			.post-title {
				background-image: linear-gradient(transparent, #FFF3, #FFF5);
			}
		}
	}
}

.operations {
	position: absolute;
	opacity: 0;
	right: 1em;
	color: var(--c-text-1);
	transition: opacity 0.2s;
	z-index: 1;
}

.post-cover {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: -1;
}

.post-title {
	padding: 0.8em 1rem;
	font-size: 1.6em;
	line-height: 1.2;
}

.post-nav {
	position: relative;
	opacity: 0.9;
	padding: 0.8em 1rem;

	// 如果在父级设置字体尺寸，会影响祖先字体尺寸改变的行为
	// 并且设置相对尺寸会导致过渡
	>* {
		font-size: 0.8rem;
	}

	.post-info {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em 1.2em;
		column-gap: clamp(1em, 3%, 1.5em);
	}
}
</style>
