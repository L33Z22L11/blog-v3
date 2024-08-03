<script setup lang="ts">

</script>

<template>
    <div class="wrapper">
        <ContentDoc v-slot="{ doc }">
            <article>
                <h1>{{ doc.title }}</h1>
                <ContentRenderer :value="doc" />
            </article>
        </ContentDoc>
    </div>
</template>

<style lang="scss" scoped>
:deep(p) {
    margin: 2rem 0;
    line-height: 2;
}
</style>
