import type { RouteRecordRaw } from "vue-router";

export const topMenus: RouteRecordRaw[] = [
	{
		path: "/nav-one",
		name: "nav-one",
		component: () => import("@/views/menu.vue"),
		meta: {
			title: "导航1",
		},
		children: [
			{
				path: "/nav-one/todo",
				name: "nav-one-todo",
				component: () => import("@/views/nav-one/todo/index.vue"),
				meta: {
					title: "待办事项",
					icon: "todo",
				},
			},
		],
	},
];

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "layout",
		component: () => import("@/views/layout/index.vue"),
		redirect: "/nav-one/todo",
		children: topMenus,
	},
];
