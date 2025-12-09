// @keep-sorted
const services = {
	baidu: 'https://image.baidu.com/search/down?url=',
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

export enum QqAvatarSize {
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
export function getQqAvatar(qq = '', size = QqAvatarSize.Size140) {
	return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`
}

// https://github.com/microlinkhq/unavatar
// https://docs.webp.se/public-services/unavatar/
export function getFavicon(domain: string, options: Record<string, any> = {
	provider: 'google',
	size: 32,
}) {
	return `https://unavatar.webp.se/${options.provider}/${domain}?w=${options.size}`
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
