import { getTimezoneOffset } from 'date-fns-tz'
import blogConfig from '~~/blog.config'

const timezoneOffset = getTimezoneOffset(blogConfig.timezone) + new Date().getTimezoneOffset() * 60 * 1000

function fixDate(date?: string | Date) {
    if (!date)
        return date

    if (typeof date === 'string')
        date = new Date(date)

    // YAML Front Matter 中的日期为空时，MDC 插件会自动为下一行格式化出缩进，导致日期变为其他对象
    return new Date(date.getTime?.() - timezoneOffset)
}

export default defineNitroPlugin((nitroApp) => {
    const appConfig = useAppConfig()

    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        // YAML Front Matter 会自动解析类型，但标题应当是字符串
        file.title = file.title?.toString()

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
