<!-- SSG 下让客户端抛弃预渲染结果重新 CSR -->
<template>
<ClientOnly>
	<slot />

	<template #fallback>
		<slot />
	</template>
</ClientOnly>
</template>
