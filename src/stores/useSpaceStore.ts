import { defineStore } from "pinia";
import { ref } from "vue";
import { FileService } from "@/services/file.service";
import type { FileInterface } from "@/models/file.interface";

export const useSpaceStore = defineStore("spaceStore", () => {
  const files = ref<FileInterface[]>([]);
  const errorKeys = ref<(string | number)[]>([]);

  const getFiles = async () => {
    files.value = (await new FileService().getFiles()).data;
  };

  const addFile = async (formData: FormData, filename: string) => {
    files.value = (await new FileService().addFile(formData, filename)).data;
  };
  const deleteFile = async (filename: string) => {
    await new FileService().deleteFile(filename);
    files.value = files.value.filter((file) => file.name !== filename);
  };

  const editFilename = async (filename: string, newName: string) => {
    const updatedFile = (
      await new FileService().editFilename(filename, newName)
    ).data;
    files.value = files.value.map((file) => {
      if (file.id === updatedFile.id) {
        return updatedFile;
      }
      return file;
    });
  };

  return {
    files,
    getFiles,
    addFile,
    deleteFile,
    editFilename,
    errorKeys,
  };
});
