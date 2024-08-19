export function joinWithBR(...strs: (string | undefined)[]): string {
    return strs.filter(str => str?.trim()).join('<br />')
}

export function getWordCount(str: string): number {
    throw new Error('Not implemented')
    return str.split(/\s+/).length
}
