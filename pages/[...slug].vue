<template>
    <ContentDoc>
        <template #default="{ doc }">
            <article class="article" :class="{ 'md-story': doc.type === 'story' }">
                <ZTitle>{{ doc.title }}</ZTitle>
                <ContentRenderer class="md-text" :value="doc" />
            </article>
        </template>
        <template #empty>
            <div class="empty">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空</p>
            </div>
        </template>
        <template #not-found>
            <ContentNavigation v-slot="{ navigation }">
                <ul>
                    <li v-for="link of navigation" :key="link._path">
                        <NuxtLink :to="link._path">
                            {{ link.title }}
                        </NuxtLink>
                    </li>
                </ul>
            </ContentNavigation>
        </template>
    </ContentDoc>
</template>

<style lang="scss" scoped>
.empty {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 1rem;
    height: 80dvh;
    color: var(--c-text-3);

    >.iconify {
        font-size: 5rem;
    }
}

.md-text { margin: 1rem; }
</style>
