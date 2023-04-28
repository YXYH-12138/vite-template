<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import HelloWorld from "./components/HelloWorld.vue";
import type { ConfigProviderProps } from "element-plus";

const elConfig: Partial<ConfigProviderProps> = { zIndex: 3000, size: "default", locale: zhCn };
</script>

<template>
	<el-config-provider v-bind="elConfig">
		<header>
			<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

			<div class="wrapper">
				<HelloWorld msg="You did it!" />

				<nav>
					<RouterLink to="/">Home</RouterLink>
					<RouterLink to="/about">About</RouterLink>
				</nav>
			</div>
		</header>

		<RouterView />
	</el-config-provider>
</template>

<style scoped>
header {
	line-height: 1.5;
	max-height: 100vh;
	justify-content: center;
	margin-top: 20px;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--theme-color);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		align-items: center;
		text-align: center;
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;

		padding: 1rem 0;
		margin-top: 1rem;
	}
}
</style>
