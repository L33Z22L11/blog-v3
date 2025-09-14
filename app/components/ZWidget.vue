<script setup lang="ts">
defineProps<{
	title?: string
	card?: boolean
	dim?: boolean
	bgImg?: string
	bgRight?: boolean
}>()
</script>

<template>
<section class="widget" :class="{ dim }">
	<hgroup class="widget-title text-creative">
		<slot name="title">
			{{ title }}
		</slot>
	</hgroup>

	<div class="widget-body" :class="{ 'widget-card': card, 'with-bg': bgImg }">
		<NuxtImg v-if="bgImg" class="bg-img" :class="{ 'bg-right': bgRight }" :src="bgImg" alt="" />
		<slot />
	</div>
</section>
</template>

<style lang="scss" scoped>
.widget {
	font-size: 0.9em;

	.widget + & {
		margin-top: 1rem;
	}

	&.dim {
		opacity: 0.3;
		transition: opacity 0.2s;

		#z-aside:hover &, #z-aside.show & {
			opacity: 1;
		}
	}
}

.widget-title {
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

.widget-body {
	&.with-bg {
		position: relative;
		overflow: hidden;
		overflow: clip;
		z-index: 0;

		> .bg-img {
			position: absolute;
			opacity: 0.2;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			pointer-events: none;
			z-index: -1;

			&.bg-right {
				inset-inline-start: 50%;
				width: 50%;
				mask-image: linear-gradient(to var(--end), transparent, #FFF 50%);
			}
		}
	}

	&.widget-card {
		padding: 0.5rem 0.8rem;
		border-radius: 0.8rem;
		background-color: var(--c-bg-2);

		:deep(p) {
			padding: 0.2em 0;
		}
	}
}
</style>
