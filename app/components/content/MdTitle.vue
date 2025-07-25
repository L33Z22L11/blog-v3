<template>
<div class="md-title">
	<slot />
</div>
</template>

<style lang="scss" scoped>
.md-title {
	margin: 0.5em 0;
	font-size: 1.1em;
	font-weight: bold;

	&::before {
		content: "#";
		position: absolute;
		opacity: 0;
		font-size: 0.8em;
		transform: translate(-0.9em, 0.3em);
		transition: opacity 0.2s;
	}

	&:hover::before {
		opacity: 0.5;
	}
}
</style>
