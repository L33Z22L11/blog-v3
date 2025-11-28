<script setup lang="ts">
defineProps<{
	banner?: string
	mirror?: ImgService
	title: string
	description?: string
	link: string
}>()
</script>

<template>
<UtilLink :to="link" class="link-banner card" :title="joinWith([title, description, link])">
	<UtilImg v-if="banner" class="link-banner-bg" :src="banner" :mirror />
	<div class="link-banner-header" />
	<div class="link-banner-info">
		<div class="link-banner-title">
			{{ title }}
		</div>
		<div class="link-banner-desc">
			{{ description ?? getDomain(link) }}
		</div>
	</div>
</UtilLink>
</template>

<style lang="scss" scoped>
.link-banner {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	max-width: $breakpoint-phone;
	margin: 2rem auto;
	line-height: 1.4;

	.link-banner-bg {
		aspect-ratio: 2.4;
		margin-bottom: -5%;
		mask-image: linear-gradient(#FFF 50%, transparent);
		object-fit: cover;
	}

	.link-banner-info {
		padding: 0.5em 1em;
	}

	.link-banner-title {
		font-size: 1.2em;
		color: var(--c-text);
	}

	.link-banner-desc {
		margin-top: 0.5em;
		font-size: 0.8em;
		color: var(--c-text-2);
	}
}
</style>
