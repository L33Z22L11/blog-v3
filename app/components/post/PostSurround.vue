<script setup lang="ts">
import type ArticleProps from '~/types/article'

const route = useRoute()

const { data: surrounds } = await useAsyncData(
	`surround-${route.path}`,
	() => queryCollectionItemSurroundings('content', route.path, { fields: ['date', 'title', 'type'] })
		.order('date', 'ASC')
		.where('stem', 'LIKE', `posts/%`),
)

const [prev = null, next = null] = surrounds.value ?? []

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
	post: ArticleProps | null
	icon: string
	fallbackIcon: string
	fallbackText: string
	alignEnd?: boolean
}>({
	inheritAttrs: false,
})
</script>

<template>
<DefineTemplate v-slot="{ post, icon, fallbackIcon, fallbackText, alignEnd }">
	<ZRawLink :to="post?.path" class="surround-link" :align-end>
		<Icon :class="{ 'rtl-flip': post }" :name="post ? icon : fallbackIcon" />
		<div class="surround-text">
			<strong class="title" :class="getPostTypeClassName(post?.type)">
				{{ post?.title || fallbackText }}
			</strong>
			<time v-if="post" :datetime="getIsoDatetime(post.date)">{{ getPostDate(post.date) }}</time>
		</div>
	</ZRawLink>
</DefineTemplate>

<div v-if="prev || next" class="surround-post" dir="ltr">
	<ReuseTemplate
		:post="next" icon="solar:rewind-back-bold-duotone"
		fallback-icon="solar:document-add-bold-duotone" fallback-text="新故事即将发生"
	/>
	<ReuseTemplate
		:post="prev" icon="solar:rewind-forward-bold-duotone"
		fallback-icon="solar:reel-bold-duotone" fallback-text="已抵达博客尽头"
		align-end
	/>
</div>
</template>

<style lang="scss" scoped>
.surround-post {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	margin: 3rem 1rem;
}

.surround-link {
	display: flex;
	align-items: center;
	gap: 0.5em;
	transition: color 0.2s;

	&:not([href]) {
		opacity: 0.4;
		user-select: none;
	}

	&[align-end] {
		// direction: rtl 会导致末尾标点居左
		flex-direction: row-reverse;
		text-align: end;
	}

	> .surround-text {
		transition: transform 0.2s;

		>time {
			display: block;
			opacity: 0.6;
			font-size: 0.8rem;
		}
	}

	> .iconify {
		opacity: 0.5;
		font-size: 2rem;
		transition: transform 0.2s;
	}

	&[href]:hover {
		color: var(--c-primary);

		> .surround-text {
			transform: translateX(-1em);
		}

		&[align-end] > .surround-text {
			transform: translateX(1em);
		}

		> .iconify {
			opacity: 0.2;
			transform: scale(2);
		}
	}
}
</style>
