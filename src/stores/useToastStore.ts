import { defineStore } from "pinia";
import { ref } from "vue";
import type { ToastInterface } from "@/models/toast.interface";

export const useToastStore = defineStore("toastStore", () => {
  const toasts = ref<ToastInterface[]>([]);

  const changeToast = async (key: string, toast: Partial<ToastInterface>) => {
    toasts.value = toasts.value.map((e) => {
      if (e.key === key) {
        return {
          ...e,
          ...toast,
        };
      }
      return e;
    });
  };

  const deleteToast = async (key: string, timeout: number = 5000) => {
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.key !== key);
    }, timeout);
  };

  return {
    toasts,
    changeToast,
    deleteToast,
  };
});
