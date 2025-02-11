<template>
    <Tab :tabs="['组件', '源代码']">
        <template #tab1>
            <MDC :value="$slots.default()[0]?.props?.code" />
        </template>
        <template #tab2>
            <slot />
        </template>
    </Tab>
</template>
