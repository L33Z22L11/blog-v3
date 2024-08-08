<template>
    <ZSidebar />
    <ZPanel :has-aside="$route.meta.aside" />
    <div id="content">
        <main>
            <NuxtPage />
            <ZFooter />
        </main>
        <ZAside v-if="$route.meta.aside !== false" />
    </div>
</template>

<style lang="scss">
#z-root {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

aside {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    width: 256px;
    height: 100dvh;

    @media (max-width: $breakpoint-widescreen) {
        flex-shrink: 0.2;
    }
}

#content {
    display: flex;
    gap: 0.5rem;
    width: $breakpoint-widescreen;

    @media (max-width: $breakpoint-widescreen) {
        display: block;
    }

    >main {
        flex-grow: 1;
        min-height: calc(100vh + 5rem);
    }
}
</style>
