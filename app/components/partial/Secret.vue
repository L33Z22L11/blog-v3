<template>
<!-- 外层元素用于占位 -->
<div class="secret-container">
	<div class="secret">
		<slot />
	</div>
</div>
</template>

<style lang="scss" scoped>
.secret {
	position: relative;
	opacity: 0;
	transition: all 0.2s var(--secret-delay, 0.5s), color 0.2s;
	z-index: -1;

	:hover > &,
	:focus-within > & {
		opacity: 1;
		z-index: 0;
	}
}
</style>
