<template>
  <table>
    <thead>
      <ui-head-row
        :with-actions="!!withActions"
        :with-checkbox="withCheckbox"
        :columns="tableColumns"
        :check-all="checkAll"
        @sorter="sortColumn"
        @change-check-all="changeCheckAll"
      />
    </thead>

    <div class="buttonsAction"></div>

    <tbody>
      <ui-body-row
        v-for="row of sortedData"
        :key="row.key"
        :row="row"
        :with-actions="!!withActions"
        :with-checkbox="withCheckbox"
        :columns="tableColumns"
        :active="row.active"
        :has-error="false"
        @change-check="changeCheck"
      >
        <template #actions="props">
          <slot name="actions" v-bind="props"></slot>
        </template>
      </ui-body-row>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import UiBodyRow from "@/common/ui/UiTable/components/UiBodyRow.vue";
import UiHeadRow from "@/common/ui/UiTable/components/UiHeadRow.vue";
import { onMounted, ref, toRefs, useSlots, watch } from "vue";
import type { TableColumnsInterface } from "@/models/table-columns.interface";
import type { TableRowInterface } from "@/models/table-row.interface";

const slots = useSlots();

interface Props {
  withCheckbox: boolean;
  columns: TableColumnsInterface[];
  dataSource: TableRowInterface[];
}

const props = withDefaults(defineProps<Props>(), {
  withCheckbox: true,
});
const { dataSource, columns } = toRefs(props);

const withActions = ref(slots.actions);
const sortedData = ref<TableRowInterface[]>([]);
const tableColumns = ref<TableColumnsInterface[]>([]);
const checkAll = ref(false);

onMounted(() => {
  tableColumns.value = columns.value;
});

watch([dataSource, columns], () => {
  if (sortedData.value.length === 0) {
    sortedData.value = dataSource.value.map((e) => ({
      ...e,
      active: false,
    }));
  }
});

watch(
  sortedData,
  () => {
    checkAll.value = sortedData.value.every((e) => e.active);
  },
  { deep: true }
);

const changeCheckAll = (checked: boolean) => {
  checkAll.value = checked;
  sortedData.value = sortedData.value.map((e) => ({
    ...e,
    active: checked,
  }));
};

const changeCheck = (key: string, value: boolean) => {
  sortedData.value = sortedData.value.map((e) => {
    if (e.key === key) {
      return {
        ...e,
        active: value,
      };
    }
    return e;
  });
};

const sortColumn = (columnKey: string, sortedByAsc: boolean) => {
  if (sortedByAsc) {
    sortedData.value.sort((x, y) =>
      x.data[columnKey] > y.data[columnKey] ? -1 : 1
    );
  } else {
    sortedData.value.sort((x, y) =>
      x.data[columnKey] < y.data[columnKey] ? -1 : 1
    );
  }
  tableColumns.value = tableColumns.value.map((column) => {
    if (column.key === columnKey) {
      return {
        ...column,
        sortedByASC: !sortedByAsc,
      };
    }
    return column;
  });
};
</script>

<style scoped>
table {
  width: 100%;
}
thead:after {
  content: "-";
  display: block;
  line-height: 0;
  color: transparent;
  margin-bottom: 25px;
}
</style>
