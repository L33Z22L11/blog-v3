<script setup lang="ts">
import { LazyBlogPreference } from '#components'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const layoutStore = useLayoutStore()
const modalStore = useModalStore()

const { open } = modalStore.use(() => h(LazyBlogPreference), { unique: true })
</script>

<template>
<ZSecret>
	<ZButton @click="layoutStore.close(); open()">
		偏好设置（Beta）
	</ZButton>
</ZSecret>

<div class="theme-toggle">
	<button
		v-for="(themeData, themeName) in appConfig.themes"
		:key="themeName"
		v-tip="themeData.tip"
		:aria-label="themeData.tip"
		:class="{ active: colorMode.preference === themeName }"
		@click="colorMode.preference = themeName"
	>
		<Icon :name="themeData.icon" />
	</button>
</div>
</template>

<style lang="scss" scoped>
.theme-toggle {
	display: flex;
	gap: 3px;
	width: fit-content;
	margin: 0 auto;
	padding: 2px;
	border: 1px solid var(--c-border);
	border-radius: 1rem;
	background-color: var(--c-bg-2);

	> button {
		padding: 4px 1rem;
		border-radius: 1rem;
		transition: all 0.1s;

		&:hover {
			background-color: var(--c-bg-soft);
			color: var(--c-text-1);
		}

		&.active {
			box-shadow: var(--box-shadow-2);
			background-color: var(--ld-bg-card);
			color: var(--c-text-1);
			cursor: auto;
		}
	}
}
</style>
