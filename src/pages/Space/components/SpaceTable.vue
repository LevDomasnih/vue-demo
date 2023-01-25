<template>
  <div class="spaceTable">
    <ui-table
      :with-checkbox="true"
      :columns="columns"
      :data-source="dataSource"
    >
      <template #actions="props: SpaceTableRowInterface">
        <div class="actionButtons">
          <button @click="emits('editRow', props)">
            <img src="src/assets/images/edit.svg" alt="edit file name" />
          </button>
          <button @click="handleDownloadRowFile(props)">
            <img src="src/assets/images/download.svg" alt="download file" />
          </button>
          <button @click="handleDeleteRow(props)">
            <img src="src/assets/images/delete.svg" alt="delete file" />
          </button>
        </div>
      </template>
      <template
        #checkSomeItemsButtons="data: { sortedData: SpaceTableRowInterface[] }"
      >
        <ui-button
          size="S"
          class="spaceActionButton"
          @click="handleDownloadFiles(data)"
        >
          Скачать выбранные
        </ui-button>
        <ui-button
          size="S"
          class="spaceActionButton"
          @click="handleDeleteFiles(data)"
        >
          Удалить выбранные
        </ui-button>
      </template>
      <template
        #checkAllItemsButtons="data: { sortedData: SpaceTableRowInterface[] }"
      >
        <ui-button
          size="S"
          class="spaceActionButton"
          @click="handleDownloadFiles(data)"
          >Скачать все
        </ui-button>
        <ui-button
          size="S"
          class="spaceActionButton"
          @click="handleDeleteFiles(data)"
          >Удалить все
        </ui-button>
      </template>
    </ui-table>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { computed } from "vue";
import { FileService } from "@/services/file.service";
import { useSpaceStore } from "@/stores/useSpaceStore";
import { useToastStore } from "@/stores/useToastStore";
import type { SpaceTableRowInterface } from "@/models/space-table-row.interface";
import UiButton from "@/common/ui/UiButton.vue";
import UiTable from "@/common/ui/UiTable/UiTable.vue";

const emits = defineEmits<{
  (e: "editRow", row: SpaceTableRowInterface): void;
}>();

const spaceStore = useSpaceStore();
const toastStore = useToastStore();

const generatedHexColors: Record<string, string> = {};

const columns = [
  {
    title: "Название",
    key: "name",
    render: (value: string) => {
      const extension = value.split(".")[1];

      if (!generatedHexColors[extension]) {
        generatedHexColors[extension] = Math.floor(
          Math.random() * 16777215
        ).toString(16);
      }

      return `
        <div class="nameCell">
          <div class="nameIcon" style="color: ${
            "#" + generatedHexColors[extension]
          };border-color: ${"#" + generatedHexColors[extension]}">
              ${extension}
          </div>
          ${value}
        </div>
      `;
    },
  },
  {
    title: "Дата изменения",
    key: "dataChange",
    render: (value: number) => {
      return format(new Date(value), "MM.dd.yyyy, HH:MM");
    },
  },
  {
    title: "Размер",
    key: "size",
    render: (value: number) => {
      return `${(value / 1e6).toFixed(1)} МБ`;
    },
  },
];

const dataSource = computed<SpaceTableRowInterface[]>(() => {
  return spaceStore.files.map((file) => ({
    key: file.id,
    data: {
      name: file.name,
      dataChange: file.editedAt,
      size: file.size,
    },
  }));
});

const handleDownloadRowFile = async (row: SpaceTableRowInterface) => {
  const key = "downloadFile";
  toastStore.toasts.push({
    key,
    complete: 0,
    all: 1,
    title: `Скачивание файла ${row.data.name}`,
    isDone: false,
    isError: false,
  });
  try {
    await new FileService().downloadFile(row.data.name);
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Файл ${row.data.name} успешно скачан`,
      isDone: true,
    });
  } catch (e) {
    spaceStore.errorKeys.push(row.key);
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Не удалось скачать  ${row.data.name}`,
      isError: true,
    });
  } finally {
    await toastStore.deleteToast(key);
  }
};

const handleDeleteRow = async (row: SpaceTableRowInterface) => {
  const key = "deleteFile";
  toastStore.toasts.push({
    key,
    complete: 0,
    all: 1,
    title: `Удаление Файла ${row.data.name}`,
    isDone: false,
    isError: false,
  });
  try {
    await spaceStore.deleteFile(row.data.name);
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Файл ${row.data.name} успешно удален`,
      isDone: true,
    });
  } catch (e) {
    spaceStore.errorKeys.push(row.key);
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Не удалось удалить  ${row.data.name}`,
      isError: true,
    });
  } finally {
    await toastStore.deleteToast(key);
  }
};

const handleDownloadFiles = async ({
  sortedData,
}: {
  sortedData: SpaceTableRowInterface[];
}) => {
  const key = "downloadFiles";
  const activeData = sortedData.filter((d) => d.active);
  let isError = false;
  toastStore.toasts.push({
    key,
    complete: 0,
    all: activeData.length,
    title: "",
    isDone: false,
    isError,
  });
  let resolve = 0;
  for (const row of activeData) {
    try {
      await toastStore.changeToast(key, {
        title: `Скачивание файла ${row.data.name}`,
        isError,
      });
      await new FileService().downloadFile(row.data.name);
      resolve += 1;
      await toastStore.changeToast(key, { complete: resolve });
    } catch (e) {
      spaceStore.errorKeys.push(row.key);
      isError = true;
    }
  }
  if (!isError) {
    await toastStore.changeToast(key, {
      isDone: true,
      title: `Файлы успешно скачены`,
    });
  } else {
    await toastStore.changeToast(key, {
      isError: true,
      title: `Не удалось скачать файлы`,
    });
  }
  await toastStore.deleteToast(key);
};

const handleDeleteFiles = async ({
  sortedData,
}: {
  sortedData: SpaceTableRowInterface[];
}) => {
  const key = "deleteFiles";
  const activeData = sortedData.filter((d) => d.active);
  let isError = false;
  toastStore.toasts.push({
    key,
    complete: 0,
    all: activeData.length,
    title: "",
    isDone: false,
    isError,
  });
  let resolve = 0;
  for (const row of activeData) {
    try {
      isError = false;
      await toastStore.changeToast(key, {
        title: `Удаление файла ${row.data.name}`,
        isError,
      });
      await spaceStore.deleteFile(row.data.name);
      resolve += 1;
      await toastStore.changeToast(key, { complete: resolve });
    } catch (e) {
      spaceStore.errorKeys.push(row.key);
      isError = true;
    }
  }
  if (!isError) {
    await toastStore.changeToast(key, {
      isDone: true,
      title: `Файлы успешно удалены`,
    });
  } else {
    await toastStore.changeToast(key, {
      isError: true,
      title: `Не удалось удалить файлы`,
    });
  }
  await toastStore.deleteToast(key);
};
</script>

<style>
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

.spaceTable button.spaceActionButton {
  color: #0066ff;
  background: #e8f1ff;
}

.spaceTable button.spaceActionButton:not(:last-child) {
  margin-right: 16px;
}
.nameIcon {
  width: 40px;
  height: 40px;
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;

  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin-right: 23px;
}
.nameCell {
  display: flex;
  align-items: center;
}
</style>
