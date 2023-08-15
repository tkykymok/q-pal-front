import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import ApiResponse = CommonResponse.ApiResponse;
import GetStaffs = ReservationResponse.GetStaffs;
import UpdateActiveStaffs = StaffRequest.UpdateActiveStaffs;
import CreateActiveStaff = StaffRequest.CreateActiveStaff;
import RemoveActiveStaff = StaffRequest.RemoveActiveStaff;

export interface IStaffRepository {
  getStaffs(): Promise<ApiResponse<GetStaffs>>;

  createActiveStaff(request: CreateActiveStaff): Promise<ApiResponse<unknown>>;

  updateActiveStaffs(
    request: UpdateActiveStaffs
  ): Promise<ApiResponse<unknown>>;

  removeActiveStaff(request: RemoveActiveStaff): Promise<ApiResponse<unknown>>;
}

@injectable()
export class StaffRepository implements IStaffRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getStaffs(): Promise<ApiResponse<GetStaffs>> {
    const response = await this.axiosInstance.instance.get('/staffs');
    return response.data;
  }

  async createActiveStaff(
    request: StaffRequest.CreateActiveStaff
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.post(
      '/create-active-staff',
      request
    );
    return response.data;
  }

  async updateActiveStaffs(
    request: StaffRequest.UpdateActiveStaffs
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.put(
      '/update-active-staffs',
      request
    );
    return response.data;
  }

  async removeActiveStaff(
    request: StaffRequest.RemoveActiveStaff
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.delete(
      `/remove-active-staff/${request.staffId}`
    );
    return response.data;
  }
}
