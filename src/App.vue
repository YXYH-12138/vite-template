<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import type { ConfigProviderProps } from "element-plus";

const elConfig: Partial<ConfigProviderProps> = {
	zIndex: 3000,
	size: "default",
	locale: zhCn,
};
</script>

<template>
	<el-config-provider v-bind="elConfig">
		<router-view />
	</el-config-provider>
</template>

<style lang="scss">
#app {
	margin: 0;
	padding: 0;
	height: 100%;
	overflow: hidden;
}
</style>
