import { getTimezoneOffset } from 'date-fns-tz'
import blogConfig from '~~/blog.config'

const timezoneOffset = getTimezoneOffset(blogConfig.timezone) + new Date().getTimezoneOffset() * 60 * 1000

function fixDate(date?: string | Date) {
    if (!date)
        return date

    if (typeof date === 'string')
        date = new Date(date)

    return new Date(date.getTime() - timezoneOffset)
}

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        file.date = fixDate(file.date)
        file.updated = fixDate(file.updated)
        file.published = fixDate(file.published)
    })
})
