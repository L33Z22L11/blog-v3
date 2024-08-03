import type { NavGroup } from './types/nav'

export default defineAppConfig({
    author: {
        name: '纸鹿摸鱼处',
    },
    description: '纸鹿至麓不知路，支炉制露不止漉。',
    footer: {
        copyright: `© ${new Date().getFullYear()} 纸鹿本鹿`,
        message: 'aka Zhilu, L33Z22L11',
    },
    nav: <NavGroup[]> [
        {
            title: '',
            list: [
                { icon: 'ph:files-duotone', title: '文章', link: '/' },
                { icon: 'ph:archive-duotone', title: '归档', link: '/archive' },
            ],
        },
        {
            title: '社交',
            list: [
                { icon: 'ri:qq-fill', title: '群: 169994096', link: 'https://jq.qq.com/?_wv=1027&k=lQfNSeEd', external: true },
                { icon: 'ph:github-logo-duotone', title: 'Github', link: 'https://github.com/L33Z22L11', external: true },
            ],
        },
    ],
})
