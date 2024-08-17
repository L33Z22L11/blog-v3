<template>
    <a href="#main-content" class="skip-link gradient-card active">
        跳过导航，直接进入主要内容<br>
        Skip to content
    </a>
</template>

<style scoped>
.skip-link {
    position: fixed;
    margin: 1rem;
    padding: 0.5rem;
    z-index: 1;
    clip: rect(0, 0, 0, 0);
}

.skip-link:focus {
    clip: auto;
}
</style>
