<template>
  <div class="inputWrapper">
    <input
      class="input"
      :class="{ error: isError }"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <template v-if="showErrorMessage">
      <div
        class="errorMessages"
        v-for="errorMessage of errorMessages"
        :key="errorMessage.$message"
      >
        <div class="errorMessage">
          {{ errorMessage.$message }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = defineProps<{
  placeholder?: string;
  modelValue: string;
  errorMessages?: {
    $message: string;
  }[];
  isError?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const { isError, errorMessages, placeholder, modelValue } = toRefs(props);

const showErrorMessage = computed(
  () => !!isError?.value && !!errorMessages?.value
);
</script>

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

.errorMessages {
  margin-top: 13px;
  margin-left: 31px;
}

.errorMessages:not(:last-child) {
  margin-bottom: 10px;
}

.errorMessage {
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  color: #eb001b;
}
</style>
