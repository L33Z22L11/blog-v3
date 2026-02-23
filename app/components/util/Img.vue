<script setup lang="ts">
export interface UtilImgProps {
	src: string
	width?: string | number
	height?: string | number
	alt?: string
	mirror?: ImgService
	filter?: string
}

withDefaults(defineProps<UtilImgProps>(), {
	alt: '',
})
</script>

<template>
<NuxtImg
	:src="getImgUrl(src, mirror)"
	:alt :width :height
	:style="{ filter }"
	:referrerpolicy="mirror ? 'no-referrer' : undefined"
/>
</template>
