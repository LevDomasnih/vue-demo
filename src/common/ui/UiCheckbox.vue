<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="emit('update:modelValue', $event.target.checked)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", modelValue: boolean): void;
}>();
</script>

<style scoped>
input {
  height: 30px;
  width: 30px;
  position: relative;
}
input:after {
  content: "\00D7";
  display: block;
  background: white;
  background-image: url("../../assets/images/check.svg");
  cursor: pointer;
  font-size: 30px;
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
  color: transparent;
  transition: 0.25s all ease-in-out;
  border-radius: 3px;
  line-height: 30px;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 26px 26px;
  border-width: 3px;
  border-style: solid;
  border-color: #c4c4c4;
}
input:checked:after {
  background-color: #0066ff;
  background-position: 0 0;
  border-color: #0066ff;
}
input:hover:after {
  border-color: #0066ff;
}
</style>
