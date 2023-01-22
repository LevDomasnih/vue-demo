<template>
  <tr :class="{ active, error: hasError }">
    <td class="checkbox" v-if="withCheckbox">
      <ui-checkbox
        :model-value="row.active"
        @update:model-value="emits('change-check', row.key, $event)"
      />
    </td>
    <td
      v-for="(value, key, index) in row.data"
      :key="key"
      class="dataCell"
      :class="{ firstChild: index === 0 }"
    >
      <div v-if="columns.find((c) => c.key === key).render">
        {{ columns.find((c) => c.key === key).render(value) }}
      </div>
      <div v-else>{{ value }}</div>
    </td>
    <td class="actions" v-if="withActions">
      <div>
        <slot name="actions" v-bind="row"></slot>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import UiCheckbox from "@/common/ui/UiCheckbox.vue";
import type { TableRowInterface } from "@/models/table-row.interface";
import type { TableColumnsInterface } from "@/models/table-columns.interface";

interface Props {
  withCheckbox: boolean;
  withActions: boolean;
  active: boolean;
  hasError: boolean;
  row: TableRowInterface;
  columns: TableColumnsInterface[];
}
withDefaults(defineProps<Props>(), {
  withActions: true,
  withCheckbox: true,
  active: false,
  hasError: false,
});
const emits = defineEmits<{
  (e: "change-check", key: string, value: boolean): void;
}>();
</script>

<style scoped>
tr {
  height: 78px;
}
tr:hover td:not(.checkbox) {
  background: #e8f1ff;
}
td {
  vertical-align: middle;
}
tr td * {
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
}
tr.error td * {
  color: #eb001b;
}
tr td:not(.checkbox) {
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.2s ease-out;
}
.dataCell.firstChild > * {
  padding-left: 15px;
}
.active td:not(.checkbox) {
  background: #e8f1ff;
}
.actions * {
  padding-right: 22px;
  text-align: right;
}
.checkbox {
  width: 72px;
  text-align: center;
}
</style>
