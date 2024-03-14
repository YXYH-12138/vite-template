import { type ConfigEnv, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { join, resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const pathSrc = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
	const root = process.cwd();

	// 加载环境配置
	const ENV = loadEnv(mode, root);

	const { VITE_APP_TITLE } = ENV;

	return defineConfig({
		base: "/",
		server: { host: true },
		resolve: {
			alias: {
				"@/": `${pathSrc}/`,
				"~/": `${pathSrc}/`
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "~/styles/element-variable.scss" as *;`
				}
			}
		},
		plugins: [
			UnoCSS(),
			vue(),
			createHtmlPlugin({ minify: true, inject: { data: { TITLE: VITE_APP_TITLE } } }),
			AutoImport({
				resolvers: [ElementPlusResolver()],
				dts: resolve(__dirname, "./src/types/auto-imports.d.ts")
			}),
			Components({
				resolvers: [ElementPlusResolver({ importStyle: "sass" })],
				// 要搜索组件的目录的相对路径。该目录下的组件不需要导入
				dirs: ["src/components"],
				dts: resolve(__dirname, "./src/types/components.d.ts")
			})
		],
		build: {
			outDir: join("./dist"),
			// 启动 / 禁用 CSS 代码拆分
			cssCodeSplit: true,
			// 构建后是否生成 soutrce map 文件
			sourcemap: false,
			// 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
			emptyOutDir: true,
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
