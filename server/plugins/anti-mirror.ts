import blogConfig from '~~/blog.config'
import { minify } from 'terser'

const encodedBlacklist = [
    'dgvhqt.com',
].map(btoa)

const encodedOfficial = btoa(new URL(blogConfig.url).host)

function handleMirror(sourcesEncoded: string[], targetEncoded: string) {
    const sources = sourcesEncoded.map(atob)
    const target = atob(targetEncoded)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const isBadMirror = sources.some(domain => location.hostname.endsWith(domain))
    if (isBadMirror) {
        location.host = target
        if (canonical)
            canonical.href = canonical.href.replace(location.host, target)
    }
}

async function toIIFEString(fn: (...args: any[]) => void, ...args: any[]) {
    const fnString = fn.toString()
    const argsString = JSON.stringify(args).slice(1, -1)
    const minified = await minify(`(${fnString})(${argsString})`)
    return minified.code
}

export default defineNitroPlugin(async (nitroApp) => {
    const script = await toIIFEString(handleMirror, encodedBlacklist, encodedOfficial)
    nitroApp.hooks.hook('render:html', (html) => {
        html.head.push(`<script>${script}</script>`)
    })
})
