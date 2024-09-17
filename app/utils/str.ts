export function formatNumber(num: number) {
    const intervals = [
        { label: '万亿', threshold: 1e12 },
        { label: '亿', threshold: 1e8 },
        { label: '万', threshold: 1e4 },
    ]
    for (const interval of intervals) {
        if (num >= interval.threshold) {
            return `${(num / interval.threshold).toFixed(2)}${interval.label}`
        }
    }
    return num.toString()
}

export function joinWithBR(...strs: (string | undefined)[]) {
    return strs.filter(str => str?.trim()).join('<br>')
}
