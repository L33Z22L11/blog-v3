export function joinWithBR(...strs: (string | undefined)[]) {
    return strs.filter(str => str?.trim()).join('<br>')
}
