const services = {
    baidu: 'https://image.baidu.com/search/down?url=',
    weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

export function getGhAvatar(name?: string, options?: Record<string, any>) {
    if (!name)
        return ''
    if (!options)
        options = { size: 92 }
    if (options.preset === 'icon')
        Object.assign(options, { size: 32, mask: 'circle' })
    let url = `https://wsrv.nl/?url=github.com/${name}.png`
    if (options.size)
        url += `%3fsize=${options.size}`
    if (options.mask)
        url += `&mask=${options.mask}`
    return url
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
