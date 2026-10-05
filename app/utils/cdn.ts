async function importModule(path: string) {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 5000)
	const hosts = ['gcore', 'fastly', 'testingcf', 'cdn']
	let url: string
	try {
		url = await Promise.any(hosts.map(async (host) => {
			const url = `https://${host}.jsdelivr.net/npm/${path}`
			const response = await fetch(url, { method: 'HEAD', signal: controller.signal })
			if (!response.ok)
				throw new Error(`${host}: HTTP ${response.status}`)
			return url
		}))
	}
	catch {
		throw new Error('所有 jsDelivr CDN 节点均不可用，请稍后重试')
	}
	finally {
		clearTimeout(timeout)
		controller.abort()
	}

	return import(/* @vite-ignore */ url)
}

const pending = new Map<string, ReturnType<typeof importModule>>()

export function importFromJsDelivr(path: string) {
	let promise = pending.get(path)
	if (!promise) {
		promise = importModule(path).catch((error) => {
			pending.delete(path)
			throw error
		})
		pending.set(path, promise)
	}
	return promise
}
