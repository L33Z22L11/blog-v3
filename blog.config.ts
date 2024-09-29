// 存储 nuxt.config 和 app.config 共用的配置
export default {
    title: '希乐博客',
    description: 'Xlenco的个人博客，分享技术与生活。',
    author: {
        name: 'Xlenco',
        avatar: 'https://q.qlogo.cn/headimg_dl?dst_uin=1043865083&spec=640&img_type=webp',
        email: 'xlenco@email.cn',
        homepage: 'https://xlenco.top/',
    },
    copyright: {
        abbr: 'CC BY-NC-SA 4.0',
        name: '署名-非商业性使用-相同方式共享 4.0 国际',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
    },
    favicon: 'https://www.zhilu.cyou/api/icon.png',
    language: 'zh-CN',
    timeEstablished: '2022-07-20',
    timezone: 'Asia/Shanghai',
    url: 'https://blog.xlenco.top/',

    feed: {
        limit: 50,
    },

    hideContentPrefixes: [
        '/posts',
    ],
}
