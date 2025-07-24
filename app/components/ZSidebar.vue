<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
const searchStore = useSearchStore()

const { word } = storeToRefs(searchStore)
const keycut = computed(() => navigator?.userAgent.includes('Mac OS') ? '⌘K' : 'Ctrl+K')

const displayWarning = ref(false)
function hideWarning() {
	displayWarning.value = false
	localStorage?.setItem('hide_20250725', 'true')
}
onMounted(() => {
	displayWarning.value = localStorage.getItem('hide_20250725') !== 'true'
})
</script>

<template>
<Transition>
	<!-- FIXME: 评估是否能公用 bgmask 减少冗余 -->
	<div v-if="layoutStore.isOpen('sidebar')" id="z-sidebar-bgmask" @click="layoutStore.toggle('sidebar')" />
</Transition>
<!-- 此处不能使用 Transition，因为半宽屏状态始终显示 -->
<aside id="z-sidebar" :class="{ show: layoutStore.isOpen('sidebar') }">
	<ZhiluHeader class="sidebar-header" to="/" />

	<nav class="sidebar-nav scrollcheck-y">
		<div class="search-btn sidebar-nav-item gradient-card" @click="layoutStore.toggle('search')">
			<Icon name="ph:magnifying-glass-bold" />
			<span class="nav-text">{{ word || '搜索' }}</span>
			<span class="keycut widescreen-only">{{ keycut }}</span>
		</div>

		<!-- TODO 谨慎升级 预计2025-10-25下线 -->
		<Alert v-if="displayWarning" type="warning">
			<template #title>
				<span style="flex-grow: 1;">主题用户谨慎合并上游</span>
				<Icon name="ph:x-bold" style="cursor: pointer;" @click="hideWarning" />
			</template>
			<p style="margin: 0.5em 0;">
				已升级 Nuxt 4 / Nuxt Content 3，具有大量破坏性更改且功能实现尚不完善，建议非必要不合并上游。
				<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
				<ProseA href="https://github.com/L33Z22L11/blog-v3/pull/20" target="_blank">PR</ProseA>
			</p>
		</Alert>

		<template v-for="(group, groupIndex) in appConfig.nav" :key="groupIndex">
			<h3 v-if="group.title">
				{{ group.title }}
			</h3>

			<menu>
				<li v-for="(item, itemIndex) in group.items" :key="itemIndex">
					<ZRawLink :to="item.url" class="sidebar-nav-item" @click="layoutStore.toggle('sidebar')">
						<Icon :name="item.icon" />
						<span class="nav-text">{{ item.text }}</span>
						<Icon v-if="isExtLink(item.url)" class="external-tip" name="ph:arrow-up-right" />
					</ZRawLink>
				</li>
			</menu>
		</template>
	</nav>

	<footer class="sidebar-footer">
		<ThemeToggle />
		<ZIconNavList :list="appConfig.footer.iconNav" />
	</footer>
</aside>
</template>

<style lang="scss" scoped>
#z-sidebar {
	display: flex;
	flex-direction: column;
	color: var(--c-text-2);

	&:hover {
		color: currentcolor;
	}

	@media (max-width: $breakpoint-mobile) {
		position: fixed;
		left: 0;
		width: 320px;
		max-width: 100%;
		box-shadow: 0 0 1rem var(--ld-shadow);
		background-color: var(--ld-bg-blur);
		backdrop-filter: blur(0.5rem);
		color: currentcolor;
		transform: translateX(-100%);
		transition: transform 0.2s;
		z-index: 100;

		&.show {
			transform: none;
		}
	}
}

#z-sidebar-bgmask {
	position: fixed;
	inset: 0;
	background-color: #0003;
	transition: opacity 0.2s;
	z-index: 100;

	&.v-enter-from,
	&.v-leave-to {
		opacity: 0;
	}

	@media (min-width: $breakpoint-mobile) {
		display: none;
	}
}

.sidebar-nav {
	flex-grow: 1;
	padding: 0 5%;
	font-size: 0.9em;

	h3 {
		margin: 2em 0 1em 1em;
		font: inherit;
		color: var(--c-text-2);
	}

	li {
		margin: 0.5em 0;
	}
}

.sidebar-nav-item {
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.5em 1em;
	border-radius: 0.5em;
	transition: all 0.2s;

	&:hover,
	&.router-link-active {
		background-color: var(--c-bg-soft);
		color: var(--c-text);
	}

	&.router-link-active::after {
		content: "⦁";
		width: 1em;
		text-align: center;
		color: var(--c-text-3);
	}

	.iconify {
		font-size: 1.5em;
	}

	.nav-text {
		flex-grow: 1;
	}

	.external-tip {
		opacity: 0.5;
		font-size: 1em;
	}
}

.search-btn {
	margin-block: 1rem;
	outline: 1px solid var(--c-border);
	outline-offset: -1px;
	cursor: text;

	&:hover {
		outline-color: transparent;
		background-color: transparent;
	}

	.nav-text {
		opacity: 0.5;
	}

	.keycut {
		opacity: 0.5;
		padding: 0 0.2em;
		border-radius: 0.2em;
		background-color: var(--c-bg-soft);
		font-size: 0.8em;
	}
}

.sidebar-footer {
	--gap: clamp(0.5rem, 3vh, 1rem);

	display: grid;
	gap: var(--gap);
	padding: var(--gap);
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
