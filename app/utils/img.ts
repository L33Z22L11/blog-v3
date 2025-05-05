// @keep-sorted
const services = {
    baidu: 'https://image.baidu.com/search/down?url=',
    weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

export function getGhAvatar(name = '', options: Record<string, any> = { size: 92 }) {
    if (!name)
        return ''
    if (options.preset === 'icon')
        options = { ...options, size: 32, mask: 'circle' }

    const params = new URLSearchParams()
    params.set('url', `github.com/${name}.png`)
    if (options.size)
        params.set('url', `${params.get('url')}?size=${options.size}`)
    if (options.mask)
        params.set('mask', options.mask)

    return `https://wsrv.nl/?${params.toString()}`
}

export function getImgUrl(src?: string, service?: ImgService) {
    if (!src || !service)
        return src
    if (service === true)
        return Object.values(services)[0] + src
    if (service in services)
        return services[service] + src
    return src
}
