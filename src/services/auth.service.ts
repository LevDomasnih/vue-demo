import { BaseService } from "@/services/base.service";
import type { AxiosError, AxiosResponse } from "axios";
import { isAxiosError } from "axios";

interface LoginData {
  login: string;
  password: string;
}

interface LoginResponse {
  login: string[];
  password: string[];
}

interface LoginToken {
  token: string;
}

interface LoginErrors {
  errors: LoginResponse;
}

export class AuthService {
  private base: BaseService;

  constructor() {
    this.base = BaseService.getInstance();
  }

  async login(
    login: string,
    password: string
  ): Promise<LoginErrors | LoginToken> {
    try {
      const { data } = await this.base
        .getAxiosClient()
        .post<
          LoginResponse | string,
          AxiosResponse<string, LoginResponse>,
          LoginData
        >("/login", {
          login,
          password,
        });

      this.base.setHeaderToken(data);
      return {
        token: data,
      };
    } catch (error) {
      if (isAxiosError<LoginResponse>(error) && error.response?.data) {
        return {
          errors: error.response.data,
        };
      }
      throw error;
    }
  }

  logout() {}
}
