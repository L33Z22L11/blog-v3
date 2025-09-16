<script setup lang="ts">
import type ArticleProps from '~/types/article'
import Autoplay from 'embla-carousel-autoplay'
import emblaCarouselVue from 'embla-carousel-vue'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

defineProps<{ list: ArticleProps[] }>()

const [emblaRef, emblaApi] = emblaCarouselVue({
	skipSnaps: true,
	loop: true,
}, [
	Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true }),
	WheelGesturesPlugin(),
])

// 鼠标横向滚动 / Shift + 纵向滚轮事件
useEventListener(emblaRef, 'wheel', (e) => {
	const delta = e.deltaX + (e.shiftKey ? e.deltaY : 0)
	if (Math.abs(delta) < 80)
		return
	delta > 0 ? emblaApi.value?.scrollNext() : emblaApi.value?.scrollPrev()
}, { passive: true })
</script>

<template>
<div class="z-slide">
	<div class="z-slide-header">
		<span class="title text-creative">精选文章</span>
		<div class="at-slide-hover">
			<Icon name="ph:mouse-simple-bold" />
			按住 Shift 横向滚动
		</div>
	</div>
	<div ref="emblaRef" class="embla" dir="ltr">
		<div class="slide-list">
			<ZRawLink
				v-for="(article, index) in list"
				:key="index"
				class="slide-item"
				:title="article.description"
				:to="article.path"
			>
				<NuxtImg class="cover" :src="article.image" :alt="article.title" />
				<div class="info">
					<div class="title text-creative">
						{{ article.title }}
					</div>
					<div class="desc">
						{{ getPostDate(article.date) }}
					</div>
				</div>
			</ZRawLink>
		</div>
		<ZButton
			class="embla-button prev at-slide-hover"
			aria-label="上一页"
			icon="ph:caret-left-bold"
			@click="emblaApi?.scrollPrev()"
		/>
		<ZButton
			class="embla-button next at-slide-hover"
			aria-label="下一页"
			icon="ph:caret-right-bold"
			@click="emblaApi?.scrollNext()"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.z-slide {
	margin: 1rem;

	&:hover .at-slide-hover {
		opacity: 1;
	}
}

.at-slide-hover {
	opacity: 0;
	transition: opacity 0.2s;
}

.z-slide-header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
	overflow: hidden;
	height: 3rem;
	margin-bottom: -0.2rem;
	mask-image: linear-gradient(#FFF, transparent);
	color: var(--c-text-3);

	>.title {
		font-size: 3rem;
		font-weight: bold;
		line-height: 1;
	}
}

.embla {
	--fadeout-width: 1.5rem;

	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	mask-image: linear-gradient(to var(--end), transparent, #FFF var(--fadeout-width), #FFF calc(100% - var(--fadeout-width)), transparent);
	cursor: grab;
	user-select: none;
}

.embla-button {
	position: absolute;
	padding: 0.5em 0.2em;
	font-size: 1.5em;
	transition: all 0.2s;

	&.prev { inset-inline-start: 1rem; }
	&.next { inset-inline-end: 1rem; }
}

.slide-list {
	display: flex;
	scroll-snap-type: x mandatory;

	> .slide-item {
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
		width: max(12rem, 28%);
		max-width: 80%;
		aspect-ratio: 1.77;
		margin: 0 min(0.5em, 1%);
		border-radius: 0.5rem;
		scroll-snap-align: center;
		scroll-snap-stop: always;

		> .cover {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		> .info {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			position: absolute;
			opacity: 0;
			inset: 0;
			padding: 1em;
			backdrop-filter: brightness(0.8) saturate(10) contrast(0.8) blur(2em);
			text-align: center;
			color: white;
			transition: opacity 0.2s;

			> .title {
				text-wrap: balance;
			}

			> .desc {
				opacity: 0.5;
				font-size: 0.8em;
			}
		}

		&:hover > .info {
			opacity: 1;
		}
	}
}
</style>
