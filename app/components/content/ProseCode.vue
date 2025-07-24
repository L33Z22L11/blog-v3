<template>
<code><slot /></code>
</template>

<style lang="scss" scoped>
code {
	padding: 0.1rem 0.3em;
	border-radius: 4px;
	outline: 1px solid var(--c-bg-soft);
	background-color: var(--c-bg-2);
	font-size: 0.875em;
	white-space: break-spaces;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		outline-color: color-mix(in srgb, currentcolor 15%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
	}
}
</style>
