/* eslint-disable no-console */
import { homepage, name, version } from '~~/package.json'

// https://nuxt.com/docs/4.x/api/advanced/import-meta#the-importmeta-object
if (import.meta.server) {
	console.info(`
========================
${name} ${version}
${homepage}
========================
`)
}

if (import.meta.client && import.meta.dev) {
	// 开发环境禁用 Umami 统计
	localStorage.setItem('umami.disabled', 'true')
}

export default defineNuxtPlugin(() => { })
