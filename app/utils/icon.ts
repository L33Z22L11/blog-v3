const archIcons = {
    'Astro': 'simple-icons:astro',
    'CDN (国内)': 'ph:cloud-check-fill',
    'Cloudflare': 'simple-icons:cloudflare',
    'Deno Deploy': 'simple-icons:deno',
    'GitHub Pages': 'simple-icons:github',
    'Halo': 'tabler:square-letter-h-filled', // 不准确
    'Hexo': 'simple-icons:hexo',
    'Hugo': 'simple-icons:hugo',
    'Jekyll': 'simple-icons:jekyll',
    'Mix Space': 'ph:yarn',
    'Netlify': 'simple-icons:netlify',
    'Next.js': 'simple-icons:nextdotjs',
    'Nuxt': 'simple-icons:nuxtdotjs',
    'Server': 'ph:hard-drives-fill',
    'Typecho': 'icon-park-solid:align-text-left-one', // 不准确
    'Vercel': 'simple-icons:vercel',
    'Gridea': 'tabler:circle-letter-g', // 不准确
    'Vue': 'uim:vuejs',
    'VitePress': 'simple-icons:vitepress',
    'WordPress': 'simple-icons:wordpress',
    'Zebaur': 'tabler:square-letter-z-filled', // 不准确
}

export type Arch = keyof typeof archIcons

export function getArchIcon(arch: Arch) {
    return archIcons[arch] ?? ''
}

export const mainDomainIcons: Record<string, string> = {
    'bilibili.com': 'ri:bilibili-fill',
    'github.com': 'ri:github-fill',
    'github.io': 'ri:github-fill',
    'microsoft.com': 'ri:microsoft-fill',
    'netlify.app': 'simple-icons:netlify',
    'pages.dev': 'simple-icons:cloudflare',
    'qq.com': 'ri:qq-fill',
    'thisis.host': 'ph:star-four-fill',
    'vercel.app': 'simple-icons:vercel',
    'zabaur.app': 'tabler:square-letter-z-filled',
    'zhihu.com': 'ri:zhihu-line',
}

export const domainIcons: Record<string, string> = {
    'mp.weixin.qq.com': 'ri:wechat-fill',
}

export function getDomainIcon(url: string) {
    const domain = getDomain(url)
    const mainDomain = getMainDomain(url)
    if (domain in domainIcons)
        return domainIcons[domain]
    return mainDomainIcons[mainDomain]
}

const ext2lang: Record<string, string> = {
    bat: 'batch',
    ini: 'properties',
    js: 'javascript',
    md: 'markdown',
    mdc: 'markdown',
    sh: 'bash',
    ssh_config: 'properties',
    ts: 'typescript',
    tsx: 'typescript',
    vb: 'visual-studio',
}

export function getFileIcon(extension?: string): string {
    const config = useAppConfig()

    if (!extension || !(config.fileExtensions as string[]).includes(extension))
        extension = 'file'

    const fileType = ext2lang[extension] || extension
    return `catppuccin:${fileType}`
}
