<script setup lang="ts">
import LayoutHeader from "@/common/layouts/LayoutHeader.vue";
import Toast from "@/common/ui/Toast.vue";
import { useToastStore } from "@/stores/useToastStore";

const toastStore = useToastStore();
</script>

<template>
  <layout-header />
  <menu>
    <router-view></router-view>
  </menu>
  <teleport to="body">
    <toast
      class="toast"
      v-for="toast of toastStore.toasts"
      :key="toast.key"
      v-bind="toast"
    />
  </teleport>
</template>

<style scoped>
.toast {
  left: 135px;
  bottom: 30px;
}
</style>
