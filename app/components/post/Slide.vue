<script setup lang="ts">
import type ArticleProps from '~/types/article'
import Autoplay from 'embla-carousel-autoplay'
import emblaCarouselVue from 'embla-carousel-vue'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

defineProps<{ list: ArticleProps[] }>()

const appConfig = useAppConfig()
const compConf = computed(() => appConfig.component.slide)

// @keep-sorted
const [carouselEl, carouselApi] = emblaCarouselVue({
	containScroll: false,
	loop: true,
	skipSnaps: true,
}, [
	Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true }),
	WheelGesturesPlugin(),
])

// 鼠标横向滚动 / Shift + 纵向滚轮事件
useEventListener(carouselEl, 'wheel', (e) => {
	const delta = e.deltaX + (e.shiftKey ? e.deltaY : 0)
	if (Math.abs(delta) < 80)
		return
	delta > 0 ? carouselApi.value?.scrollNext() : carouselApi.value?.scrollPrev()
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

	<div ref="carouselEl" class="z-slide-body" dir="ltr">
		<div class="slide-list">
			<UtilLink
				v-for="(article, index) in list"
				:key="index"
				class="slide-item"
				:title="article.description"
				:to="article.path"
			>
				<NuxtImg class="cover" :src="article.image" :alt="compConf.showTitle ? '' : article.title" />

				<div v-if="compConf.showTitle" class="stable-info text-creative">
					{{ article.title }}
				</div>

				<div class="hover-info">
					<div class="title text-creative">
						{{ article.title }}
					</div>
					<UtilDate v-if="article.date" class="desc" :date="article.date" />
				</div>
			</UtilLink>
		</div>

		<ZButton
			class="carousel-action prev at-slide-hover"
			aria-label="上一页"
			icon="ph:caret-left-bold"
			@click="carouselApi?.scrollPrev()"
		/>

		<ZButton
			class="carousel-action next at-slide-hover"
			aria-label="下一页"
			icon="ph:caret-right-bold"
			@click="carouselApi?.scrollNext()"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.z-slide {
	margin: 1rem;

	.at-slide-hover {
		opacity: 0;
		transition: opacity 0.2s;
	}

	&:hover .at-slide-hover,
	&:focus-within .at-slide-hover {
		opacity: 1;
	}
}

.z-slide-header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
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

.z-slide-body {
	--fadeout-width: 1.5rem;

	position: relative;
	overflow: hidden;
	mask-image: linear-gradient(to var(--end), transparent, #FFF var(--fadeout-width), #FFF calc(100% - var(--fadeout-width)), transparent);
	cursor: grab;
	user-select: none;

	.slide-list {
		display: flex;
		scroll-snap-type: x mandatory;
	}
}

.carousel-action {
	position: absolute;
	top: 50%;
	padding: 0.5em 0.2em;
	font-size: 1.5em;
	transform: translateY(-50%);
	transition: all 0.2s;

	&.prev { inset-inline-start: 1rem; }
	&.next { inset-inline-end: 1rem; }
}

.slide-item {
	contain: paint;
	flex-shrink: 0;
	position: relative;
	width: max(12rem, 28%);
	max-width: 80%;
	aspect-ratio: 1.77;
	margin: 0 min(0.5em, 1%);
	border-radius: 0.5rem;
	scroll-snap-align: center;
	scroll-snap-stop: always;

	// Firefox 图片 alt 为空时 fallback 失效
	@supports (-moz-force-broken-image-icon: 1) {
		background-color: var(--c-border);
	}

	> .cover {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	>.stable-info, > .hover-info {
		position: absolute;
		text-align: center;
		text-shadow: var(--text-black-shadow);
		color: white;
		transition: opacity 0.2s;
	}

	> .stable-info {
		overflow: hidden;
		bottom: 0;
		width: 100%;
		padding: 0.5em;
		background-image: linear-gradient(transparent, #0003, #0005);
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	> .hover-info {
		display: grid;
		place-items: center;
		opacity: 0;
		inset: 0;
		padding: 1em;
		backdrop-filter: brightness(0.8) saturate(10) contrast(0.8) blur(2em);

		> .title {
			text-wrap: balance;
		}

		> .desc {
			opacity: 0.5;
			font-size: 0.8em;
		}
	}

	&:hover, &:focus-within {
		>.stable-info {
			opacity: 0;
		}

		> .hover-info {
			opacity: 1;
		}
	}
}
</style>
