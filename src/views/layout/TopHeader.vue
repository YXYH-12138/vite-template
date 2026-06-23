<template>
	<div class="logoinfo">
		<div flex>
			<div flex align-center>
				<div flex items-center mr10>
					<el-image w-40 h-40 src="/favicon.svg" />
				</div>
				<div text-26 font-bold style="line-height: var(--el-header-height)">
					{{ TITLE }}
				</div>
			</div>

			<div class="top-menus">
				<router-link
					v-for="item in menus"
					:key="item.path"
					:to="item.path"
					class="top-menu-item"
					active-class="is-active"
				>
					{{ item.title }}
				</router-link>
			</div>
		</div>

		<el-dropdown class="right-menu-item hover-effect" trigger="click">
			<div class="avatar-wrapper">
				<el-icon class="head"><UserFilled /></el-icon>
				<span class="name">test</span>
				<el-icon><CaretBottom /></el-icon>
			</div>
			<!-- <template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item>
						<span @click="logout">退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template> -->
		</el-dropdown>
	</div>
</template>
<script setup lang="ts">
import { UserFilled, CaretBottom } from "@element-plus/icons-vue";

const TITLE = import.meta.env.VITE_APP_TITLE;

import { useMenuStore } from "@/store";

const menus = useMenuStore().topMenus;
</script>
<style lang="scss" scoped>
.logoinfo {
	display: flex;
	margin-left: 10px;
	height: 100%;
	align-self: center;
	font-size: 24px;
	color: #fff;
	justify-content: space-between;
	.logoimg {
		line-height: var(--el-header-height);
	}

	.el-dropdown {
		.head {
			height: 30px;
			width: 30px;
			border-radius: 30px;
			background: #81abff;
			font-size: 20px;
			color: #a9c7ff;
			margin-right: 10px;
		}

		.avatar-wrapper {
			height: 100%;
			color: #fff;
			font-size: 16px;
			height: 60px;
			display: flex;
			align-items: center;
			margin-right: 15px;
			cursor: pointer;
		}
	}
}

.top-menus {
	margin-left: 100px;
	height: 100%;
	display: flex;
	align-items: center;
	gap: 20px;

	.top-menu-item {
		font-weight: 400;
		font-size: 20px;
		text-align: center;
		color: #ffffff;
		margin: 0 5px;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		height: 100%;
		box-sizing: border-box;
		cursor: pointer;
	}

	.top-menu-item:hover {
		background-color: transparent;
		color: #ffffff;
	}

	.top-menu-item.is-active {
		background-color: transparent;
		border-bottom: solid #fff 3px;
	}
}
</style>
