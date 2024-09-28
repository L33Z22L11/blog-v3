<script setup lang="ts">
import type { NavItem } from '~/types/nav'

const props = defineProps<{
    list: NavItem[]
}>()

const tip = ref<HTMLLIElement[]>()

console.log(tip.value)

onMounted(() => {
    props.list.forEach((item, index) => {
        useTooltip(tip.value?.[index], item.text)
    })
})
</script>

<template>
    <menu>
        <li v-for="item in list" ref="tip" :key="item.text">
            <ZRawLink :to="item.url">
                <Icon :name="item.icon" />
            </ZRawLink>
        </li>
    </menu>
</template>

<style scoped lang="scss">
menu {
    display: flex;
    justify-content: center;
    gap: clamp(0.5rem, 5%, 1rem);
}
</style>
