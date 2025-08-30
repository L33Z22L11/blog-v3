#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 生成文章重定向配置的脚本
 * 扫描content/posts/目录下的所有md文件，
 * 根据文件路径和front matter中的url字段生成重定向配置
 */

const postsDir = path.join(__dirname, '../content/posts')
const redirectsFile = path.join(__dirname, '../redirects.json')

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

// 从文件路径生成原始URL路径
function getOriginalPath(filePath) {
    const relativePath = path.relative(postsDir, filePath)
    const pathWithoutExt = relativePath.replace(/\.md$/, '')
    // 将反斜杠转换为正斜杠（Windows兼容性）
    const normalizedPath = pathWithoutExt.replace(/\\/g, '/')
    return `/${normalizedPath}`
}

// 处理单个文件，生成重定向配置
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 获取原始路径
        const originalPath = getOriginalPath(filePath)

        // 获取url字段
        const urlValue = parsed.data.url

        if (!urlValue) {
            console.log(`⚠️  跳过 ${path.relative(postsDir, filePath)} - 未找到url字段`)
            return null
        }

        // 生成新路径
        const newPath = `/posts/${urlValue}`

        console.log(`📝 处理 ${path.relative(postsDir, filePath)}:`)
        console.log(`   原路径: ${originalPath}`)
        console.log(`   新路径: ${newPath}`)

        return {
            from: originalPath,
            to: newPath,
            file: path.relative(postsDir, filePath)
        }
    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
        return null
    }
}

// 读取现有的重定向配置
function readExistingRedirects() {
    try {
        if (fs.existsSync(redirectsFile)) {
            const content = fs.readFileSync(redirectsFile, 'utf8')
            return JSON.parse(content)
        }
    } catch (error) {
        console.warn(`⚠️  读取现有重定向配置失败: ${error.message}`)
    }
    return {}
}

// 写入重定向配置到文件
function writeRedirects(redirects) {
    try {
        // 按键名排序以保持一致性
        const sortedRedirects = {}
        Object.keys(redirects).sort().forEach(key => {
            sortedRedirects[key] = redirects[key]
        })

        const jsonContent = JSON.stringify(sortedRedirects, null, 2)
        fs.writeFileSync(redirectsFile, jsonContent, 'utf8')
        console.log(`\n✅ 重定向配置已写入: ${path.relative(process.cwd(), redirectsFile)}`)
        return true
    } catch (error) {
        console.error(`❌ 写入重定向配置失败:`, error.message)
        return false
    }
}

// 主函数
function main() {
    console.log('🚀 开始生成文章重定向配置...\n')

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

    // 读取现有的重定向配置
    const existingRedirects = readExistingRedirects()
    console.log(`📚 读取到 ${Object.keys(existingRedirects).length} 条现有重定向配置\n`)

    let processedCount = 0
    let skippedCount = 0
    const newRedirects = { ...existingRedirects }

    // 处理每个文件
    mdFiles.forEach(filePath => {
        const result = processFile(filePath)
        if (result) {
            // 检查是否与现有配置冲突
            if (existingRedirects[result.from] && existingRedirects[result.from] !== result.to) {
                console.log(`   ⚠️  覆盖现有配置: ${existingRedirects[result.from]} -> ${result.to}`)
            }

            newRedirects[result.from] = result.to
            processedCount++
        } else {
            skippedCount++
        }
        console.log() // 空行分隔
    })

    // 写入配置文件
    const writeSuccess = writeRedirects(newRedirects)

    if (writeSuccess) {
        console.log('\n📊 处理完成:')
        console.log(`✅ 已处理: ${processedCount} 个文件`)
        console.log(`⏭️  已跳过: ${skippedCount} 个文件`)
        console.log(`📁 总计: ${mdFiles.length} 个文件`)
        console.log(`🔗 重定向规则: ${Object.keys(newRedirects).length} 条`)
    }
}

// 直接运行主函数
main()

export { getAllMdFiles, processFile, readExistingRedirects, writeRedirects }