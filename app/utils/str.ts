function joinWithBR(...strs: (string | undefined)[]): string {
    return strs.filter(str => str !== undefined && str.trim() !== '').join('<br />')
}

export {
    joinWithBR,
}
