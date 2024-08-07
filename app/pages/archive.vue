<script setup lang="ts">
import { group } from 'radash'

useHead({ title: '归档' })
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()

const orderBy = ref(route.query.order as string || appConfig.indexGenerator.orderBy || 'date')

const { data } = await useAsyncData(
    'index_post',
    () => queryContent('/post').sort({ [orderBy.value]: -1 }).find(),
    { watch: [orderBy] },
)

watch(orderBy, () => {
    router.push({ query: { order: orderBy.value } })
})

const list = computed(() => data.value || [])

const groupedList = computed(
    () => Object.entries(group(
        list.value,
        article => new Date(article[orderBy.value]).getFullYear(),
    )).reverse(),
)
</script>

<template>
    <div class="archive">
        <ZOrderToggle v-model="orderBy" />
        <div
            v-for="[year, yearGroup] in groupedList"
            :key="year"
            class="archive-group"
        >
            <h2 class="archive-year">
                {{ year }}
                <span class="archive-count">{{ yearGroup!.length }}</span>
            </h2>
            <ul class="archive-list">
                <ZArchive
                    v-for="article in yearGroup"
                    :key="article._path"
                    v-bind="article"
                    :to="article._path"
                    :use-updated="orderBy === 'updated'"
                />
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.archive {
    margin: 1rem;
    mask: linear-gradient(var(--c-bg-1) 50%, var(--c-bg-a50));
}

.archive-group {
    position: relative;
    margin: 1rem 0;

    &:hover > .archive-year {
        color: var(--c-text-3);
    }
}

.archive-year {
    position: sticky;
    opacity: 0.5;
    top: 3rem;
    margin-bottom: -2rem;
    mask: linear-gradient(var(--c-bg-1) 50%, transparent);
    font-size: 5rem;
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);
}

.archive-count {
    position: absolute;
    right: 0;
}
</style>
