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
    const appConfig = useAppConfig()

    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        // 修复时区偏移
        file.date = fixDate(file.date)
        file.updated = fixDate(file.updated)
        file.published = fixDate(file.published)

        // 在 URL 中隐藏指定目录的路径
        for (const prefix of blogConfig.hideContentPrefixes) {
            if (file._path?.startsWith(prefix)) {
                file._original_dir = prefix
                file._path = file._path.replace(prefix, '')
            }
        }

        // 修复文章分类
        if (!file.categories?.[0]) {
            file.categories = [appConfig.article.uncategorizedLabel]
        }
    })
})
