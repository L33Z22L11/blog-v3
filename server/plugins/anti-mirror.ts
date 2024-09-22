import blogConfig from '~~/blog.config'
import { minify } from 'terser'

const encodedBlacklist = [
    'dgvhqt.com',
].map(btoa)

const encodedOfficial = btoa(new URL(blogConfig.url).hostname)

// TODO: 恢复 <link rel="canonical"> 标签内容
function redirect(sourcesEncoded: string[], targetEncoded: string) {
    const sources = sourcesEncoded.map(atob)
    const target = atob(targetEncoded)
    const shouldRedirect = sources.some(
        domain => location.hostname.endsWith(domain),
    )
    if (shouldRedirect)
        location.href = location.href.replace(location.hostname, target)
}

async function toIIFEString(fn: (...args: any[]) => void, ...args: any[]) {
    const fnString = fn.toString()
    const argsString = JSON.stringify(args).slice(1, -1)
    const minified = await minify(`(${fnString})(${argsString})`)
    return minified.code
}

export default defineNitroPlugin(async (nitroApp) => {
    const script = await toIIFEString(redirect, encodedBlacklist, encodedOfficial)
    nitroApp.hooks.hook('render:html', (html) => {
        html.head.push(`<script>${script}</script>`)
    })
})
