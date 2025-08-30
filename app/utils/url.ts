import { readFileSync, writeFileSync } from 'node:fs'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

/**
 * URL 相关工具函数
 * 包含CRC16哈希生成、YAML解析、文件写入等功能
 */

/**
 * CRC16算法实现（CRC16-ANSI，多项式0xA001）
 * @param data 输入字符串
 * @returns CRC16哈希值
 */
export function calculateCRC16(data: string): number {
    const bytes = Buffer.from(data, 'utf8')
    let crc = 0xFFFF

    for (let i = 0; i < bytes.length; i++) {
        crc ^= bytes[i]!
        for (let j = 0; j < 8; j++) {
            if (crc & 1) {
                crc = (crc >> 1) ^ 0xA001
            } else {
                crc = crc >> 1
            }
        }
    }

    return crc & 0xFFFF
}

/**
 * 根据日期生成4位CRC16哈希值短链
 * @param dateStr 日期字符串
 * @returns 4位十六进制哈希值
 */
export function generateHashFromDate(dateStr: string): string {
    if (!dateStr) {
        dateStr = new Date().toISOString()
    }
    const normalizedDate = new Date(dateStr).toISOString()
    const crc16 = calculateCRC16(normalizedDate)
    const hexHash = crc16.toString(16).padStart(4, '0')
    return hexHash
}

/**
 * 解析YAML front matter
 * 使用unplugin-yaml库进行YAML解析，确保兼容性和准确性
 * @param content 文件内容
 * @returns 解析结果
 */
export function parseFrontMatter(content: string) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontMatterRegex)

    if (!match) {
        return { data: {}, content, hasFrontMatter: false }
    }

    const yamlContent = match[1]!
    const markdownContent = match[2]!

    try {
        const data = parseYaml(yamlContent) || {}
        return {
            data,
            content: markdownContent,
            hasFrontMatter: true
        }
    } catch (error) {
        console.warn(`YAML 解析错误: ${(error as Error).message}`)
        return {
            data: {},
            content: markdownContent,
            hasFrontMatter: true,
            parseError: (error as Error).message
        }
    }
}

/**
 * 序列化YAML front matter
 * 使用unplugin-yaml库进行YAML序列化，保持简洁的数组格式
 * @param data front matter数据对象
 * @param content markdown内容
 * @returns 完整的文件内容
 */
export function stringifyFrontMatter(data: Record<string, any>, content: string): string {
    if (!data || Object.keys(data).length === 0) {
        return content
    }

    try {
        // 使用默认配置进行序列化
        let yamlContent = stringifyYaml(data)

        // 后处理：将简单的多行数组转回内联格式
        yamlContent = yamlContent.replace(
            /^(\w+):\n  - (.+)$/gm,
            (match, key, value) => {
                // 只对简单字符串值的单项数组进行转换
                if (!value.includes(':') && !value.includes('\n') && value.trim()) {
                    return `${key}: [${value}]`
                }
                return match
            }
        )

        return `---\n${yamlContent}---\n\n${content}`
    } catch (error) {
        console.warn(`YAML 序列化错误: ${(error as Error).message}`)
        return content
    }
}

/**
 * 写入URL到文件的front matter
 * @param filePath 文件路径
 * @param url URL值
 * @param shouldUpdate 是否强制更新
 */
export function writeUrlToFile(filePath: string, url: string, shouldUpdate: boolean = false): void {
    try {
        const content = readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 如果已经有URL字段且不需要更新，静默跳过
        if (parsed.data.url && !shouldUpdate) {
            return
        }

        // 添加或更新URL字段
        parsed.data.url = url

        // 重新组装文件内容
        const newContent = parsed.hasFrontMatter
            ? stringifyFrontMatter(parsed.data, parsed.content!)
            : stringifyFrontMatter({ url }, content)

        // 写回文件
        writeFileSync(filePath, newContent, 'utf8')
        console.log(`[Auto Hash URL] 已写入文件: ${filePath} -> ${url}`)
    } catch (error) {
        console.error(`[Auto Hash URL] 写入文件失败 ${filePath}:`, error)
    }
}

/**
 * 处理内容文件的URL生成逻辑
 * @param ctx Nuxt Content的文件上下文
 * @param hideContentPrefixes 需要隐藏的内容前缀
 */
export function processContentUrl(ctx: any, hideContentPrefixes: string[]): void {
    // 如果有date字段，生成哈希短链
    if (ctx.content.date) {
        // 根据文件路径确定是 posts 还是 previews
        const isPreview = ctx.file.path.includes('/previews/') || ctx.file.path.includes('\\previews\\')
        const pathPrefix = isPreview ? '/previews' : '/posts'

        // 如果已有URL字段，优先使用用户自定义的URL，不再重新生成
        if (ctx.content.url) {
            ctx.content.path = `${pathPrefix}/${ctx.content.url}`
            return
        }

        // 没有URL字段，生成新的哈希短链
        const hashUrl = generateHashFromDate(ctx.content.date)
        ctx.content.url = hashUrl
        ctx.content.path = `${pathPrefix}/${hashUrl}`
        console.log(`[Auto Hash URL] Generated: ${ctx.file.path} -> ${hashUrl} (${isPreview ? 'preview' : 'post'})`)

        // 将URL写入文件（只在新生成时写入）
        setTimeout(() => {
            writeUrlToFile(ctx.file.path, hashUrl)
        }, 100)
        return
    }

    // 如果有URL字段但没有date字段，使用现有URL
    if (ctx.content.url) {
        // 根据文件路径确定是 posts 还是 previews
        const isPreview = ctx.file.path.includes('/previews/') || ctx.file.path.includes('\\previews\\')
        const pathPrefix = isPreview ? '/previews' : '/posts'
        ctx.content.path = `${pathPrefix}/${ctx.content.url}`
        return
    }

    // 在 URL 中隐藏指定目录前缀的路径
    for (const prefix of hideContentPrefixes) {
        const realPath = ctx.content.path as string
        if (realPath.startsWith(prefix)) {
            ctx.content.original_dir = prefix
            ctx.content.path = realPath.replace(prefix, '')
        }
    }
}