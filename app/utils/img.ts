// @keep-sorted
const services = {
	baidu: 'https://image.baidu.com/search/down?url=',
	weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

// https://wsrv.nl/docs/quick-reference.html
export function getGhAvatar(name = '', options: Record<string, any> = { size: 92 }) {
	const srcUrl = `github.com/${name}.png?size=${options.size}`
	delete options.size

	const params = new URLSearchParams(srcUrl)
	Object.entries(options).forEach(([key, value]) => params.set(key, value))
	return services.weserv + params.toString()
}

export const getGhIcon = (name = '') => getGhAvatar(name, { size: 32, mask: 'circle' })

// https://github.com/microlinkhq/unavatar
// https://docs.webp.se/public-services/unavatar/
export function getFavicon(domain: string, options: Record<string, any> = {
	provider: 'google',
	size: 32,
}) {
	return `https://unavatar.webp.se/${options.provider}/${domain}?s=${options.size}`
}

export function getImgUrl(src: string, service?: ImgService) {
	if (!service)
		return src
	if (service === true) {
		const autoService = getMainDomain(src) === 'github.com' ? 'weserv' : 'baidu'
		return services[autoService] + src
	}
	if (service in services)
		return services[service] + src
	return src
}
