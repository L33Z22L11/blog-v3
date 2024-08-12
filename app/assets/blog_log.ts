const timeEstablished = new Date('2019-07-20')
const timeUpdated = new Date()

export default {
    name: '博客更新日志',
    timeline: [
        {
            date: timeEstablished,
            content: '发布第一篇文章',
        },
        {
            date: '2020-08-24',
            content: '更换到当前域名',
        },
        {
            date: '2023-05-24',
            content: '更换框架为 Hexo，升级博客',
        },
        {
            date: '2024-08-11',
            content: 'Nuxt Content 重构博客上线',
        },
        {
            date: new Date(),
            content: `运营${timeElapse(timeEstablished)}，${timeElapse(timeUpdated)}更新，无要事相告`,
        },
        {
            date: '2030-08-10',
            content: '域名到期，预计会提前重定向迁移，届时会通知友链中的各位',
        },
    ],
}
