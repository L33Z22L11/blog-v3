<template>
    <code><slot /></code>
</template>

<style lang="scss" scoped>
code {
    padding: 0.1em 0.3em;
    border: 1px solid var(--c-border);
    border-color: color-mix(in srgb, currentcolor 10%, transparent);
    border-radius: 4px;
    background-color: var(--c-bg-2);
    background-color: color-mix(in srgb, currentcolor 5%, transparent);
    font-size: 0.875em;
    white-space: break-spaces;
}
</style>
