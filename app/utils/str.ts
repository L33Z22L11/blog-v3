export function joinWithBR(...strs: (string | undefined)[]): string {
    return strs.filter(str => str?.trim()).join('<br>')
}

export function getWordCount(str: string): number {
    // TODO: 文章字数统计，全站字数统计
    throw new Error('Not implemented')
    return str.split(/\s+/).length
}
