<template>
  <table :class="{ showedCheckbox: hasActive }">
    <thead>
      <ui-head-row
        :with-actions="!!withActions"
        :with-checkbox="withCheckbox"
        :columns="tableColumns"
        :check-all="checkAll"
        :sorted-by-asc="sortedByAsc"
        :sort-field-key="sortFieldKey"
        @change-sort="changeSortColumn"
        @change-check-all="changeCheckAll"
      />
    </thead>

    <tr v-show="hasActive">
      <td v-show="withCheckbox"></td>
      <td :colspan="withCheckbox ? columnsCount - 1 : columnsCount">
        <div class="checkButtons">
          <slot
            name="checkAllItemsButtons"
            v-bind="{ sortedData }"
            v-if="checkAll"
          ></slot>
          <slot
            name="checkSomeItemsButtons"
            v-bind="{ sortedData }"
            v-else
          ></slot>
        </div>
      </td>
    </tr>

    <tbody>
      <ui-body-row
        v-for="row of sortedData"
        :key="row.key"
        :row="row"
        :with-actions="!!withActions"
        :with-checkbox="withCheckbox"
        :columns="tableColumns"
        :active="row.active"
        :has-error="row.isError"
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
import { computed, onMounted, ref, toRefs, useSlots, watch } from "vue";
import type { TableColumnsInterface } from "@/models/table-columns.interface";
import type { TableRowInterface } from "@/models/table-row.interface";
import { useSpaceStore } from "@/stores/useSpaceStore";
import { storeToRefs } from "pinia";
interface Props {
  withCheckbox: boolean;
  columns: TableColumnsInterface[];
  dataSource: TableRowInterface[];
  defaultSortField?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  withCheckbox: true,
  defaultSortField: null,
});
const { dataSource, columns, withCheckbox, defaultSortField } = toRefs(props);

const slots = useSlots();
const spaceStore = useSpaceStore();

const { errorKeys } = storeToRefs(spaceStore);

const withActions = ref(slots.actions);
const sortedData = ref<TableRowInterface[]>([]);
const tableColumns = ref<TableColumnsInterface[]>([]);
const checkAll = ref(false);
const sortFieldKey = ref<string | null>(defaultSortField.value);
const sortedByAsc = ref(true);
const hasActive = computed(() => sortedData.value.some((e) => e.active));
const columnsCount = computed(() => {
  let count = 0;
  if (withCheckbox.value) {
    count += 1;
  }
  if (withActions.value) {
    count += 1;
  }
  return count + tableColumns.value.length;
});

onMounted(() => {
  tableColumns.value = columns.value;
  if (!sortFieldKey.value) {
    sortFieldKey.value = columns.value[0].key;
  }
});

watch(
  errorKeys,
  () => {
    if (errorKeys.value.length === 0) {
      return;
    }
    sortedData.value = sortedData.value.map((s) => {
      if (errorKeys.value.includes(s.key)) {
        return {
          ...s,
          isError: true,
        };
      }
      return s;
    });
    const tempErrKeys = [...errorKeys.value];
    errorKeys.value = [];
    setTimeout(() => {
      sortedData.value = sortedData.value.map((s) => {
        if (tempErrKeys.includes(s.key)) {
          return {
            ...s,
            isError: false,
          };
        }
        return s;
      });
    }, 5000);
  },
  { deep: true }
);

watch([dataSource, columns], () => {
  sortedData.value = dataSource.value.map((e) => ({
    ...e,
    active: false,
  }));
  if (sortFieldKey.value) {
    sortColumns(sortFieldKey.value);
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

const changeSortColumn = (columnKey: string) => {
  if (sortFieldKey.value !== columnKey) {
    sortedByAsc.value = true;
    sortFieldKey.value = columnKey;
  }
  sortedByAsc.value = !sortedByAsc.value;
  sortColumns(columnKey);
};

const sortColumns = (columnKey: string) => {
  if (sortedByAsc.value) {
    sortedData.value.sort((x, y) =>
      x.data[columnKey] > y.data[columnKey] ? -1 : 1
    );
  } else {
    sortedData.value.sort((x, y) =>
      x.data[columnKey] < y.data[columnKey] ? -1 : 1
    );
  }
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
table:not(.showedCheckbox) :deep(tr:not(.active) th.checkbox),
table:not(.showedCheckbox) :deep(tr:not(.active) td.checkbox) {
  opacity: 0;
}
table:not(.showedCheckbox) :deep(tr:hover th.checkbox),
table:not(.showedCheckbox) :deep(tr:hover td.checkbox) {
  opacity: 1;
}
.checkButtons {
  display: flex;
  margin-bottom: 40px;
}
</style>
