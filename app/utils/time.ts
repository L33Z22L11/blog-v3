function timeElapse(date: Date, maxDepth = 2) {
    const msecPast = Date.now() - date.getTime()
    const intervals = [
        { label: '年', msec: 1000 * 60 * 60 * 24 * 365.2422 },
        { label: '个月', msec: 1000 * 60 * 60 * 24 * 30.44 },
        { label: '天', msec: 1000 * 60 * 60 * 24 },
        { label: '小时', msec: 1000 * 60 * 60 },
        { label: '分钟', msec: 1000 * 60 },
        { label: '秒', msec: 1000 },
    ]
    let timeString = ''
    let msecRemained = msecPast
    for (const interval of intervals) {
        const count = Math.floor(msecRemained / interval.msec)
        if (count >= 1) {
            timeString += `${count}${interval.label}`
            msecRemained -= count * interval.msec
            if (--maxDepth <= 0)
                break
        }
    }
    return timeString || '刚刚'
}

function isSameYear(date1: string | Date, date2: string | Date) {
    return new Date(date1).getFullYear() === new Date(date2).getFullYear()
}

export {
    isSameYear,
    timeElapse,
}
