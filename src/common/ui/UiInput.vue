<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = defineProps<{
  placeholder?: string;
  modelValue: string;
  errorMessage?: string;
  isError?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const { isError, errorMessage, placeholder, modelValue } = toRefs(props);

const showErrorMessage = computed(
  () => !!isError?.value && !!errorMessage?.value
);
</script>

<template>
  <div class="inputWrapper">
    <input
      class="input"
      :class="{ error: isError }"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div class="errorMessage" v-if="showErrorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.inputWrapper {
  width: 100%;
}

.input {
  background: #e0e0e0;
  border: 1px solid #cecece;
  border-radius: 5px;
  padding: 25px 32px;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #000000;
  width: 100%;
}

.input::placeholder {
  color: #b0b0b0;
}

.input.error {
  background: #ffcdcd;
  border: 1px solid #eb001b;
  color: #eb001b;
}

.input.error::placeholder {
  color: #eb001b;
}

.errorMessage {
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  color: #eb001b;
  margin-top: 13px;
  margin-left: 31px;
}
</style>
