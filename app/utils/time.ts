import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function timeElapse(date: Date, maxDepth = 2) {
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

export function getPostTime(date: string) {
    const postDate = new Date(date)
    const now = new Date()
    if (postDate.getTime() > now.getTime() - 1000 * 60 * 60 * 24 * 7) {
        return formatDistanceToNow(postDate, { addSuffix: true, locale: zhCN })
    }
    else if (postDate.getFullYear() === now.getFullYear()) {
        return format(postDate, 'M月d日')
    }
    else {
        return format(postDate, 'yy年M月d日')
    }
}

export function isSameYear(date1: string | undefined, date2: string | undefined) {
    return new Date(date1 ?? 0).getFullYear() === new Date(date2 ?? 0).getFullYear()
}
