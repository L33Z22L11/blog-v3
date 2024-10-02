const archMap = {
    'Astro': 'simple-icons:astro',
    'CDN (国内)': 'ph:cloud-check-fill',
    'Cloudflare': 'simple-icons:cloudflare',
    'Deno Deploy': 'simple-icons:deno',
    'GitHub Pages': 'simple-icons:github',
    'Halo': 'tabler:square-letter-h-filled', // 不准确
    'Hexo': 'simple-icons:hexo',
    'Hugo': 'simple-icons:hugo',
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

export type Arch = keyof typeof archMap

export function getArchIcon(arch: Arch) {
    return archMap[arch] ?? ''
}

const fileTypeMap: Record<string, string> = {
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
        return 'ph:file-bold'

    const fileType = fileTypeMap[extension] || extension
    return `catppuccin:${fileType}`
}
