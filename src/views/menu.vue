<template>
	<div class="router-container">
		<aside class="router-aside">
			<MenuTree
				:menus="menus"
				class="aside-menu"
				router
				:collapse="isCollapse"
			/>
			<div class="collapse-btn" @click="isCollapse = !isCollapse">
				<el-icon class="cursor-pointer"><Fold /></el-icon>
			</div>
		</aside>
		<main class="router-page-content">
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</main>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Fold } from "@element-plus/icons-vue";

defineOptions({ name: "PageView" });

const route = useRoute();

const isCollapse = ref(false);

const menus = computed(() => {
	const data = route.matched[1];
	return data && data.children
		? data.children.filter((item) => !item.path.includes(":pathMatch"))
		: [];
});
</script>

<style lang="scss" scoped>
.router-container {
	display: flex;
	height: 100%;

	.router-aside {
		position: relative;
		height: 100%;
		flex-shrink: 0;
		overflow: hidden;
		.collapse-btn {
			position: absolute;
			bottom: 0;
			width: 100%;
			line-height: 34px;
			text-align: center;
			background-color: #011629;
			color: #fff;
		}
		.aside-menu:not(.el-menu--collapse) {
			width: 250px;
			height: calc(100% - 34px);
			overflow-y: auto;
		}
	}

	.router-page-content {
		width: 100%;
		height: 100%;
		overflow: hidden;
		box-sizing: border-box;
		.route-view {
			box-sizing: border-box;
			overflow: hidden;
			padding: 10px;
			height: calc(100% - var(--menu-tag-height));
			.route-inner {
				position: relative;
				height: 100%;
				box-shadow: var(--el-box-shadow-light);
			}
		}
	}
}
</style>
