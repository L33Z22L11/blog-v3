<script setup lang="tsx">
import type { TippyComponent } from 'vue-tippy'

const appConfig = useAppConfig()

const commentEl = useTemplateRef('comment')
const popoverEl = useTemplateRef<TippyComponent>('popover')
const popoverJumpTo = ref('')

const popoverBind = ref<TippyComponent['$props']>({})

useEventListener(commentEl, 'click', (e) => {
	if (!(e.target instanceof HTMLElement))
		return

	if (e.target.classList.contains('tk-avatar-img')) {
		e.stopPropagation()
		return
	}

	const popoverTarget = e.target instanceof HTMLAnchorElement
		? e.target
		: e.target.parentElement instanceof HTMLAnchorElement
			? e.target.parentElement
			: null

	if (popoverTarget?.target === '_blank') {
		popoverEl.value?.hide()

		popoverJumpTo.value = popoverTarget.href
		popoverBind.value = {
			getReferenceClientRect: () => popoverTarget.getBoundingClientRect(),
			triggerTarget: popoverTarget,
		}

		popoverEl.value?.show()
		e.preventDefault()
	}
}, { capture: true })

function confirmOpen(url: string) {
	window.open(url, '_blank')
}

onMounted(() => {
	window.twikoo?.init?.({
		envId: appConfig.twikoo?.envId,
		// twikoo 会把挂载后的元素变为 #twikoo
		el: '#twikoo',
	})
})
</script>

<template>
<section ref="comment" class="z-comment">
	<h3 class="text-creative">
		评论区
	</h3>

	<!-- interactive 默认会把气泡移动到 triggerTarget 的父元素上 -->
	<Tooltip
		ref="popover"
		v-bind="popoverBind"
		:append-to="() => commentEl"
		interactive
		trigger="focusin"
	>
		<template #content>
			<div class="popover-confirm">
				{{ safelyDecodeUriComponent(popoverJumpTo) }}
				<ZButton
					primary
					text="访问"
					@click="confirmOpen(popoverJumpTo)"
				/>
			</div>
		</template>
	</Tooltip>

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

.popover-confirm {
	display: flex;
	align-items: center;
	overflow-wrap: anywhere;

	> .button {
		align-self: stretch;
		margin: -0.3em -0.6em;
		border-radius: 0 0.5em 0.5em 0;
		margin-inline-start: 0.5em;
	}
}

:deep(#twikoo) {
	margin: 2em 0;

	.tk-admin-container {
		position: fixed;
		z-index: calc(var(--z-index-popover) + 1);
	}

	.tk-input {
		font-family: var(--font-monospace);
	}

	.tk-avatar {
		border-radius: 50%;

		@supports (corner-shape: squircle) {
			corner-shape: superellipse(1.2);
		}

		&.tk-clickable {
			cursor: auto;
		}
	}

	.tk-time {
		color: var(--c-text-3);
	}

	.tk-content {
		margin-top: 0;
	}

	.tk-comments-title, .tk-nick > strong {
		font-family: var(--font-creative);
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

	.tippy-svg-arrow > svg {
		fill: inherit;
		width: auto;
		height: auto;
	}
}

:deep(:where(.tk-preview-container,.tk-content)) {
	pre {
		overflow: auto;
		border-radius: 0.5rem;
		font-size: 0.8125rem;
	}

	p {
		margin: 0.2em 0;
	}

	img {
		border-radius: 0.5em;
	}

	menu, ol, ul {
		margin: 0.5em 0;
		padding-inline-start: 1.5em;
		font-size: 0.9rem;
		list-style: revert;

		> li {
			margin: 0.2em 0;

			&::marker {
				color: var(--c-primary);
			}
		}
	}

	blockquote {
		margin: 0.5em 0;
		padding: 0.2em 0.5em;
		border-inline-start: 4px solid var(--c-border);
		border-radius: 4px;
		background-color: var(--c-bg-2);
		font-size: 0.9rem;
	}
}
</style>
