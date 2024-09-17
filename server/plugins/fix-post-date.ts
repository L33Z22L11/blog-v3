import blogConfig from '~~/blog.config'
import { getTimezoneOffset } from 'date-fns-tz'

const timezoneOffset = getTimezoneOffset(blogConfig.timezone)

// TODO: 从 Git 提交记录中读取创建和修改时间作为缺省值

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        if (file.date)
            file.date = new Date(new Date(file.date).getTime() - timezoneOffset)
        if (file.updated)
            file.updated = new Date(new Date(file.updated).getTime() - timezoneOffset)
    })
})
