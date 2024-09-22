export const domainType: { [domain: string]: DomainType } = {
    'github.io': { icon: 'simple-icons:github', tip: 'GitHub Pages 域名' },
    'netlify.app': { icon: 'simple-icons:netlify', tip: 'Netlify 域名' },
    'pages.dev': { icon: 'simple-icons:cloudflare', tip: 'Cloudflare 域名' },
    'thisis.host': { icon: 'ph:star-four-fill', tip: '纸鹿提供的域名' },
    'vercel.app': { icon: 'simple-icons:vercel', tip: 'Vercel 域名' },
    'zabaur.app': { icon: 'tabler:square-letter-z-filled', tip: 'Zebaur 域名' },
}

interface DomainType {
    icon: string
    tip: string
}

const noRouterExtensions = ['.css', '.csv', '.gif', '.ico', '.jpg', '.js', '.json', '.png', '.svg', '.txt', '.xml']

export function getDomain(url: string) {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i)
    return match?.[1] ?? url
}
export function getMainDomain(url: string) {
    const domain = getDomain(url)
    const parts = domain.split('.')
    const getPartLength = (partIndex: number) => {
        // Array.prototype.at() -> Chrome 92+
        const seg = parts.length
        return parts[(partIndex % seg + seg) % seg]?.length ?? 0
    }
    if (getPartLength(-1) > 3)
        return parts.slice(-2).join('.')
    if (getPartLength(-2) <= 3) {
        return parts.slice(-3).join('.')
    }
    return parts.slice(-2).join('.')
}

export function getDomainType(mainDomain: string) {
    return domainType[mainDomain]
}
export function isExtLink(url?: string) {
    if (!url)
        return false

    return url.includes(':')
        || noRouterExtensions.some(ext => url.endsWith(ext))
}
