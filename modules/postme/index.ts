import { defineNuxtModule } from 'nuxt/kit'
import { article } from '../../packages/postme/src'

export default defineNuxtModule({
	meta: {
		name: 'postme',
	},
	setup(options, nuxt) {
		article.build()
		if (nuxt.options.dev) {
			const dispose = article.watch()
			nuxt.hook('close', async () => {
				await dispose()
			})
		}
	},
})
