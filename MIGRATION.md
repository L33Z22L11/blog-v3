# 3.8.0 原生 CSS 迁移说明

本次从 3.7.2 升级到 3.8.0 包含破坏性更改，主要影响修改过组件样式、构建配置和布局的下游 Fork。版本号延续第三代博客的 3.x 体系，不表示此次升级向后兼容。请在独立分支迁移并预览，不要直接覆盖自己的生产分支。

## 哪些地方需要调整

| 旧配置或用法 | 本次变化 |
| --- | --- |
| `app/assets/css/*.scss` | 六个全局样式入口改为同名 `.css`，`nuxt.config.ts` 的 `css` 路径同步更新 |
| `<style lang="scss" scoped>` | 上游组件改为 `<style scoped>`，通过 `postcss-nesting` 转换 CSS 嵌套 |
| `sass-embedded` | 不再默认安装；下游保留 SCSS 时需要自行添加 |
| `_variable.scss` 和 `additionalData` | 删除全局 Sass 变量注入；断点改为 528px、768px、1080px |
| Stylelint 和 `stylelint.config.mjs` | 移除；`pnpm lint` / `pnpm lint:fix` 统一调用 ESLint |
| 侧栏、页脚和文章动画 | 布局结构及过渡标记有调整，定制这些组件时需要逐段合并并检查效果 |

这是项目默认样式工具链的调整，Nuxt 的 Sass 扩展能力没有被移除。原生 CSS 嵌套由构建工具转换，但这不代表其他 CSS 特性都被降级处理。

## 下游如何合并

1. 从自己的工作分支创建迁移分支，保留迁移前的提交或标签。
2. 比较样式时启用 Git 的重命名识别，例如 `git diff --find-renames upstream/main...HEAD -- app/assets/css`。文件改名和移除 `lang="scss"` 会产生大量 diff，不等于每个文件都需要重写。
3. 全局样式的定制移到对应 `.css` 文件；组件同时存在模板、脚本和样式修改时逐段处理，避免整文件选择上游或下游覆盖另一方功能。
4. 同步依赖声明、锁文件和 Nuxt/ESLint 配置；如果还保留 SCSS，先按下面的方案恢复支持。
5. 执行 `pnpm install`、`pnpm lint` 和 `pnpm generate`。预览生成结果，检查自定义组件、首页与文章往返、侧栏与页脚，以及手机地址栏展开时的翻页条和 Panel 避让。

## 暂时保留自己的 SCSS

无需一次性迁移所有定制组件。添加 `sass-embedded` 开发依赖，保留这些组件的 `lang="scss"`；项目使用 pnpm catalogs，依赖版本和锁文件需一起更新。

如果定制样式使用了旧断点变量，可以恢复 `app/assets/css/_variable.scss`：

```scss
$breakpoint-phone: 528px;
$breakpoint-mobile: 768px;
$breakpoint-widescreen: 1080px;
$breakpoints: (
  phone: $breakpoint-phone,
  mobile: $breakpoint-mobile,
  widescreen: $breakpoint-widescreen,
);
```

在现有 `nuxt.config.ts` 的 `vite` 对象中合并以下配置，保留上游的 PostCSS 配置及其他 Vite 配置：

```ts
export default defineNuxtConfig({
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/css/_variable.scss" as *;',
				},
			},
		},
	},
})
```

同时将 ESLint 的 `vue/block-lang` 样式语言设置改为 `lang: ['css', 'scss'], allowNoLang: true`，允许两种组件样式共存。上游的新 CSS 检查不能替代 SCSS 检查；需要检查 SCSS 的下游应保留自己的 Stylelint 配置及命令。

## 逐步转为 CSS

将 Sass 变量、插值、mixin、循环和 `//` 注释转换后，再移除 `lang="scss"`，不能只改扩展名。媒体查询中的断点使用实际数值，不能直接用 CSS 自定义属性替代 Sass 变量。迁移嵌套选择器时还需检查选择器优先级和最终布局。

本次还移除了开发期 `@nuxt/a11y` 自动扫描；需要此检查的下游可自行保留依赖与模块配置。
