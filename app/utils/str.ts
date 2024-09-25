const promptLanguageMap = {
    '$': 'sh',
    '#': 'sh',
    'CMD': 'bat',
    'PS': 'powershell',
}

export function formatNumber(num: number) {
    const intervals = [
        { label: '万亿', threshold: 1e12 },
        { label: '亿', threshold: 1e8 },
        { label: '万', threshold: 1e4 },
    ]
    for (const interval of intervals) {
        if (num >= interval.threshold)
            return `${(num / interval.threshold).toFixed(2)}${interval.label}`
    }
    return num.toString()
}

export function getPromptLanguage(prompt: string) {
    for (const promptPrefix in promptLanguageMap) {
        if (prompt.startsWith(promptPrefix))
            return Reflect.get(promptLanguageMap, promptPrefix)
    }
    return 'plaintext'
}

export function highlightHTML(text: string, word: string, className: string = 'highlight') {
    text = text.replace(/\n+/g, '<br>')
    const pattern = new RegExp(word, 'gi')
    const highlightedText = text.replace(pattern, matched =>
        `<span class="${className}">${matched}</span>`)
    return highlightedText
}

export function joinWithBR(...strs: (string | undefined)[]) {
    return strs.filter(str => str?.trim()).join('<br>')
}
