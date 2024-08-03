export function isExtLink(url: string | undefined): boolean {
    return !!url?.match(':')
}
