import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import {BaseService} from "@/services/base.service";

BaseService.getInstance().setConfigure({
    baseURL: "http://localhost:3000",
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
