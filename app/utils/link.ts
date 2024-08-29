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
    switch (mainDomain) {
        case 'github.io':
            return 'github'
        case 'thisis.host':
            return 'zhilu'
        default:
            return null
    }
}
export function isExtLink(url?: string) {
    return Boolean(url?.match?.(':'))
}
