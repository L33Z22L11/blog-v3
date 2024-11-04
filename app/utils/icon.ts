const archIcons = {
    '服务器': 'ph:hard-drives-fill',
    '国内 CDN': 'ph:cloud-check-fill',
    '虚拟主机': 'ph:file-cloud-bold',
    'Astro': 'simple-icons:astro',
    'Cloudflare': 'simple-icons:cloudflare',
    'Deno Deploy': 'simple-icons:deno',
    'GitHub Pages': 'simple-icons:github',
    'Gridea': 'tabler:circle-letter-g', // 不准确
    'Halo': 'tabler:square-letter-h-filled', // 不准确
    'Hexo': 'simple-icons:hexo',
    'HTML': 'simple-icons:html5',
    'Hugo': 'simple-icons:hugo',
    'Jekyll': 'simple-icons:jekyll',
    'Mix Space': 'ph:yarn',
    'Netlify': 'simple-icons:netlify',
    'Next.js': 'simple-icons:nextdotjs',
    'Nuxt': 'simple-icons:nuxtdotjs',
    'Typecho': 'icon-park-solid:align-text-left-one', // 不准确
    'Vercel': 'simple-icons:vercel',
    'VitePress': 'simple-icons:vitepress',
    'Vue': 'uim:vuejs',
    'WordPress': 'simple-icons:wordpress',
    'Zebaur': 'tabler:square-letter-z-filled', // 不准确
}

export type Arch = keyof typeof archIcons

export function getArchIcon(arch: Arch) {
    return archIcons[arch] ?? ''
}

export const mainDomainIcons: Record<string, string> = {
    'bilibili.com': 'ri:bilibili-fill',
    'creativecommons.org': 'ri:creative-commons-line',
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
    const mainDomain = getMainDomain(url, true)
    if (domain in domainIcons)
        return domainIcons[domain]
    return mainDomainIcons[mainDomain]
}

const file2icon: Record<string, string> = {
    '.crt': 'catppuccin:certificate',
    '.gitattributes': 'catppuccin:git',
    '.gitconfig': 'catppuccin:git',
    '.gitignore': 'catppuccin:git',
    '.key': 'catppuccin:key',
    '.npmrc': 'catppuccin:npm',
    '.patch': 'catppuccin:git',
    '.prettierrc': 'catppuccin:prettier',
    'CHANGELOG.md': 'catppuccin:changelog',
    'CODE_OF_CONDUCT.md': 'catppuccin:code-of-conduct',
    'CONTRIBUTING.md': 'catppuccin:contributing',
    'eslint.config.mjs': 'catppuccin:eslint',
    'LICENSE': 'catppuccin:license',
    'netlify.toml': 'catppuccin:netlify',
    'nuxt.config.ts': 'catppuccin:nuxt',
    'package.json': 'catppuccin:package-json',
    'pnpm-workspace.yaml': 'catppuccin:pnpm',
    'README.md': 'catppuccin:readme',
    'stylelint.config.mjs': 'catppuccin:stylelint',
    'tsconfig.json': 'catppuccin:typescript-config',
    'verccel.json': 'catppuccin:vercel',
}

export function getFileIcon(filename?: string) {
    if (!filename)
        return undefined
    const extension = Object.keys(file2icon).find(ext => filename.endsWith(ext))
    return extension ? file2icon[extension] : undefined
}

// 将 blogConfig.fileExtensions 的部分后缀名简写
// 转换为代码块语言对应的 Iconify Catppuccin图标
const ext2lang: Record<string, string> = {
    'bat': 'batch',
    'ini': 'properties',
    'js': 'javascript',
    'md': 'markdown',
    'mdc': 'markdown',
    'sh': 'bash',
    'ssh-config': 'properties',
    'ts': 'typescript',
    'tsx': 'typescript',
    'vb': 'visual-studio',
}

export function getLangIcon(extension?: string): string {
    const config = useAppConfig()

    if (!extension || !(config.fileExtensions as string[]).includes(extension))
        extension = 'file'

    const fileType = ext2lang[extension] || extension
    return `catppuccin:${fileType}`
}
