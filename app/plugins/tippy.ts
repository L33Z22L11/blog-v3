import type { directive, TippyComponent } from 'vue-tippy'
import VueTippy, { roundArrow } from 'vue-tippy'
import 'tippy.js/dist/svg-arrow.css'

declare module 'vue' {
	interface GlobalComponents {
		Tooltip: TippyComponent
	}
	interface GlobalDirectives {
		vTip: typeof directive
	}
}

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueTippy, {
		component: 'Tooltip',
		directive: 'tip',
		defaultProps: {
			arrow: roundArrow,
		},
	})
})
