<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FeedEntry } from '~/types/feed'

const props = defineProps<FeedEntry>()

const appConfig = useAppConfig()
const route = useRoute()
const isInspect = computed(() => import.meta.dev && route.query.inspect !== undefined)

const title = computed(() => props.title ?? props.sitenick ?? props.author)
const domainTip = computed(() => getDomainType(getMainDomain(props.link, true)))
const domainIcon = computed(() => getDomainIcon(props.link))

function getInspectStyle(src: string): CSSProperties {
	src = getMainDomain(src)
	let color = 'red'

	if (src === getMainDomain(props.link))
		color = 'transparent' // 来自源站
	else if (src === 'webp.se')
		color = 'yellow' // 来自API获取
	else if (src === 'qlogo.cn')
		color = 'lightblue' // 来自QQ头像
	else if (src === ('wsrv.nl'))
		color = 'lightgreen' // 来自GitHub头像

	return {
		border: `2px solid ${color}`,
		boxSizing: 'content-box',
	}
}
</script>

<template>
<Tooltip :delay="200" interactive hide-on-click="toggle">
	<UtilLink
		class="feed-card gradient-card"
		:to="error ? undefined : link"
		:data-error="error"
	>
		<div class="avatar">
			<ClientOnly v-if="isInspect">
				<span style="position: absolute; left: 100%; white-space: nowrap;" v-text="title" />
				<NuxtImg :src="icon" :title="icon" :style="getInspectStyle(icon)" />
				<NuxtImg :src="avatar" :title="avatar" :style="getInspectStyle(avatar)" />
			</ClientOnly>

			<NuxtImg v-else class="round-cobblestone" :src="avatar" :alt="author" loading="lazy" :title="feed ? undefined : '无订阅源'" />
			<Icon v-if="appConfig.link.remindNoFeed && !feed" class="no-feed" name="ph:bell-simple-slash-bold" />
		</div>

		<span>{{ author }}</span>
		<span class="title">{{ sitenick }}</span>
	</UtilLink>

	<template #content>
		<div class="site-content">
			<NuxtImg class="site-icon" :src="icon" :alt="title" />

			<div class="site-info">
				<h3 class="text-creative">
					{{ title }}
				</h3>

				<code class="domain" :title="domainTip">
					<span>{{ getDomain(link) }}</span>
					<Icon v-if="domainIcon" class="domain-mark" :name="domainIcon" />
				</code>
			</div>

			<Icon
				v-for="arch in archs" :key="arch"
				class="arch" :name="getArchIcon(arch)" :title="arch"
			/>
		</div>
		<div class="desc-content">
			<div class="date">
				{{ date }}
			</div>

			<p>{{ error ?? desc }}</p>

			<p v-if="comment">
				<Icon name="ph:chat-centered-dots-bold" /> {{ comment }}
			</p>
		</div>
	</template>
</Tooltip>
</template>

<style lang="scss" scoped>
.feed-card {
	display: flex;
	align-items: center;
	gap: 0.2em;
	width: 14em;
	margin: 1em auto;
	padding: 0.5em;
	line-height: 1.4;
	transition: transform 0.2s;
	animation: float-in 0.2s var(--delay) backwards;

	&:hover {
		transform: translateY(-2px);
	}

	&[data-error] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.avatar {
		position: relative;
		margin: 0 0.5em 0 0;

		img {
			display: block;
			width: 2.5em;
			height: 2.5em;
			border-radius: 50%;
			box-shadow: 2px 4px 0.5em var(--ld-shadow);
			background-color: white;
			object-fit: cover;
		}

		.no-feed {
			position: absolute;
			inset-inline-end: -0.5em;
			bottom: 0;
		}
	}

	.title {
		opacity: 0.4;
		font-size: 0.8em;
	}

	.no-feed {
		opacity: 0.6;
		font-size: 0.8em;
	}
}

// https://vue-tippy.netlify.app/props#appendto
// Tooltip 位于组件根部时，interactive tippy 会插入到父组件
:deep() ~ [data-tippy-root] > .tippy-box {
	overflow: hidden;
	overflow: clip;
	padding: 0;

	&[data-placement="top"] > .tippy-svg-arrow {
		fill: var(--c-bg-1);
	}
}

.site-content {
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.5em 1em;

	.site-icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 4px;
		object-fit: contain;
	}

	.site-info {
		flex: 1;
		margin-inline-end: 0.5em;

		.domain {
			font-size: 0.9em;
		}

		.domain-mark {
			font-size: 0.8em;
			vertical-align: super;
		}
	}
}

.desc-content {
	position: relative;
	padding: 0.5em 1em;
	background-color: var(--c-bg-1);

	p + p {
		margin-top: 0.5em;
	}

	.date {
		position: absolute;
		opacity: 0.1;
		inset-inline-end: -0.1em;
		bottom: -0.3em;
		font-size: 3em;
		font-weight: bold;
		white-space: nowrap;
		pointer-events: none;
	}
}
</style>
