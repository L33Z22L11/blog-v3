<script lang="tsx" setup>
const slots = defineSlots<{
	default: () => VNode[]
}>()

const chatRegex = /^\{(?<control>\.|:)?(?<caption>.*)\}$/

function getControlClass(control?: string) {
	if (control === '.')
		return 'chat-myself'
	if (control === ':')
		return 'chat-system'
	return ''
}

function render() {
	const slotContent = slots.default()
	if (!slotContent)
		return <span>无会话内容</span>

	return slotContent.map((node: VNode) => {
		// WARN: 此处使用了非标准的 v-slot:default
		const textContent = (node.children as any)?.default?.()[0].children
		const matchGroups = typeof textContent === 'string'
			? textContent.match(chatRegex)?.groups
			: undefined
		return matchGroups
			? <dt class={`chat-caption ${getControlClass(matchGroups.control)}`}>{matchGroups.caption}</dt>
			: <dd class="chat-body">{node}</dd>
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
		overflow: hidden; // BFC
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
			margin-inline-start: auto;
			border-radius: 1em;
			border-start-end-radius: 0.2em;
			background-color: var(--c-primary-soft);
		}
	}
}
</style>
