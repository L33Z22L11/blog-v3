const services = {
    baidu: 'https://image.baidu.com/search/down?url=',
    weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

export function getImgUrl(src: string | undefined, service: ImgService | undefined) {
    if (!src || !service)
        return src
    if (service === true)
        return Object.values(services)[0] + src
    return services[service] + src
}
