// @keep-sorted
const services = {
	baidu: 'https://image.baidu.com/search/down?url=',
	/** https://webp.se/fly/ */
	fly: 'https://fly.webp.se/?url=',
	/** https://wsrv.nl/docs/ */
	weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

// https://wsrv.nl/docs/quick-reference.html
export function getWsrvGhAvatar(name = '', options: Record<string, any> = { size: 92 }) {
	const srcUrl = `github.com/${name}.png?size=${options.size}`
	delete options.size

	const params = new URLSearchParams(srcUrl)
	Object.entries(options).forEach(([key, value]) => params.set(key, value))
	return services.weserv + params.toString()
}

// https://docs.webp.se/public-services/github-avatar/
export function getGhAvatar(name = '', options = { size: 120 }) {
	return `https://avatars-githubusercontent-webp.webp.se/${name}?s=${options.size}`
}

export const getGhIcon = (name = '') => getWsrvGhAvatar(name, { size: 32, mask: 'circle' })

export enum OicqAvatarSize {
	Size1080,
	Size40,
	Size40a,
	Size100,
	Size140,
	Size640,
	Size40b = 40,
	Size100a = 100,
	Size640a = 640,
}

// https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=
export function getOicqAvatar(qq = '', size = OicqAvatarSize.Size140) {
	return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`
}

interface FaviconOptions {
	provider?: 'google' | 'duckduckgo' | 'microlink'
	size?: number
}

// https://github.com/microlinkhq/unavatar
// https://docs.webp.se/public-services/unavatar/
export function getFavicon(domain: string, options?: FaviconOptions) {
	const { provider = 'google', size = 32 } = options || {}
	return `https://unavatar.webp.se/${provider}/${domain}?w=${size}`
}

export function getImgUrl(src: string, service?: ImgService | true) {
	if (!service)
		return src
	if (service === true)
		service = 'fly'
	if (service in services)
		return services[service] + src
	return src
}
