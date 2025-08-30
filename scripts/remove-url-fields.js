#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 删除所有文章front-matter中url字段的脚本
 * 使用Node.js原生API，自动读取content/posts/和content/previews/目录下的所有md文件，
 * 删除其front-matter中的url字段，便于重新测试URL自动生成功能
 */

const postsDir = path.join(__dirname, '../content/posts')
const previewsDir = path.join(__dirname, '../content/previews')

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

// 序列化YAML front matter（使用 unplugin-yaml）
function stringifyFrontMatter(data, content) {
    if (!data || Object.keys(data).length === 0) {
        return content
    }

    try {
        const yamlContent = stringifyYaml(data, {
            lineWidth: 0, // 不限制行宽
            minContentWidth: 0,
            quotingType: '"',
            defaultStringType: 'PLAIN'
        })

        return `---\n${yamlContent}---\n\n${content}`
    } catch (error) {
        console.warn(`YAML 序列化错误: ${error.message}`)
        return content
    }
}

// 删除单个文件的url字段
function removeUrlFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 如果没有url字段，跳过
        if (!parsed.data.url) {
            console.log(`⏭️  跳过 ${path.relative(postsDir, filePath)} - 没有url字段`)
            return false
        }

        const originalUrl = parsed.data.url

        // 删除url字段
        delete parsed.data.url

        // 重新组装文件内容
        let newContent
        if (parsed.hasFrontMatter) {
            newContent = stringifyFrontMatter(parsed.data, parsed.content)
        } else {
            // 如果原来没有front matter，保持原内容不变
            newContent = content
        }

        // 写回文件
        fs.writeFileSync(filePath, newContent, 'utf8')

        console.log(`✅ 已删除 ${path.relative(postsDir, filePath)} - url: ${originalUrl}`)
        return true
    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
        return false
    }
}

// 主函数
function main() {
    console.log('🚀 开始删除所有文章的url字段...\n')

    // 收集所有目录
    const dirsToProcess = []

    if (fs.existsSync(postsDir)) {
        dirsToProcess.push({ dir: postsDir, name: 'posts' })
    }

    if (fs.existsSync(previewsDir)) {
        dirsToProcess.push({ dir: previewsDir, name: 'previews' })
    }

    if (dirsToProcess.length === 0) {
        console.error('❌ 未找到posts或previews目录')
        process.exit(1)
    }

    // 获取所有md文件
    let allMdFiles = []
    dirsToProcess.forEach(({ dir, name }) => {
        const files = getAllMdFiles(dir)
        allMdFiles = allMdFiles.concat(files)
        console.log(`📁 在${name}目录找到 ${files.length} 个md文件`)
    })

    if (allMdFiles.length === 0) {
        console.log('📝 未找到任何md文件')
        return
    }

    console.log(`\n📁 总共找到 ${allMdFiles.length} 个md文件\n`)

    let removedCount = 0
    let skippedCount = 0

    // 处理每个文件
    allMdFiles.forEach(filePath => {
        const removed = removeUrlFromFile(filePath)
        if (removed) {
            removedCount++
        } else {
            skippedCount++
        }
    })

    console.log('\n📊 处理完成:')
    console.log(`✅ 已删除: ${removedCount} 个文件的url字段`)
    console.log(`⏭️  已跳过: ${skippedCount} 个文件`)
    console.log(`📁 总计: ${allMdFiles.length} 个文件`)

    if (removedCount > 0) {
        console.log('\n🎯 提示：现在可以重新启动开发服务器来测试URL自动生成功能！')
        console.log('💡 运行命令：pnpm dev')
    }
}

// 直接运行主函数
main()

export { getAllMdFiles, removeUrlFromFile, parseFrontMatter, stringifyFrontMatter }
