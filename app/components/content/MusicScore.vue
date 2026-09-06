<script setup lang="ts">
import type { AbcVisualParams, SynthObjectController, SynthVisualOptions, TuneObject } from 'abcjs'

const props = defineProps<{
	abc: string
}>()

const container = useTemplateRef('abcjs-container')
const synthController = useTemplateRef('synth-controller')

const tuneObj = ref<TuneObject>()
const synthObjController = ref<SynthObjectController>()

const abcVisualParams: AbcVisualParams = {
	responsive: 'resize',
}

const synthVisualOptions: SynthVisualOptions = {
	displayLoop: true,
	displayRestart: true,
	displayPlay: true,
	displayProgress: true,
	displayWarp: true,
}

async function checkSoundFonts() {
	try {
		const res = await fetch('https://paulrosen.github.io/midi-js-soundfonts/', { method: 'HEAD' })
		return res.ok
	}
	catch (e) {
		console.error('[music-abc] 无法连接 SoundFonts，不启用播放能力\n', e)
		return false
	}
}

onMounted(async () => {
	const { renderAbc, synth } = await import('abcjs')

	tuneObj.value = renderAbc(container.value!, props.abc, abcVisualParams)[0]

	if (!synth.supportsAudio() || !(await checkSoundFonts()))
		return

	synthObjController.value = new synth.SynthController()
	synthObjController.value.load(synthController.value!, null, synthVisualOptions)
	synthObjController.value.setTune(tuneObj.value, false)
})

onUnmounted(() => {
	synthObjController.value?.pause()
})
</script>

<template>
<div class="music-score">
	<div ref="abcjs-container" />
	<div ref="synth-controller" />
</div>
</template>

<style scoped>
.music-score {
	line-height: 1.4;
}
.music-score :deep(.abcjs-inline-audio) {
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.2em 0.5em;
	border-radius: 4px;
	background-color: var(--c-bg-2);
	font-size: 0.8em;
	font-variant-numeric: tabular-nums;
}
.music-score :deep(.abcjs-inline-audio).abcjs-disabled {
	opacity: 0.5;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-btn {
	width: 1em;
	padding: 0.2em;
	box-sizing: content-box;
	background: none;
	line-height: 1;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-btn > svg {
	display: block;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-btn:hover, .music-score :deep(.abcjs-inline-audio) > .abcjs-btn.abcjs-pushed {
	color: var(--c-primary);
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-btn g {
	fill: currentcolor;
	stroke: currentcolor;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-midi-start > .abcjs-pause-svg, .music-score :deep(.abcjs-inline-audio) > .abcjs-midi-start > .abcjs-loading-svg {
	display: none;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-midi-start.abcjs-pushed > .abcjs-play-svg, .music-score :deep(.abcjs-inline-audio) > .abcjs-midi-start.abcjs-loading > .abcjs-play-svg {
	display: none;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-midi-start.abcjs-pushed .abcjs-pause-svg {
	display: block;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-midi-progress-background, .music-score :deep(.abcjs-inline-audio) .abcjs-midi-progress-indicator {
	border: 8px solid transparent;
	border-radius: 12px;
	box-sizing: content-box;
	background-clip: padding-box;
}
.music-score :deep(.abcjs-inline-audio) > .abcjs-midi-progress-background {
	flex-grow: 1;
	position: relative;
	height: 4px;
	background-color: var(--c-bg-soft);
}
.music-score :deep(.abcjs-inline-audio) .abcjs-midi-progress-indicator {
	position: absolute;
	top: -10px;
	width: 8px;
	height: 8px;
	margin-left: -10px;
	background-color: var(--c-text-1);
}
.music-score :deep(.abcjs-inline-audio) .abcjs-midi-clock {
	display: inline-block;
}
.music-score :deep(.abcjs-inline-audio) .abcjs-tempo-wrapper {
	display: flex;
	align-items: center;
}
.music-score :deep(.abcjs-inline-audio) input.abcjs-midi-tempo {
	position: relative;
	width: 3em;
	text-align: end;
}
.music-score :deep(.abcjs-inline-audio) .abcjs-loading .abcjs-loading-svg {
	display: inherit;
}
@keyframes abcjs-spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.music-score :deep(.abcjs-inline-audio) .abcjs-loading {
	outline: none;
	animation: abcjs-spin 1s linear infinite;
}
.music-score :deep(.abcjs-inline-audio) .abcjs-loading-svg circle {
	stroke: var(--c-text-1);
}
.music-score :deep(.abcjs-inline-audio) .abcjs-css-warning {
	display: none;
}
</style>
