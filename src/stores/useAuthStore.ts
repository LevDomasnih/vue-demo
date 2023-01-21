import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { AuthService } from "@/services/auth.service";
import { BaseService } from "@/services/base.service";
import { useRouter } from "vue-router";

interface Errors {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const isAuth = ref(false);
  const errors = reactive<Errors>({
    email: "",
    password: "",
  });

  const token = localStorage.getItem("auth_token");
  if (token) {
    isAuth.value = true;
    BaseService.getInstance().setHeaderToken(token);
  }

  const login = async (email: string, password: string) => {
    const data = await new AuthService().login(email, password);
    if ("errors" in data) {
      errors.email = data.errors.login?.[0] || "";
      errors.password = data.errors.password?.[0] || "";
    } else {
      localStorage.setItem("auth_token", data.token);
      BaseService.getInstance().setHeaderToken(data.token);
      isAuth.value = true;
      await router.push({ name: "Space" });
    }
  };

  const logout = async () => {
    try {
      await new AuthService().logout();
      isAuth.value = false;
      localStorage.removeItem("auth_token");
      BaseService.getInstance().setHeaderToken("");
      await router.push({ name: "Login" });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    isAuth,
    errors,
    login,
    logout,
  };
});
