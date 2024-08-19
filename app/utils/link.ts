export function getDomain(url: string) {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i)
    return match?.[1] ?? url
}
export function getMainDomain(url: string): string {
    const domain = getDomain(url)
    const parts = domain.split('.')
    const partLength = (partIndex: number) => parts.at(partIndex)?.length ?? 0
    if (partLength(-1) > 3)
        return parts.slice(-2).join('.')
    if (partLength(-2) <= 3) {
        return parts.slice(-3).join('.')
    }
    return parts.slice(-2).join('.')
}

export function getDomainType(mainDomain: string): string | null {
    switch (mainDomain) {
        case 'github.io':
            return 'github'
        case 'thisis.host':
            return 'zhilu'
        default:
            return null
    }
}
export function isExtLink(url: string | undefined): boolean {
    return Boolean(url?.match?.(':'))
}
