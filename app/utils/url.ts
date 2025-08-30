import { readFileSync, writeFileSync } from 'node:fs'

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
 * 使用更成熟的解析方式，正确处理注释和复杂数据类型
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
    const data: Record<string, any> = {}

    // 使用更成熟的逐行解析方式，能够正确处理各种 YAML 格式
    const lines = yamlContent.split('\n')
    let currentKey: string | null = null
    let currentValue: any = null
    let isMultilineValue = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!
        const trimmed = line.trim()

        // 跳过空行
        if (!trimmed) {
            continue
        }

        // 处理注释行：识别注释形式的字段
        if (trimmed.startsWith('#')) {
            const commentMatch = trimmed.match(/^#\s*([^:]+):\s*(.*)$/)
            if (commentMatch) {
                const key = commentMatch[1]!.trim()
                const value = commentMatch[2]!.trim()
                // 保存注释字段，用特殊前缀标记
                data[`_comment_${key}`] = value
            }
            continue
        }

        // 处理常规键值对
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex === -1) {
            // 可能是多行值的继续行
            if (isMultilineValue && currentKey) {
                if (Array.isArray(currentValue)) {
                    // 数组的多行元素
                    if (trimmed.startsWith('-')) {
                        currentValue.push(trimmed.substring(1).trim())
                    }
                } else {
                    // 字符串的多行值
                    currentValue += ' ' + trimmed
                }
            }
            continue
        }

        // 完成上一个键值对的处理
        if (currentKey && currentValue !== null) {
            data[currentKey] = currentValue
        }

        // 解析新的键值对
        const key = trimmed.substring(0, colonIndex).trim()
        let valueStr = trimmed.substring(colonIndex + 1).trim()

        currentKey = key
        isMultilineValue = false

        // 解析值的类型
        if (!valueStr) {
            // 空值，可能是多行值的开始
            currentValue = ''
            isMultilineValue = true
        } else if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
            // 数组格式：[item1, item2, item3]
            const arrayContent = valueStr.slice(1, -1).trim()
            if (arrayContent) {
                currentValue = arrayContent.split(',').map(item => {
                    const trimmedItem = item.trim()
                    // 移除引号
                    if ((trimmedItem.startsWith('"') && trimmedItem.endsWith('"')) ||
                        (trimmedItem.startsWith("'") && trimmedItem.endsWith("'"))) {
                        return trimmedItem.slice(1, -1)
                    }
                    return trimmedItem
                })
            } else {
                currentValue = []
            }
        } else if (valueStr.startsWith('[')) {
            // 多行数组的开始
            currentValue = []
            isMultilineValue = true
            // 处理同行的第一个元素
            const firstItem = valueStr.substring(1).trim()
            if (firstItem && !firstItem.startsWith(']')) {
                if (firstItem.endsWith(',')) {
                    currentValue.push(firstItem.slice(0, -1).trim())
                } else if (firstItem.endsWith(']')) {
                    currentValue.push(firstItem.slice(0, -1).trim())
                    isMultilineValue = false
                } else {
                    currentValue.push(firstItem)
                }
            }
        } else if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
            // 双引号字符串
            currentValue = valueStr.slice(1, -1)
        } else if (valueStr.startsWith("'") && valueStr.endsWith("'")) {
            // 单引号字符串
            currentValue = valueStr.slice(1, -1)
        } else if (valueStr === 'true') {
            currentValue = true
        } else if (valueStr === 'false') {
            currentValue = false
        } else if (valueStr === 'null' || valueStr === '~') {
            currentValue = null
        } else if (/^-?\d+$/.test(valueStr)) {
            // 整数
            currentValue = parseInt(valueStr, 10)
        } else if (/^-?\d*\.\d+$/.test(valueStr)) {
            // 浮点数
            currentValue = parseFloat(valueStr)
        } else if (valueStr.includes('\n') || (i + 1 < lines.length && !lines[i + 1]!.includes(':'))) {
            // 多行字符串
            currentValue = valueStr
            isMultilineValue = true
        } else {
            // 普通字符串
            currentValue = valueStr
        }
    }

    // 处理最后一个键值对
    if (currentKey && currentValue !== null) {
        data[currentKey] = currentValue
    }

    return { data, content: markdownContent, hasFrontMatter: true }
}

/**
 * 序列化YAML front matter
 * 正确处理注释字段，保持原有格式
 * @param data front matter数据对象
 * @param content markdown内容
 * @returns 完整的文件内容
 */
export function stringifyFrontMatter(data: Record<string, any>, content: string): string {
    let yamlContent = ''

    for (const [key, value] of Object.entries(data)) {
        // 处理注释字段
        if (key.startsWith('_comment_')) {
            const realKey = key.replace('_comment_', '')
            yamlContent += `# ${realKey}: ${value}\n`
            continue
        }

        // 处理普通字段
        if (Array.isArray(value)) {
            yamlContent += `${key}: [${value.join(', ')}]\n`
        } else if (typeof value === 'string') {
            yamlContent += `${key}: ${value}\n`
        } else {
            yamlContent += `${key}: ${value}\n`
        }
    }

    return `---\n${yamlContent}---\n\n${content}`
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

        // 如果已经有URL字段且不需要更新，不覆盖
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

        // 将URL写入文件
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