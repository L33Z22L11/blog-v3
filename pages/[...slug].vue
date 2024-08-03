<template>
    <div class="wrapper">
        <ContentDoc v-slot="{ doc }">
            <article class="article" :class="{ 'md-story': doc.type === 'story' }">
                <ZTitle>{{ doc.title }}</ZTitle>
                <ContentRenderer :value="doc" />
            </article>
        </ContentDoc>
    </div>
</template>
