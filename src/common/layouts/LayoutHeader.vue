<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
</script>

<template>
  <header class="header">
    <div :class="['wrapper', 'spaceBetween']" v-if="authStore.isAuth">
      <img src="../../assets/images/logo.svg" alt="Skillspace" />
      <button class="signIn" @click="authStore.logout()">
        <img
          src="../../assets/images/sign-in.svg"
          class="signInIcon"
          alt="sign-in"
        />
        <div>Выйти</div>
      </button>
    </div>
    <div :class="['wrapper', 'centered']" v-else>
      <img src="../../assets/images/logo.svg" alt="Skillspace" />
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #ffffff;
  height: 72px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.wrapper {
  padding: 0 135px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.centered {
  display: flex;
  justify-content: center;
}

.spaceBetween {
  display: flex;
  justify-content: space-between;
}

.signIn {
  font-weight: 700;
  font-size: 17px;
  line-height: 24px;
  height: 21px;
  margin-right: 25px;
  display: flex;
  align-items: center;
}

.signInIcon {
  margin-right: 12px;
  width: 20px;
  height: 21px;
}
</style>
