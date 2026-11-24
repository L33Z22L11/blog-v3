import type { ResolvedBundleIcons } from '@nuxt/icon/utils'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pid } from 'node:process'
import { defineNuxtModule, useLogger } from 'nuxt/kit'

type IconifyJSON = ResolvedBundleIcons['collections'][number]
type CollectionInfo = Record<string, NonNullable<IconifyJSON['info']>>

async function fetchIconData<T>(path: string): Promise<T> {
	for (const endpoint of ['https://api.iconify.design', 'https://api.simplesvg.com', 'https://api.unisvg.com']) {
		try {
			const response = await fetch(`${endpoint}/${path}`, { signal: AbortSignal.timeout(5000) })
			if (response.ok)
				return await response.json() as T
		}
		catch {}
	}
	throw new Error(`无法获取 Iconify 图标数据：${path}`)
}

export default defineNuxtModule({
	meta: { name: 'clarity:icon-cache' },
	async setup(_, nuxt) {
		// prepare 只生成类型，扫描和下载留给实际启动或构建。
		if (nuxt.options._prepare)
			return

		try {
			await bundleIcons()
		}
		catch (error) {
			useLogger('Icon').warn('图标预缓存已跳过，将使用 Nuxt Icon 默认加载方式。', error)
		}

		async function bundleIcons() {
			// 工具 API 不兼容时也降级，不让可选的预缓存影响构建。
			const { collectionNames, IconUsageScanner, resolveBundleIcons } = await import('@nuxt/icon/utils')
			const icon = nuxt.options.icon
			if (!icon || !icon.clientBundle)
				return

			const scanned = new Set<string>()
			if (icon.clientBundle.scan) {
				const scanner = new IconUsageScanner(icon.clientBundle.scan)
				// 只下载明确写成 prefix:name 的图标，避免将文章中的 CSS 类名误认成图标。
				scanner.matchRegex = new RegExp(`\\b(?:i-)?(${collectionNames.join('|')}):([a-z0-9-]+)\\b`, 'g')
				await scanner.scanFiles(nuxt.options.rootDir, scanned)
			}
			const customPrefixes = new Set(icon.customCollections?.map(collection => collection.prefix))
			const usage = [...scanned, ...icon.clientBundle.icons || []]
				.map(name => name.replace(/^i[-:]/, ''))
				.filter(name => !customPrefixes.has(name.split(':')[0]!))
			const { failed: remoteIcons } = await resolveBundleIcons({ icons: usage, resolvePaths: [nuxt.options.rootDir] })
			if (!remoteIcons.length)
				return

			// 随依赖目录缓存复用，需要重置时由 clean:cache 一并清理。
			const cacheFile = join(nuxt.options.rootDir, 'node_modules/.cache/clarity-icon/collections.json')
			const cache: IconifyJSON[] = await readFile(cacheFile, 'utf8').then(JSON.parse).catch(() => [])
			const { failed: missing } = await resolveBundleIcons({ icons: remoteIcons, customCollections: cache })
			if (missing.length) {
				try {
					const groups = Map.groupBy(missing, name => name.split(':')[0]!)
					const unknownPrefixes = [...groups.keys()].filter(prefix => !cache.find(item => item.prefix === prefix)?.info)
					// 元数据与图标同时获取；同集合新增图标时复用作者和许可证信息。
					const [info, fetched] = await Promise.all([
						unknownPrefixes.length ? fetchIconData<CollectionInfo>(`collections?prefixes=${unknownPrefixes.join(',')}`) : Promise.resolve<CollectionInfo>({}),
						Promise.all([...groups].map(async ([prefix, names]) => {
							const data = await fetchIconData<IconifyJSON>(`${prefix}.json?icons=${names.map(name => name.split(':')[1]).join(',')}`)
							if (data.not_found?.length)
								throw new Error(`Iconify 图标不存在：${data.not_found.map((name: string) => `${prefix}:${name}`).join(', ')}`)
							return data
						})),
					])
					for (const data of fetched) {
						const collection = { ...data, info: info[data.prefix] ?? cache.find(item => item.prefix === data.prefix)?.info }
						const existing = cache.find(item => item.prefix === collection.prefix)
						if (existing) {
							existing.info ??= collection.info
							Object.assign(existing.icons, collection.icons)
							Object.assign(existing.aliases ??= {}, collection.aliases)
						}
						else {
							cache.push(collection)
						}
					}
					await mkdir(dirname(cacheFile), { recursive: true })
					const temporaryFile = `${cacheFile}.${pid}.tmp`
					await writeFile(temporaryFile, JSON.stringify(cache))
					await rename(temporaryFile, cacheFile)
					useLogger('Icon').info(`已缓存 ${missing.length} 个按需下载的图标`)
				}
				catch (error) {
					// 下载或写盘失败时仍注入已有缓存，以及本次已成功下载的数据。
					useLogger('Icon').warn('部分图标未能预缓存，将使用 Nuxt Icon 默认加载方式。', error)
				}
			}

			// 只注入本次使用的图标，缓存中的旧图标不会扩大客户端包。
			const { collections } = await resolveBundleIcons({ icons: remoteIcons, customCollections: cache })
			icon.customCollections ??= []
			icon.customCollections.push(...collections)
		}
	},
})
