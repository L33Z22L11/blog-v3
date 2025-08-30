#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 为所有文章添加url字段的脚本
 * 使用Node.js原生API，自动读取content/posts/目录下的所有md文件，
 * 提取文件名作为url字段写入front matter
 */

const postsDir = path.join(__dirname, '../content/posts')

// 递归获取所有md文件
function getAllMdFiles(dir) {
    const files = []

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir)

        for (const item of items) {
            const itemPath = path.join(currentDir, item)
            const stat = fs.statSync(itemPath)

            if (stat.isDirectory()) {
                traverse(itemPath)
            } else if (path.extname(item) === '.md') {
                files.push(itemPath)
            }
        }
    }

    traverse(dir)
    return files
}

// 从文件路径提取文件名（不含扩展名）
function getFileNameWithoutExt(filePath) {
    return path.basename(filePath, '.md')
}

// 解析YAML front matter（简单实现）
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontMatterRegex)

    if (!match) {
        return {
            data: {},
            content: content,
            hasFrontMatter: false
        }
    }

    const yamlContent = match[1]
    const markdownContent = match[2]

    // 简单解析YAML（仅支持基本格式）
    const data = {}
    const lines = yamlContent.split('\n')

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        const colonIndex = trimmed.indexOf(':')
        if (colonIndex === -1) continue

        const key = trimmed.substring(0, colonIndex).trim()
        let value = trimmed.substring(colonIndex + 1).trim()

        // 处理不同类型的值
        if (value.startsWith('[') && value.endsWith(']')) {
            // 数组格式：[item1, item2]
            value = value.slice(1, -1).split(',').map(item => item.trim())
        } else if (value.startsWith('"') && value.endsWith('"')) {
            // 字符串格式："string"
            value = value.slice(1, -1)
        } else if (value.startsWith("'") && value.endsWith("'")) {
            // 字符串格式：'string'
            value = value.slice(1, -1)
        } else if (value === 'true' || value === 'false') {
            // 布尔值
            value = value === 'true'
        } else if (!isNaN(value) && value !== '') {
            // 数字
            value = Number(value)
        }

        data[key] = value
    }

    return {
        data,
        content: markdownContent,
        hasFrontMatter: true
    }
}

// 序列化YAML front matter
function stringifyFrontMatter(data, content) {
    let yamlContent = ''

    for (const [key, value] of Object.entries(data)) {
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

// 更新单个文件的front matter
function updateFileUrl(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 提取文件名作为url
        const fileName = getFileNameWithoutExt(filePath)

        // 如果已经有url字段，跳过
        if (parsed.data.url) {
            console.log(`⏭️  跳过 ${path.relative(postsDir, filePath)} - 已有url字段: ${parsed.data.url}`)
            return false
        }

        // 添加url字段
        parsed.data.url = fileName

        // 重新组装文件内容
        let newContent
        if (parsed.hasFrontMatter) {
            newContent = stringifyFrontMatter(parsed.data, parsed.content)
        } else {
            // 如果原来没有front matter，创建一个新的
            newContent = stringifyFrontMatter({ url: fileName }, content)
        }

        // 写回文件
        fs.writeFileSync(filePath, newContent, 'utf8')

        console.log(`✅ 已更新 ${path.relative(postsDir, filePath)} - url: ${fileName}`)
        return true
    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
        return false
    }
}

// 主函数
function main() {
    console.log('🚀 开始为文章添加url字段...\n')

    // 检查posts目录是否存在
    if (!fs.existsSync(postsDir)) {
        console.error(`❌ 目录不存在: ${postsDir}`)
        process.exit(1)
    }

    // 获取所有md文件
    const mdFiles = getAllMdFiles(postsDir)

    if (mdFiles.length === 0) {
        console.log('📝 未找到任何md文件')
        return
    }

    console.log(`📁 找到 ${mdFiles.length} 个md文件\n`)

    let updatedCount = 0
    let skippedCount = 0

    // 处理每个文件
    mdFiles.forEach(filePath => {
        const updated = updateFileUrl(filePath)
        if (updated) {
            updatedCount++
        } else {
            skippedCount++
        }
    })

    console.log('\n📊 处理完成:')
    console.log(`✅ 已更新: ${updatedCount} 个文件`)
    console.log(`⏭️  已跳过: ${skippedCount} 个文件`)
    console.log(`📁 总计: ${mdFiles.length} 个文件`)
}

// 直接运行主函数
main()

export { getAllMdFiles, updateFileUrl, parseFrontMatter, stringifyFrontMatter }