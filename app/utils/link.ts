import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'

export const domainTip: Record<string, string> = {
    'github.io': 'GitHub Pages 域名',
    'netlify.app': 'Netlify 域名',
    'pages.dev': 'Cloudflare 域名',
    'thisis.host': '纸鹿提供的域名',
    'vercel.app': 'Vercel 域名',
    'zabaur.app': 'Zebaur 域名',
}

const noRouterExtensions = ['.css', '.csv', '.gif', '.ico', '.jpg', '.js', '.json', '.opml', '.png', '.svg', '.txt', '.xml']

export function getDomain(url: string) {
    const domain = fromUrl(url)
    if (typeof domain === 'symbol')
        return url
    else
        return domain
}
export function getMainDomain(url: string, useIcann?: boolean) {
    const hostname = getDomain(url)
    const parseResult = parseDomain(hostname)
    if (parseResult.type === ParseResultType.Listed) {
        const { domain, topLevelDomains } = useIcann ? parseResult.icann : parseResult
        return `${domain}.${topLevelDomains.join('.')}`
    }
    else {
        return hostname
    }
}

export function getDomainType(mainDomain: string) {
    return domainTip[mainDomain]
}

export function getGhUsername(url?: string) {
    if (!url)
        return ''
    const regex = /github\.com\/([a-zA-Z0-9-]+)(?:\/[^/]+)?(\/?)$/
    return url.match(regex)?.[1] ?? ''
}

export function isExtLink(url?: string) {
    if (!url)
        return false

    return url.includes(':')
        || noRouterExtensions.some(ext => url.endsWith(ext))
}
