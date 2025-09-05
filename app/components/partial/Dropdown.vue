<!-- https://vue-tippy.netlify.app/props/ -->
<!-- 如果要点击触发，请使用 trigger="focusin" 而非 "click" -->

<template>
<Tooltip
	class="dropdown"
	interactive
	placement="bottom"
	:arrow="false"
	:hide-on-click="false"
	:offset="[0, 0]"
>
	<slot />
	<template #content="{ hide }">
		<slot name="content" :hide />
	</template>
</Tooltip>
</template>

<style lang="scss" scoped>
// https://vue-tippy.netlify.app/props#appendto
// Tooltip 位于组件根部时，interactive tippy 会插入到父组件
:deep() ~ [data-tippy-root] > .tippy-box {
	padding: 0.3em;
	font-size: inherit;

	&[data-placement="top"] {
		--c-fill: var(--c-bg-1);
	}
}

:deep() ~ [data-tippy-root] .tippy-content {
	display: grid;

	button {
		padding: 0.3em 0.5em;
		border-radius: 0.3em;
		text-align: start;
		color: var(--c-text-1);
		transition: color 0.1s, background-color 0.2s;
		cursor: pointer;

		&:hover {
			background-color: var(--c-bg-soft);
			color: var(--c-text-1);
		}

		&.active {
			background-color: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}
}
</style>
