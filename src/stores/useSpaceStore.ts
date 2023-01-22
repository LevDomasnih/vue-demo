import { defineStore } from "pinia";
import { ref } from "vue";
import { FileService } from "@/services/file.service";
import type { FileInterface } from "@/models/file.interface";

export const useSpaceStore = defineStore("spaceStore", () => {
  const files = ref<FileInterface[]>([]);

  const getFiles = async () => {
    files.value = await new FileService().getFiles();
  };

  return {
    files,
    getFiles,
  };
});
