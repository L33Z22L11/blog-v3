const promptLanguageMap = {
    '$': 'sh',
    '#': 'sh',
    'CMD': 'bat',
    'PS': 'powershell',
}

type PromptLanguage = keyof typeof promptLanguageMap

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

export function getPromptLanguage(prompt?: string) {
    const match = prompt?.trim().match(/^[a-z]+/i)
    if (!prompt || !match)
        return 'plaintext'
    return promptLanguageMap[match[0] as PromptLanguage]
}

export function joinWithBR(...strs: (string | undefined)[]) {
    return strs.filter(str => str?.trim()).join('<br>')
}
