import { createApp } from "vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

createApp(App).use(autoAnimatePlugin).use(router).mount("#app");
