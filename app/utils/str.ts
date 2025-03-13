// @keep-sorted
const promptLanguageMap: Record<string, string> = {
    '#': 'sh',
    '$': 'sh',
    'CMD': 'bat',
    'PS': 'sh', // powershell 语言高亮有问题
}

export function formatNumber(num?: number) {
    if (typeof num !== 'number')
        return ''
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

export function getPromptLanguage(prompt: string | boolean) {
    if (typeof prompt === 'boolean')
        return 'plaintext'
    for (const promptPrefix in promptLanguageMap) {
        if (prompt.startsWith(promptPrefix))
            return promptLanguageMap[promptPrefix] ?? 'plaintext'
    }
    return 'plaintext'
}

export function highlightHtml(text: string, word: string, className: string = 'highlight') {
    const pattern = new RegExp(word, 'gi')
    const highlightedText = text
        .replace(pattern, matched => `<span class="${className}">${matched}</span>`)
        .replace(/\n+/g, '<br>')
    return highlightedText
}

export function removeHtmlTags(str?: string) {
    if (typeof str !== 'string')
        return ''
    return str.replace(/<[^>]+(>|$)/g, '')
}
