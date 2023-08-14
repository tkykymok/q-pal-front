import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import ApiResponse = CommonResponse.ApiResponse;
import GetStaffs = ReservationResponse.GetStaffs;

export interface IStaffRepository {
  getStaffs(): Promise<ApiResponse<GetStaffs>>;
}

@injectable()
export class StaffRepository implements IStaffRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getStaffs(): Promise<ApiResponse<GetStaffs>> {
    const response = await this.axiosInstance.instance.get(
      '/staffs'
    );
    return response.data;
  }
}
