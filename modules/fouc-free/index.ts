import { defineNuxtModule } from 'nuxt/kit'
import { name } from '../../package.json'
import { toIifeString } from '../../shared/utils/function'
import instantCssVar from './runtime/client'

export default defineNuxtModule({
	meta: {
		name: 'fouc-free',
	},
	setup(options, nuxt) {
		(nuxt.options.app.head.script ??= []).push({
			innerHTML: toIifeString(instantCssVar, `${name}-preference`),
		})
	},
})
