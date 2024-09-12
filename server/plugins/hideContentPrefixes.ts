import blogConfig from '~~/blog.config'

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        for (const prefix of blogConfig.hideContentPrefixes) {
            if (file._path?.startsWith(prefix)) {
                file._original_dir = prefix
                file._path = file._path.replace(prefix, '')
            }
        }
    })
})
