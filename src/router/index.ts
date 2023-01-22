import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login/Login.vue";
import Space from "@/pages/Space/Space.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/space",
      name: "Space",
      component: Space,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuth) {
          return {
            path: "/login",
          };
        }
        return {
          path: "/space",
        };
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path !== "/login") {
    if (authStore.isAuth) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.path === "/login") {
    if (authStore.isAuth) {
      next({ name: "Space" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
