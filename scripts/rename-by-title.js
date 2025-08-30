#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 根据front matter中的title字段重命名md文件的脚本
 * 扫描content/posts/目录下的所有md文件，
 * 读取title字段并将文件重命名为title的值
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

// 解析YAML front matter（使用 unplugin-yaml）
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

    try {
        const data = parseYaml(yamlContent) || {}
        return {
            data,
            content: markdownContent,
            hasFrontMatter: true
        }
    } catch (error) {
        console.warn(`YAML 解析错误: ${error.message}`)
        return {
            data: {},
            content: markdownContent,
            hasFrontMatter: true,
            parseError: error.message
        }
    }
}

// 清理文件名，移除不合法的字符
function sanitizeFileName(title) {
    // 移除或替换文件系统不支持的字符
    return title
        .replace(/[<>:"/\\|?*]/g, '') // 移除Windows不支持的字符
        .replace(/\s+/g, ' ') // 将多个空格合并为一个
        .trim() // 移除首尾空格
        .substring(0, 200) // 限制文件名长度
}

// 检查目标文件名是否已存在
function getUniqueFileName(dirPath, baseName) {
    let fileName = `${baseName}.md`
    let filePath = path.join(dirPath, fileName)
    let counter = 1

    while (fs.existsSync(filePath)) {
        fileName = `${baseName} (${counter}).md`
        filePath = path.join(dirPath, fileName)
        counter++
    }

    return fileName
}

// 处理单个文件重命名
function renameFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 获取title字段
        const title = parsed.data.title

        if (!title) {
            console.log(`⚠️  跳过 ${path.relative(postsDir, filePath)} - 未找到title字段`)
            return {
                success: false,
                reason: 'no_title'
            }
        }

        if (typeof title !== 'string') {
            console.log(`⚠️  跳过 ${path.relative(postsDir, filePath)} - title字段不是字符串类型`)
            return {
                success: false,
                reason: 'invalid_title_type'
            }
        }

        // 清理标题，生成合法的文件名
        const sanitizedTitle = sanitizeFileName(title)

        if (!sanitizedTitle) {
            console.log(`⚠️  跳过 ${path.relative(postsDir, filePath)} - title清理后为空`)
            return {
                success: false,
                reason: 'empty_title'
            }
        }

        // 获取文件所在目录和当前文件名
        const dirPath = path.dirname(filePath)
        const currentFileName = path.basename(filePath)
        const targetFileName = getUniqueFileName(dirPath, sanitizedTitle)

        // 如果文件名已经是目标名称，跳过
        if (currentFileName === targetFileName) {
            console.log(`⏭️  跳过 ${path.relative(postsDir, filePath)} - 文件名已是目标名称`)
            return {
                success: false,
                reason: 'already_correct'
            }
        }

        // 生成新的文件路径
        const newFilePath = path.join(dirPath, targetFileName)

        // 重命名文件
        fs.renameSync(filePath, newFilePath)

        console.log(`✅ 重命名成功:`)
        console.log(`   原文件名: ${currentFileName}`)
        console.log(`   新文件名: ${targetFileName}`)
        console.log(`   标题: ${title}`)

        return {
            success: true,
            oldPath: filePath,
            newPath: newFilePath,
            oldName: currentFileName,
            newName: targetFileName,
            title: title
        }
    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
        return {
            success: false,
            reason: 'error',
            error: error.message
        }
    }
}

// 主函数
function main() {
    console.log('🚀 开始根据title字段重命名md文件...\n')

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

    let renamedCount = 0
    let skippedCount = 0
    let errorCount = 0
    const results = []

    // 处理每个文件
    mdFiles.forEach(filePath => {
        const result = renameFile(filePath)
        results.push(result)

        if (result.success) {
            renamedCount++
        } else {
            if (result.reason === 'error') {
                errorCount++
            } else {
                skippedCount++
            }
        }
        console.log() // 空行分隔
    })

    console.log('📊 处理完成:')
    console.log(`✅ 已重命名: ${renamedCount} 个文件`)
    console.log(`⏭️  已跳过: ${skippedCount} 个文件`)
    console.log(`❌ 处理失败: ${errorCount} 个文件`)
    console.log(`📁 总计: ${mdFiles.length} 个文件`)

    // 显示重命名摘要
    if (renamedCount > 0) {
        console.log('\n📋 重命名摘要:')
        results.filter(r => r.success).forEach(result => {
            console.log(`  ${result.oldName} -> ${result.newName}`)
        })
    }
}

// 直接运行主函数
main()

export { getAllMdFiles, renameFile, sanitizeFileName, getUniqueFileName }