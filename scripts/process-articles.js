#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 综合文章处理脚本
 * 功能1：生成文章重定向配置（基于当前文件路径）
 * 功能2：根据front matter中的title字段重命名md文件
 * 
 * 按顺序执行：先生成重定向配置，再重命名文件
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

// ============= 文件重命名功能 =============

// 清理文件名，移除不合法的字符
function sanitizeFileName(title) {
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
            return {
                success: false,
                reason: 'no_title'
            }
        }

        if (typeof title !== 'string') {
            return {
                success: false,
                reason: 'invalid_title_type'
            }
        }

        // 清理标题，生成合法的文件名
        const sanitizedTitle = sanitizeFileName(title)

        if (!sanitizedTitle) {
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
            return {
                success: false,
                reason: 'already_correct'
            }
        }

        // 生成新的文件路径
        const newFilePath = path.join(dirPath, targetFileName)

        // 重命名文件
        fs.renameSync(filePath, newFilePath)

        console.log(`✅ 重命名成功: ${currentFileName} -> ${targetFileName}`)

        return {
            success: true,
            oldPath: filePath,
            newPath: newFilePath,
            oldName: currentFileName,
            newName: targetFileName,
            title: title
        }
    } catch (error) {
        console.error(`❌ 重命名失败 ${filePath}:`, error.message)
        return {
            success: false,
            reason: 'error',
            error: error.message
        }
    }
}

// ============= 重定向配置生成功能 =============

// 从文件路径生成原始URL路径
function getOriginalPath(filePath) {
    const relativePath = path.relative(postsDir, filePath)
    const pathWithoutExt = relativePath.replace(/\.md$/, '')
    // 将反斜杠转换为正斜杠（Windows兼容性）
    const normalizedPath = pathWithoutExt.replace(/\\/g, '/')
    return `/${normalizedPath}`
}

// 处理单个文件，生成重定向配置
function processFileForRedirects(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        const parsed = parseFrontMatter(content)

        // 获取原始路径
        const originalPath = getOriginalPath(filePath)

        // 获取url字段
        const urlValue = parsed.data.url

        if (!urlValue) {
            return null
        }

        // 生成新路径
        const newPath = `/posts/${urlValue}`

        console.log(`📝 重定向: ${originalPath} -> ${newPath}`)

        return {
            from: originalPath,
            to: newPath,
            file: path.relative(postsDir, filePath)
        }
    } catch (error) {
        console.error(`❌ 生成重定向失败 ${filePath}:`, error.message)
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

// ============= 主执行函数 =============

// 步骤2：重命名文件
function runRenameFiles() {
    console.log('🚀 步骤2: 开始根据title字段重命名md文件...')

    const mdFiles = getAllMdFiles(postsDir)

    if (mdFiles.length === 0) {
        console.log('📝 未找到任何md文件')
        return
    }

    console.log(`📁 找到 ${mdFiles.length} 个md文件\n`)

    let renamedCount = 0
    let skippedCount = 0
    let errorCount = 0

    // 处理每个文件
    mdFiles.forEach(filePath => {
        const result = renameFile(filePath)

        if (result.success) {
            renamedCount++
        } else {
            if (result.reason === 'error') {
                errorCount++
            } else {
                skippedCount++
            }
        }
    })

    console.log('\n📊 重命名完成:')
    console.log(`✅ 已重命名: ${renamedCount} 个文件`)
    console.log(`⏭️  已跳过: ${skippedCount} 个文件`)
    console.log(`❌ 处理失败: ${errorCount} 个文件\n`)
}

// 主函数
function main() {
    console.log('🚀 开始综合处理文章...\n')

    // 检查posts目录是否存在
    if (!fs.existsSync(postsDir)) {
        console.error(`❌ 目录不存在: ${postsDir}`)
        process.exit(1)
    }

    try {
        // 步骤1：生成重定向配置（基于当前文件路径）
        runGenerateRedirects()

        // 步骤2：重命名文件
        runRenameFiles()

        console.log('🎉 所有处理完成！')
    } catch (error) {
        console.error('❌ 处理过程中发生错误:', error.message)
        process.exit(1)
    }
}

// 直接运行主函数
main()

export {
    getAllMdFiles,
    parseFrontMatter,
    renameFile,
    processFileForRedirects,
    sanitizeFileName,
    getUniqueFileName,
    readExistingRedirects,
    writeRedirects
}