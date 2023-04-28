import { fileURLToPath, URL } from "node:url";
import { join, resolve } from "node:path";

import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import vueJsx from "@vitejs/plugin-vue-jsx";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
	const root = process.cwd();

	// 加载环境配置
	const ENV = loadEnv(mode, root);

	const { VITE_APP_TITLE } = ENV;

	return defineConfig({
		server: { host: true },
		plugins: [
			vue(),
			vueJsx(),
			createHtmlPlugin({ minify: true, inject: { data: { TITLE: VITE_APP_TITLE } } }),
			AutoImport({
				resolvers: [ElementPlusResolver()],
				dts: resolve(root, "./types/auto-imports.d.ts")
			}),
			Components({
				resolvers: [ElementPlusResolver({ importStyle: "sass" })],
				// 要搜索组件的目录的相对路径。该目录下的组件不需要导入
				dirs: ["src/components"],
				dts: resolve(root, "./types/components.d.ts")
			}),
			ElementPlus({ useSource: true })
		],
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/styles/variable.scss" as *;@use "@/styles/mixins.scss" as mixin;`
				}
			}
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url))
			}
		},
		build: {
			outDir: join("./dist"),
			// 启动 / 禁用 CSS 代码拆分
			cssCodeSplit: true,
			// 构建后是否生成 soutrce map 文件
			sourcemap: false,
			// 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
			emptyOutDir: true,
			// build
			rollupOptions: {
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	});
};
