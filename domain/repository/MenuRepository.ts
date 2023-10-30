import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import {ApiResponse} from "@/domain/types/responses/CommonResponse";
import {GetMenusRes} from "@/domain/types/responses/MenuResponse";

export interface IMenuRepository {
  getMenus(): Promise<ApiResponse<GetMenusRes>>;
}

@injectable()
export class MenuRepository implements IMenuRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getMenus(): Promise<ApiResponse<GetMenusRes>> {
    const response = await this.axiosInstance.instance.get('/menus');
    return response.data;
  }
}
