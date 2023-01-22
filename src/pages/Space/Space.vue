<template>
  <div class="space">
    <div class="spaceHeader">
      <h1>Ваши файлы</h1>
      <ui-button size="S" class="addButton"> Добавить </ui-button>
    </div>
    <div class="spaceTable">
      <ui-table
        :with-checkbox="true"
        :columns="columns"
        :data-source="dataSource"
      >
        <template #actions="props: TableRowInterface">
          <div class="actionButtons">
            <button @click="editRow(props.key)">
              <img src="src/assets/images/edit.svg" alt="edit file name" />
            </button>
            <button @click="downloadRowFile(props.key)">
              <img src="src/assets/images/download.svg" alt="download file" />
            </button>
            <button @click="deleteRow(props.key)">
              <img src="src/assets/images/delete.svg" alt="delete file" />
            </button>
          </div>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from "@/common/ui/UiButton.vue";
import UiTable from "@/common/ui/UiTable/UiTable.vue";
import { computed, onMounted } from "vue";
import { useSpaceStore } from "@/stores/useSpaceStore";
import { format } from "date-fns";
import type { TableRowInterface } from "@/models/table-row.interface";

const fileStore = useSpaceStore();

onMounted(() => {
  fileStore.getFiles();
});

const columns = [
  {
    title: "Название",
    key: "name",
    sortedByASC: true,
    render: (value: string) => {
      return value;
    },
  },
  {
    title: "Дата изменения",
    key: "dataChange",
    sortedByASC: true,
    render: (value: number) => {
      return format(new Date(value), "MM.dd.yyyy, HH:MM");
    },
  },
  {
    title: "Размер",
    key: "size",
    sortedByASC: true,
    render: (value: number) => {
      return `${(value / 1e6).toFixed(1)} МБ`;
    },
  },
];

const dataSource = computed(() => {
  return fileStore.files.map((file) => ({
    key: String(file.id),
    data: {
      name: file.name,
      dataChange: file.editedAt,
      size: file.size,
    },
  }));
});

const editRow = (id: number) => {
  console.log(id);
};

const downloadRowFile = (id: number) => {
  console.log(id);
};

const deleteRow = (id: number) => {
  console.log(id);
};
</script>

<style scoped>
.space {
  height: 100%;
  width: 100%;
  padding: 63px 135px 0 90px;
}
.addButton {
  margin: 23px 0 63px;
}
.spaceHeader {
  margin-left: 45px;
}
.spaceTable {
  height: 100%;
  width: 100%;
}
.actionButtons {
  display: flex;
  justify-content: flex-end;
}

.actionButtons button:not(:last-child) {
  margin-right: 28px;
}

.actionButtons img {
  width: 30px;
  height: 30px;
}
</style>
