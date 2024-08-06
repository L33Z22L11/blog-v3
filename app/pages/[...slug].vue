<template>
    <ContentDoc>
        <template #default="{ doc }">
            <article class="article" :class="{ 'md-story': doc.type === 'story' }">
                <ZTitle>{{ doc.title }}</ZTitle>
                <ContentRenderer class="md-text" :value="doc" />
            </article>
        </template>
        <template #empty>
            <div class="app-error">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空</p>
            </div>
        </template>
    </ContentDoc>
</template>

<style lang="scss" scoped>
.md-text {
    margin: 1rem;
}
</style>
