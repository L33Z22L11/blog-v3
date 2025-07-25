<script setup lang="ts">
defineProps<{
	title?: string
	card?: boolean
	contentClass?: string
}>()
</script>

<template>
<section class="widget">
	<header class="widget-title text-creative">
		<slot name="title">
			{{ title }}
		</slot>
	</header>

	<main :class="[contentClass, { 'widget-card': card }]">
		<slot />
	</main>
</section>
</template>

<style lang="scss" scoped>
.widget {
	font-size: 0.9em;

	& + .widget {
		margin-top: 1rem;
	}

	> .widget-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin: 0.5rem;
		color: var(--c-text-2);

		a {
			transition: color 0.2s;
		}

		> [onclick]:hover, > [href]:hover {
			color: var(--c-primary);
		}
	}

	> .widget-card {
		padding: 0.2rem 0.8rem;
		border-radius: 0.8rem;
		background-color: var(--c-bg-2);

		:deep(:where(p, li)) {
			margin: 0.5em 0;
		}
	}
}
</style>
