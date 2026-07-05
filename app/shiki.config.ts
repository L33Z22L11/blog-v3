import { defineConfig } from '#shiki/config'

export default defineConfig({
	themes: {
		light: () => import('shiki/themes/catppuccin-latte.mjs'),
		dark: () => import('shiki/themes/one-dark-pro.mjs'),
	},
})
