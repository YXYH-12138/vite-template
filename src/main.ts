import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

import "virtual:uno.css";
import "@/styles/index.scss";
import "element-plus/theme-chalk/src/message.scss";

createApp(App).use(createPinia()).use(router).mount("#app");
