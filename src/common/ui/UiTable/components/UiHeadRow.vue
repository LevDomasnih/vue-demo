<template>
  <tr>
    <th scope="col" class="checkbox" v-if="withCheckbox">
      <ui-checkbox
        :model-value="checkAll"
        @update:model-value="emits('change-check-all', $event)"
      />
    </th>
    <th
      v-for="(column, index) of columns"
      :key="column.key"
      class="header"
      :class="{ firstChild: index === 0 }"
      scope="col"
    >
      <button class="headerSort" @click="emits('change-sort', column.key)">
        <div>{{ column.title }}</div>
        <img
          v-show="sortFieldKey === column.key"
          :class="{ asc: !sortedByAsc }"
          class="arrow-sort"
          src="src/assets/images/arrow.svg"
          alt="sort"
        />
      </button>
    </th>
    <th class="actions" v-if="withActions"></th>
  </tr>
</template>

<script setup lang="ts">
import UiCheckbox from "@/common/ui/UiCheckbox.vue";
import type { TableColumnsInterface } from "@/models/table-columns.interface";

interface Props {
  withCheckbox: boolean;
  withActions: boolean;
  checkAll: boolean;
  columns: TableColumnsInterface[];
  sortedByAsc: boolean;
  sortFieldKey: string | null;
}
withDefaults(defineProps<Props>(), {
  withActions: true,
  withCheckbox: true,
  checkAll: false,
});
const emits = defineEmits<{
  (e: "change-sort", columnKey: string): void;
  (e: "change-check-all", checked: boolean): void;
}>();
</script>

<style scoped>
tr {
  height: 72px;
}
th {
  vertical-align: middle;
}
th * {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: #000000;
}
th:not(.checkbox) {
  border-bottom: 1px solid #e0e0e0;
}
.header.firstChild > * {
  padding-left: 15px;
}
.actions * {
  padding-right: 22px;
  text-align: right;
}
.checkbox {
  width: 72px;
  text-align: center;
}
.arrow-sort {
  width: 14px;
  height: 15px;
  margin-left: 12px;
  transition: all 0.2s ease-out;
}
.headerSort {
  display: flex;
  align-items: center;
}
.arrow-sort.asc {
  transform: rotate(180deg);
}
</style>
