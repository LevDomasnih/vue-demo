<template>
  <div class="space">
    <div class="spaceHeader">
      <h1>Ваши файлы</h1>
      <input
        ref="fileUploadRef"
        type="file"
        @change="handleUploadFileChange($event)"
        hidden
      />
      <ui-button size="S" class="addButton" @click="handleUploadFile">
        Добавить
      </ui-button>
    </div>
    <space-table @edit-row="handleEditRow($event)" />
    <teleport to="body">
      <modal
        :show="editedFileName.showModal"
        @close="editedFileName.showModal = false"
        @ok="handleSaveNewFileName"
      >
        <template #header>
          <h3>Смена имени файла</h3>
        </template>
        <template #body>
          <ui-input v-model="editedFileName.fileName" />
        </template>
      </modal>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import UiButton from "@/common/ui/UiButton.vue";
import { onMounted, reactive, ref } from "vue";
import { useSpaceStore } from "@/stores/useSpaceStore";
import type { FileEventInterface } from "@/models/file-event.interface";
import Modal from "@/common/ui/Modal.vue";
import UiInput from "@/common/ui/UiInput.vue";
import { useToastStore } from "@/stores/useToastStore";
import SpaceTable from "@/pages/Space/components/SpaceTable.vue";
import type { SpaceTableRowInterface } from "@/models/space-table-row.interface";

interface EditFileName {
  row: null | SpaceTableRowInterface;
  fileName: string;
  showModal: boolean;
}

const spaceStore = useSpaceStore();
const toastStore = useToastStore();

const fileUploadRef = ref<HTMLInputElement>();
const editedFileName = reactive<EditFileName>({
  row: null,
  fileName: "",
  showModal: false,
});

onMounted(() => {
  spaceStore.getFiles();
});

const handleUploadFile = () => {
  if (fileUploadRef.value) {
    fileUploadRef.value.click();
  }
};

const handleEditRow = (row: SpaceTableRowInterface) => {
  editedFileName.row = row;
  editedFileName.fileName = row.data.name;
  editedFileName.showModal = true;
};

const handleUploadFileChange = async (
  event: FileEventInterface<HTMLInputElement>
) => {
  const fileUploaded: File = event.target.files![0];
  const formData = new FormData();
  const key = "uploadFile";
  formData.append("file", fileUploaded);
  toastStore.toasts.push({
    key,
    complete: 0,
    all: 1,
    title: `Загрузка файла ${fileUploaded.name}`,
    isDone: false,
    isError: false,
  });
  try {
    await spaceStore.addFile(formData, fileUploaded.name);
    await toastStore.changeToast(key, {
      isDone: true,
      complete: 1,
      title: `Файл ${fileUploaded.name} успешно загружен`,
    });
  } catch (e) {
    await toastStore.changeToast(key, {
      title: `Файл ${fileUploaded.name} не был загружен`,
      isError: true,
    });
  } finally {
    await toastStore.deleteToast(key);
  }
};

const handleSaveNewFileName = async () => {
  if (!editedFileName.row) {
    return;
  }
  const key = "editFile";
  toastStore.toasts.push({
    key,
    complete: 0,
    all: 1,
    title: `Переименование файла`,
    isDone: false,
    isError: false,
  });
  try {
    await spaceStore.editFilename(
      editedFileName.row.data.name,
      editedFileName.fileName
    );
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Файл успешно переименован`,
      isDone: true,
    });
  } catch (e) {
    spaceStore.errorKeys.push(editedFileName.row.key);
    await toastStore.changeToast(key, {
      complete: 1,
      title: `Не удалось переименовать файл`,
      isError: true,
    });
  } finally {
    await toastStore.deleteToast(key);
    editedFileName.row = null;
    editedFileName.showModal = false;
    editedFileName.fileName = "";
  }
};
</script>

<style scoped>
.space {
  height: 100%;
  width: 100%;
  padding: 63px 135px 0 62px;
}

.addButton {
  margin: 23px 0 63px;
}

.spaceHeader {
  margin-left: 72px;
}

:deep(.modal-body) .input {
  padding: 5px 10px;
}
</style>
