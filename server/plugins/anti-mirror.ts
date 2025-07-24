import { minify } from 'terser'
import blogConfig from '~~/blog.config'

/** 通过 Google Search Console 检索到的恶意反代域名 */
const encodedBlacklist = [
	'dgjlx.com', // blog.revincx.icu
	'dgvhqt.com', // blog.zhilu.cyou
	'hcmsla.com', // thyuu.com
	'wmlop.com', // xaoxuu.com
	'yswjxs.com', // blog.zhilu.cyou
].map(btoa)

const encodedOfficial = btoa(new URL(blogConfig.url).host)

function handleMirror(sourcesEncoded: string[], targetEncoded: string) {
	const sources = sourcesEncoded.map(atob)
	const target = atob(targetEncoded)
	const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
	const isBadMirror = sources.some(domain => location.hostname.endsWith(domain))
	if (isBadMirror) {
		if (canonical)
			canonical.href = canonical.href.replace(location.host, target)
		location.host = target
	}
}

async function toIifeString(fn: (...args: any[]) => void, ...args: any[]) {
	const fnString = fn.toString()
	const argsString = JSON.stringify(args).slice(1, -1)
	const minified = await minify(`(${fnString})(${argsString})`)
	return minified.code
}

export default defineNitroPlugin(async (nitroApp) => {
	const script = await toIifeString(handleMirror, encodedBlacklist, encodedOfficial)
	nitroApp.hooks.hook('render:html', (html) => {
		html.head.push(`<script>${script}</script>`)
	})
})
