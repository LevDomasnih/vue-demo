import { BaseService } from "@/services/base.service";
import type { FileInterface } from "@/models/file.interface";
import type { AxiosResponse } from "axios";

export class FileService {
  private base: BaseService;

  constructor() {
    this.base = BaseService.getInstance();
  }

  async getFiles(): Promise<AxiosResponse<FileInterface[]>> {
    return await this.base.getAxiosClient().get<FileInterface[]>("/list");
  }

  async addFile(
    formData: FormData,
    filename: string
  ): Promise<AxiosResponse<FileInterface[]>> {
    return await this.base
      .getAxiosClient()
      .post<FileInterface[]>("/file", formData, {
        params: {
          filename,
        },
      });
  }

  async deleteFile(filename: string): Promise<AxiosResponse<string>> {
    return await this.base.getAxiosClient().delete<string>("/file", {
      params: {
        filename,
      },
    });
  }

  async downloadFile(filename: string): Promise<void> {
    const { data } = await this.base.getAxiosClient().get<Blob>("/file", {
      responseType: "arraybuffer",
      params: {
        filename,
      },
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }

  async editFilename(
    filename: string,
    newName: string
  ): Promise<AxiosResponse<FileInterface>> {
    return await this.base.getAxiosClient().put<FileInterface>(
      "/file",
      {
        name: newName,
      },
      {
        params: {
          filename,
        },
      }
    );
  }
}
