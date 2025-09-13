<script lang="tsx" setup>
const slots = defineSlots<{
	default: () => VNode[]
}>()

function render() {
	const slotContent = slots.default()
	if (!slotContent)
		return <span>无会话内容</span>

	return slotContent.map((node: VNode) => {
		// WARN: 此处使用了非标准的 v-slot:default
		const textContent = (node.children as any)?.default?.()[0].children
		const body = <dd class="chat-body">{node}</dd>
		if (typeof textContent !== 'string')
			return body

		const match = textContent.match(/^\{(?<control>\.|:)?(?<caption>.*)\}$/)
		if (!match)
			return body

		const { caption, control } = match?.groups || {}
		const controlClass = control === '.' ? 'chat-myself' : control === ':' ? 'chat-system' : ''
		return <dt class={`chat-caption ${controlClass}`}>{caption}</dt>
	})
}
</script>

<template>
<dl class="chat">
	<render />
</dl>
</template>

<style lang="scss" scoped>
.chat {
	margin-inline: 2vw;
	font-size: 0.9em;
}

:deep() {
	.chat-caption {
		opacity: 0.8;
		font-size: 0.9em;
	}

	.chat-body {
		// BFC
		overflow: hidden;
		width: fit-content;
		max-width: 90%;
		margin-bottom: 1em;
		padding: 0 1em;
		border-radius: 1em;
		border-start-start-radius: 0.2em;
		background-color: var(--c-bg-2);
	}

	.chat-system {
		margin-bottom: 1em;
		text-align: center;
	}

	.chat-myself {
		text-align: end;

		& + .chat-body {
			width: fit-content;
			margin-inline-start: auto;
			border-radius: 1em;
			border-start-end-radius: 0.2em;
			background-color: var(--c-primary-soft);
		}
	}
}
</style>
