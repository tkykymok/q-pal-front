import { inject, injectable } from 'inversify';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitingInfo = ReservationResponse.GetWaitingInfo;
import CreateReservationReq = ReservationRequest.CreateReservation;
import CreateReservationRes = ReservationResponse.CreateReservation;
import { AxiosInstance } from '@/config/axios';
import ApiResponse = CommonResponse.ApiResponse;
import GetMyWaitingInfo = ReservationRequest.GetMyWaitingInfo;
import UpdateReservation = ReservationRequest.UpdateReservation;

export interface IReservationRepository {
  getTodayReservations(): Promise<ApiResponse<GetReservations>>;

  getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfo>>;

  getMyWaitingInfo(
    request: GetMyWaitingInfo
  ): Promise<ApiResponse<GetWaitingInfo>>;

  createReservation(
    request: CreateReservationReq
  ): Promise<ApiResponse<CreateReservationRes>>;

  updateReservation(
    request: UpdateReservation
  ): Promise<ApiResponse<unknown>>;
}

@injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getTodayReservations(): Promise<ApiResponse<GetReservations>> {
    const response = await this.axiosInstance.instance.get('/reservations/today');
    return response.data;
  }

  async getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfo>> {
    const response = await this.axiosInstance.instance.get(
      '/reservations/line-end-wait-time'
    );
    return response.data;
  }

  async getMyWaitingInfo(
    request: GetMyWaitingInfo
  ): Promise<ApiResponse<GetWaitingInfo>> {
    const response = await this.axiosInstance.instance.get(
      '/reservations/my-wait-time',
      {
        params: request,
      }
    );
    return response.data;
  }

  async createReservation(
    request: CreateReservationReq
  ): Promise<ApiResponse<CreateReservationRes>> {
    const response = await this.axiosInstance.instance.post(
      '/create-reservation',
      request
    );
    return response.data;
  }

  async updateReservation(
    request: UpdateReservation
  ): Promise<ApiResponse<unknown>> {
    const response = await this.axiosInstance.instance.put(
      '/update-reservation',
      request
    );
    return response.data;
  }
}
