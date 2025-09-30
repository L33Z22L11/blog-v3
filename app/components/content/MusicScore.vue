<script setup lang="ts">
import type { AbcVisualParams, SynthObjectController, SynthVisualOptions, TuneObject } from 'abcjs'
import { renderAbc, synth } from 'abcjs'

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

<style lang="scss" scoped>
.music-score {
	line-height: 1.4;

	:deep(.abcjs-inline-audio) {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.2em 0.5em;
		border-radius: 4px;
		background-color: var(--c-bg-2);
		font-size: 0.8em;
		font-variant-numeric: tabular-nums;

		&.abcjs-disabled {
			opacity: 0.5;
		}

		> .abcjs-btn {
			width: 1em;
			padding: 0.2em;
			box-sizing: content-box;
			background: none;
			line-height: 1;

			> svg {
				display: block;
			}

			&:hover, &.abcjs-pushed {
				color: var(--c-primary);
			}

			g {
				fill: currentcolor;
				stroke: currentcolor;
			}
		}

		> .abcjs-midi-start {
			> .abcjs-pause-svg, > .abcjs-loading-svg {
				display: none;
			}

			&.abcjs-pushed, &.abcjs-loading {
				> .abcjs-play-svg {
					display: none;
				}
			}

			&.abcjs-pushed .abcjs-pause-svg {
				display: block;
			}
		}

		> .abcjs-midi-progress-background, .abcjs-midi-progress-indicator {
			border: 8px solid transparent;
			border-radius: 12px;
			box-sizing: content-box;
			background-clip: padding-box;
		}

		> .abcjs-midi-progress-background {
			flex-grow: 1;
			position: relative;
			height: 4px;
			background-color: var(--c-bg-soft);
		}

		.abcjs-midi-progress-indicator {
			position: absolute;
			top: -10px;
			width: 8px;
			height: 8px;
			margin-left: -10px;
			background-color: var(--c-text-1);
		}

		.abcjs-midi-clock {
			display: inline-block;
		}

		.abcjs-tempo-wrapper {
			display: flex;
			align-items: center;
		}

		input.abcjs-midi-tempo {
			position: relative;
			width: 3em;
			text-align: end;
		}

		.abcjs-loading .abcjs-loading-svg {
			display: inherit;
		}

		.abcjs-loading {
			@keyframes abcjs-spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}

			outline: none;
			animation: abcjs-spin 1s linear infinite;
		}

		.abcjs-loading-svg circle {
			stroke: var(--c-text-1);
		}

		.abcjs-css-warning {
			display: none;
		}
	}
}
</style>
