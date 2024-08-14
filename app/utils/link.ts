function getDomain(url: string) {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i)
    return match ? match[1] : url
}
function getMainDomain(url: string): string {
    const domain = getDomain(url)
    const parts = domain.split('.')
    if (parts.at(-1)?.length > 3)
        return parts.slice(-2).join('.')
    if (parts.at(-2).length <= 3) {
        return parts.slice(-3).join('.')
    }
    return parts.slice(-2).join('.')
}

function getDomainType(mainDomain: string): string | null {
    switch (mainDomain) {
        case 'github.io':
            return 'github'
        case 'thisis.host':
            return 'zhilu'
        default:
            return null
    }
}
function isExtLink(url: string | undefined): boolean {
    return !!url?.match?.(':')
}

export {
    getDomain,
    getMainDomain,
    getDomainType,
    isExtLink,
}
