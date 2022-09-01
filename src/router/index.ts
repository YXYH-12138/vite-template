import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: []
});

router.beforeEach(() => {
	return true;
});

export default router;
