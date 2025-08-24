<script setup lang="ts">
import { packageManager, version } from '~~/package.json'
import pnpmWorkspace from '~~/pnpm-workspace.yaml'

const appConfig = useAppConfig()
const { public: { nodeVersion, platform, arch } } = useRuntimeConfig()
const packages = Object.assign({}, ...Object.values(pnpmWorkspace.catalogs as any)) as Record<string, string>
const [pm, pmVersion] = packageManager.split('@') as [string, string]

const service = computed(() => ([
	{ label: '托管平台', value: 'Vercel' },
	{ label: '图片存储', value: () => [h('img', { src: 'https://console.bitiful.com/favicon.ico', alt: 'Bitiful S4', width: 16 }), 'Bitiful S4'] },
	{ value: () => [h('img', { src: 'https://www.cloudflare-cn.com/favicon.ico', alt: 'Cloudflare R2', width: 16 }), 'Cloudflare R2'] },
	{ label: '软件协议', value: 'MIT' },
	{ label: '文章许可', value: appConfig.copyright.abbr },
	{ label: '规范域名', value: getDomain(appConfig.url) },
]))

const techstack = computed(() => ([
	{ label: 'Blog', value: version },
	{ label: 'Vue', value: packages.vue },
	{ label: 'Nuxt', value: packages.nuxt },
	{ label: 'Content', value: packages['@nuxt/content'] },
	{ label: 'Node', value: nodeVersion },
	{ label: pm, value: pmVersion },
	{ label: 'OS', value: platform },
	{ label: 'Arch', value: arch },
]))

const expand = ref(false)
</script>

<template>
<ZWidget card title="技术信息">
	<ZDlGroup :items="service" />
	<ZExpand v-model="expand" in-place name="构建信息">
		<ZDlGroup size="small" :items="techstack" />
	</ZExpand>
</ZWidget>
</template>

<style lang="scss" scoped>
.z-expand {
	margin-top: 0.2em;
}
</style>
