function joinWithBR(...strs: (string | undefined)[]): string {
    return strs.filter(str => str !== undefined && str.trim() !== '').join('<br />')
}

function getWordCount(str: string): number {
    return str.split(/\s+/).length
}

export {
    getWordCount,
    joinWithBR,
}
