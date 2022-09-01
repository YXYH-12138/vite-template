<script setup lang="ts">
import type { ConfigProviderProps } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const elConfig: Partial<ConfigProviderProps> = { zIndex: 3000, size: "default", locale: zhCn };
</script>

<template>
	<el-config-provider v-bind="elConfig">
		<div class="app">
			<HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" />
		</div>
	</el-config-provider>
</template>

<style lang="scss" scoped>
.app {
	position: absolute;
	left: 50%;
	top: 20%;
	transform: translate(-50%, 0);
}
</style>
