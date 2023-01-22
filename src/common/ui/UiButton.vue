<template>
  <button
    :type="type"
    class="button"
    :class="[`size-${size}`]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  size?: "M" | "S";
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
}

const props = withDefaults(defineProps<Props>(), {
  size: "M",
  disabled: false,
  type: "button",
});
const { size } = toRefs(props);
</script>

<style scoped>
.button {
  background: #0066ff;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  border-radius: 7px;
  color: #ffffff;
}

.size-M {
  padding: 20px 54px;
}

.size-S {
  padding: 10px 19px;
}

.button:disabled {
  background: #e0e0e0;
  color: #b0b0b0;
  cursor: not-allowed;
}
</style>
