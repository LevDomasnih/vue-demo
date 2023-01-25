<template>
  <transition name="toast">
    <div class="toast" :class="{ error: isError }">
      <div class="title">
        {{ title }}
        <img
          v-if="isDone"
          class="doneImg"
          src="src/assets/images/done.svg"
          alt="Выполнено"
        />
      </div>
      <div class="percent">
        <div class="done" :style="{ width: `${donePercent}%` }"></div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  all: number;
  complete: number;
  isDone: boolean;
  isError: boolean;
}>();

const donePercent = computed(() => {
  return 100 / (props.all / props.complete);
});
</script>

<style>
.toast {
  position: fixed;
  z-index: 2;
  display: flex;
  transition: opacity 0.3s ease;
  min-width: 895px;
  height: 62px;
  background-color: #151515;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2px;
}
.title {
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  color: #ffffff;
  align-items: center;
  height: 100%;
  margin: 0 50px;
}
.percent {
  height: 5px;
  background-color: #00baf5;
  border-radius: 2px;
}
.done {
  height: 5px;
  background-color: #0066ff;
  border-radius: 2px;
  width: 0;
}
.doneImg {
  width: 25px;
  height: 25px;
  margin-left: 25px;
}
.toast.error .title {
  color: #eb001b;
}
.toast.error {
  background: #ffcdcd;
}
.toast.error .percent {
  background: #eb001b;
}
</style>
