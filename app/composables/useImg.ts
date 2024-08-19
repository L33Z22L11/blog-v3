const services = {
    baidu: 'https://image.baidu.com/search/down?url=',
    weserv: 'https://wsrv.nl/?url=',
}

export type ImgService = keyof typeof services | boolean

export function useImgService(src: string | undefined, service: ImgService | undefined) {
    if (!src || !service)
        return src
    if (service === true)
        return Object.values(services)[0] + encodeURIComponent(src)
    return services[service] + encodeURIComponent(src)
}
