<template>
	<div class="svg-icon" :style="{ fontSize: size }" v-bind="$attrs">
		<template v-if="mode === 'link'">
			<svg aria-hidden="true">
				<use :xlink:href="`#icon-${iconName}`" />
			</svg>
		</template>
		<template v-else-if="mode === 'load'">
			<component aria-hidden="true" :is="svgCom" />
		</template>
		<template v-else>
			{{ iconName }}
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		iconName: string;
		color?: string;
		size?: string;
		/**
		 * 加载svg图标的模式
		 * link: 通过 vite-plugin-svg-icons 插件,在全局页面导入所有svg，再以use标签的方式从全局引入.
		 * load: 通过 vite-svg-loader 插件,直接以完整svg标签的方式引入.（解决dom元素导出为pdf等格式时svg图标不显示的问题）
		 */
		mode?: "link" | "load";
	}>(),
	{
		color: "currentColor",
		size: "inherit",
		mode: "link",
	},
);

const svgCom = computedAsync(async () => {
	if (props.mode === "load") {
		return import(`@/assets/icons/${props.iconName}.svg`).then(
			(res) => res.default,
		);
	}
	return null;
});
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	position: relative;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	fill: v-bind(color);
	overflow: hidden;
	svg {
		width: 1em;
		height: 1em;
	}
}
</style>
