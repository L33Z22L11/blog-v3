import type { FriendGroup } from '~/types/friend'

export default <FriendGroup[]> [
    {
        name: '大佬们',
        desc: 'Xlenco在网络上认识的大佬。',
        items: [
            {
                name: '张洪Heo',
                desc: '分享设计与科技生活',
                link: 'https://blog.zhheo.com/',
                icon: 'https://bu.dusays.com/2022/12/28/63ac2812183aa.png',
                archs: ['Hexo', 'CDN (国内)'],
                date: '2024-02-02',
                comment: '知名博主，其博客设计风格被众多人借鉴。',
            },            

        ],
    },
    {
        name: '网上邻居',
        desc: '哔——啵——电波通讯中，欢迎常来串门。',
        items: [
           
        ],
    },
    {
        name: '漫游',
        desc: '网上冲浪时发现的精彩内容，与君共享。',
        items: [
            {
                name: '静かな森',
                link: 'https://innei.in/',
                icon: 'https://wsrv.nl/?url=github.com/Innei.png',
                archs: ['Mix Space', 'Cloudflare'],
                date: '2024-02-13',
            },
        ],
    },
]
