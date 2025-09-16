<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
<ZRawLink class="zhilu-header">
	<div v-if="appConfig.header.emojiTail" class="emoji-tail">
		<span
			v-for="(emoji, emojiIndex) in appConfig.header.emojiTail"
			:key="emojiIndex"
			class="split-char"
			:style="{ '--delay': `${emojiIndex * .6 - 3}s` }"
			v-text="emoji"
		/>
	</div>
	<NuxtImg
		:src="appConfig.header.logo"
		class="zhilu-logo"
		:class="{ circle: appConfig.header.showTitle }"
		:alt="appConfig.title"
	/>
	<div v-if="appConfig.header.showTitle" class="zhilu-text">
		<div class="header-title">
			<span
				v-for="(char, charIndex) in appConfig.title"
				:key="charIndex"
				class="split-char"
				:style="{ '--delay': `${(charIndex + 1) * .1}s` }"
				v-text="char"
			/>
		</div>
		<div class="header-subtitle">
			{{ appConfig.header.subtitle }}
		</div>
	</div>
</ZRawLink>
</template>

<style lang="scss" scoped>
.zhilu-header {
	display: flex;
	align-items: center;
	gap: 0.5em;
	position: relative;
	margin: clamp(1rem, 2rem, 5vh) 1rem min(1rem, 5vh);
	line-height: 1.4;
	color: var(--c-text);
	user-select: none;
}

.zhilu-logo {
	height: 3em;

	&.circle {
		width: 3em;
		border-radius: 2em;
		box-shadow: 2px 4px 1rem var(--ld-shadow);
	}
}

@font-face {
	font-family: AlimamaFangYuanTi;
	src: url("/fonts/AlimamaFangYuanTi.woff2");
}

.header-title {
	font-family: AlimamaFangYuanTi, "Noto Sans SC", sans-serif;
	font-size: 1.5em;
	font-synthesis: none;
	font-variation-settings: "wght" 600, "BEVL" 100;

	> .split-char {
		animation: 3.14s infinite alternate vf-weight, 2.72s infinite alternate vf-bevel;
		animation-delay: var(--delay);
		animation-play-state: paused;
	}
}

.header-subtitle {
	opacity: 0.5;
	font-size: 0.8em;
}

@keyframes vf-weight {
	0% { font-weight: 600; }
	38.2% { font-weight: 300; }
	100% { font-weight: 900; }
}

@keyframes vf-bevel {
	from { font-variation-settings: "BEVL" 100; }
	to { font-variation-settings: "BEVL" 1; }
}

.emoji-tail {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
	align-content: center;
	justify-items: center;
	position: absolute;
	opacity: 0.2;
	inset: 0;
	font-size: 4rem;
	transition: opacity 1s;
	filter: blur(2px);
	pointer-events: none;
	z-index: -2;

	> .split-char {
		animation: 5s infinite alternate emoji-floating;
		animation-delay: var(--delay);
		animation-play-state: paused;
	}
}

.zhilu-header:hover {
	.emoji-tail {
		opacity: 0.5;
	}

	.split-char {
		animation-play-state: running;
	}
}

@keyframes emoji-floating {
	50% {
		transform: translate(-12px, -4px) scale(1.2);
		filter: blur(4px);
	}

	100% {
		transform: translate(-4px, -12px) scale(0.9);
		filter: blur(1px);
	}
}
</style>
