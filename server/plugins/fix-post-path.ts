import blogConfig from '~~/blog.config'

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        for (const prefix of blogConfig.hideContentPrefixes) {
            if (file.path?.startsWith(prefix)) {
                file.original_dir = prefix
                file.path = file.path.replace(prefix, '')
            }
        }
    })
})
