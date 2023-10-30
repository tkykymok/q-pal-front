import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import {ApiResponse} from "@/domain/types/responses/CommonResponse";
import {GetStaffsRes} from "@/domain/types/responses/StaffResponse";
import {CreateActiveStaffReq, RemoveActiveStaffReq, UpdateActiveStaffsReq} from "@/domain/types/requests/StaffRequest";

export interface IStaffRepository {
  getStaffs(): Promise<ApiResponse<GetStaffsRes>>;

  createActiveStaff(request: CreateActiveStaffReq): Promise<ApiResponse<unknown>>;

  updateActiveStaffs(
    request: UpdateActiveStaffsReq
  ): Promise<ApiResponse<unknown>>;

  removeActiveStaff(request: RemoveActiveStaffReq): Promise<ApiResponse<unknown>>;
}

@injectable()
export class StaffRepository implements IStaffRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getStaffs(): Promise<ApiResponse<GetStaffsRes>> {
    const response = await this.axiosInstance.instance.get('/staffs');
    return response.data;
  }

  async createActiveStaff(
    request: CreateActiveStaffReq
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.post(
      '/create-active-staff',
      request
    );
    return response.data;
  }

  async updateActiveStaffs(
    request: UpdateActiveStaffsReq
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.put(
      '/update-active-staffs',
      request
    );
    return response.data;
  }

  async removeActiveStaff(
    request: RemoveActiveStaffReq
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await this.axiosInstance.instance.delete(
        `/remove-active-staff/${request.staffId}`
      );
      return response.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
