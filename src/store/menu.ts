import { topMenus } from "@/router/routes";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useMenuStore = defineStore("menu", {
	state: () => ({
		topMenus: topMenus.map((item) => ({
			title: item.meta!.title,
			path: item.path,
		})),
	}),
	getters: {},
	actions: {},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
