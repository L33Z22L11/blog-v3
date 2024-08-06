function getMainDomain(url: string): string | null {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i)
    return match ? match[1].split('.').slice(-2).join('.') : null
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
    return !!url?.match(':')
}

export {
    getMainDomain,
    getDomainType,
    isExtLink,
}
