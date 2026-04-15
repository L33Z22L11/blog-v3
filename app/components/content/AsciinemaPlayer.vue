<template>
   <div ref="playerContainer" class="asciinema-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
   // .cast 文件路径，建议放在 public/ 目录下
   src: {
      type: String,
      required: true
   },
   // 常见配置项
   cols: { type: Number, default: 80 },
   rows: { type: Number, default: 24 },
   autoPlay: { type: Boolean, default: false },
   preload: { type: Boolean, default: false },
   loop: { type: Boolean, default: false },
   theme: { type: String, default: 'asciinema' }, // 也可以是 'tango', 'solarized-dark' 等
   speed: { type: Number, default: 1 }
});
const playerContainer = ref(null);
let playerInstance = null;

// 初始化函数
const initPlayer = async () => {
   if (!process.client) return;
   // 1. 动态导入 JS 和 CSS (避免 SSR 报错)
   const AsciinemaPlayer = await import('asciinema-player');
   await import('asciinema-player/dist/bundle/asciinema-player.css');

   // 2. 如果已有实例则先销毁（防止热更新或 src 改变时重复挂载）
   if (playerInstance) {
      playerInstance.dispose();
   }

   // 3. 创建播放器实例
   playerInstance = AsciinemaPlayer.create(props.src, playerContainer.value, {
      cols: props.cols,
      rows: props.rows,
      autoPlay: props.autoPlay,
      preload: props.preload,
      loop: props.loop,
      theme: props.theme,
      speed: props.speed,
      terminalFontSize: '14px',
      terminalFontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
   });
};

onMounted(() => {
   initPlayer();
});

 // 监听 src 变化，方便在单页应用中切换文章时更新视频
watch(() => props.src, () => {
   initPlayer();
});

 // 卸载组件时销毁播放器，释放内存
onBeforeUnmount(() => {
   if (playerInstance && typeof playerInstance.dispose === 'function') {
      playerInstance.dispose();
   }
});
</script>

<style scoped>
.asciinema-container {
   width: 100%;
   /* 避免加载前高度塌陷 */
   min-height: 200px;
   margin: 1rem 0;
   background-color: #000;
   border-radius: 6px;
   overflow: hidden;
}

/* 深度选择器：微调播放器内部样式 */
:deep(.asciinema-player-wrapper) {
   border: none !important;
}
</style>