<template>
<div class="card-list">
	<slot />
</div>
</template>

<style lang="scss" scoped>
:deep() {
	:where(ol, ul):not([class]) {
		margin: 0;
		padding-inline-start: 0;
		list-style: none;

		>li {
			margin: 0;
		}
	}

	>ol, >ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.5em;

		>li {
			padding: 0.5em 0.8em;
			border-radius: 0.5em;
			box-shadow: 0 2px 4px var(--ld-shadow);
			background-color: var(--ld-bg-card);
		}
	}
}
</style>
