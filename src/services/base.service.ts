import axios from "axios";
import type { AxiosInstance } from "axios";

interface AxiosInstanceConfigureType {
  baseURL: string;
  headers?: object;
  rest?: any;
}

export class BaseService {
  private static instance: BaseService;
  private readonly axiosClient: AxiosInstance;

  private constructor() {
    this.axiosClient = axios.create();
  }

  public static getInstance(): BaseService {
    if (!BaseService.instance) {
      BaseService.instance = new BaseService();
    }

    return BaseService.instance;
  }

  setConfigure(configure: AxiosInstanceConfigureType) {
    const { baseURL, headers = {}, ...rest } = configure;

    this.axiosClient.defaults.baseURL = baseURL;
    this.axiosClient.defaults.headers = {
      ...this.axiosClient.defaults.headers,
      ...headers,
    };
    this.axiosClient.defaults = {
      ...this.axiosClient.defaults,
      ...rest,
    };
  }

  setHeaderToken(userToken: string = "") {
    this.axiosClient.defaults.headers.common['auth-token'] = `Bearer ${userToken}`;
  }

  getAxiosClient() {
    return this.axiosClient;
  }
}
