import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login/Login.vue";
import Space from "@/pages/Space/Space.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/space",
      name: "space",
      component: Space,
    },
  ],
});

export default router;
