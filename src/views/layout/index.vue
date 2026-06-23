<template>
	<div class="common-layout">
		<el-container h-full>
			<el-header>
				<TopHeader />
			</el-header>
			<el-container>
				<el-aside></el-aside>
				<el-main>
					<RouterView />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script setup lang="ts">
import TopHeader from "./TopHeader.vue";
</script>
<style lang="scss" scoped>
.common-layout {
	width: 100vw;
	height: 100vh;
}
.el-header {
	box-sizing: border-box;
	background-color: #3377ff;
	z-index: 99;
}
.el-aside {
	position: relative;
	overflow: initial;
	width: auto;
	height: 100%;
	box-shadow: 1px 0 6px 2px #888888;
}
.el-main {
	position: relative;
	width: 1580px;
	height: 100%;
	padding: 0;
	overflow: hidden;
}
:deep(.el-scrollbar__view) {
	height: 100%;
}
</style>
