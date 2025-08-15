<script setup lang="ts">
const appConfig = useAppConfig()

onMounted(() => {
	// @ts-expect-error windows上有twikoo实例
	window.twikoo?.init?.({
		envId: appConfig.twikoo?.envId,
		// twikoo 会把挂载后的元素变为 #twikoo
		el: '#twikoo',
	})
})
</script>

<template>
<section class="z-comment">
	<h3 class="text-creative">
		评论区
	</h3>
	<div id="twikoo">
		<p>评论加载中...</p>
	</div>
</section>
</template>

<style lang="scss" scoped>
.z-comment {
	margin: 3rem 1rem;

	> h3 {
		margin-top: 3rem;
		font-size: 1.25rem;
	}
}

:deep(#twikoo) {
	margin: 2em 0;

	.tk-admin-container {
		position: fixed;
		z-index: 1;
	}

	.tk-input {
		font-family: var(--font-monospace);
	}

	.tk-time {
		color: var(--c-text-3);
	}

	.tk-main {
		margin-top: -0.1rem;
	}

	.tk-content {
		margin-top: 0.1rem;

		img {
			border-radius: 0.5em;
		}
	}

	.tk-comments-title, .tk-nick > strong {
		font-family: var(--font-creative);
	}

	pre {
		border-radius: 0.5rem;
		font-size: 0.8125rem;
	}

	p {
		margin: 0.2em 0;
	}

	menu, ol, ul {
		margin: 0.5em 0;
		padding: 0 0 0 1.5em;
		list-style: revert;

		> li {
			margin: 0.2em 0;

			&::marker {
				font-size: 0.8em;
				color: var(--c-primary);
			}
		}
	}

	blockquote {
		margin: 0.5em 0;
		padding: 0.2em 0.5em;
		border-left: 4px solid var(--c-border);
		border-radius: 4px;
		background-color: var(--c-bg-2);
		font-size: 0.9rem;

		> .z-codeblock {
			margin: 0 -0.8rem;
		}
	}

	.tk-owo-emotion {
		width: auto;
		height: 1.4em;
		vertical-align: text-bottom;
	}

	.tk-extras, .tk-footer {
		font-size: 0.7rem;
		color: var(--c-text-3);
	}

	.tk-replies:not(.tk-replies-expand) {
		mask-image: linear-gradient(#FFF 50%, transparent);
	}

	.tk-expand {
		border-radius: 0.5rem;
		transition: background-color 0.1s;
	}
}
</style>
