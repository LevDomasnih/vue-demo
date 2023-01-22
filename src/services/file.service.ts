import { BaseService } from "@/services/base.service";
import type { FileInterface } from "@/models/file.interface";

export class FileService {
  private base: BaseService;

  constructor() {
    this.base = BaseService.getInstance();
  }

  async getFiles(): Promise<FileInterface[]> {
    const { data } = await this.base
      .getAxiosClient()
      .get<FileInterface[]>("/list");
    return data;
  }
}
