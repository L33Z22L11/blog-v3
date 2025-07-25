<script setup lang="ts">
interface Repo {
	name: string
	description: string
	url: string
}
const route = useRoute()
const { data: post } = await useAsyncData(() => `githubcard-${route.path}`, () => queryCollection('content').path(route.path).first())
const repo = computed(() => post.value?.meta?.github as Repo | undefined)
</script>

<template>
<ZWidget title="GitHub 仓库">
	<ZRawLink v-if="repo" class="card" :to="repo.url">
		<div class="name">
			{{ repo.name }}
		</div>
		<div class="desc">
			{{ repo.description }}
		</div>
	</ZRawLink>
</ZWidget>
</template>

<style lang="scss" scoped>
.card {
	padding: 0.5rem 0.8rem;

	.name {
		margin: 0.2rem 0;
	}

	.desc {
		opacity: 0.8;
		font-size: 0.8rem;
	}
}
</style>
