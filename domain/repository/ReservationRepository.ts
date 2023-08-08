import { inject, injectable } from 'inversify';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitingInfo = ReservationResponse.GetWaitingInfo;
import CreateReservationReq = ReservationRequest.CreateReservation;
import CreateReservationRes = ReservationResponse.CreateReservation;
import { AxiosInstance } from '@/config/axios';
import ApiResponse = CommonResponse.ApiResponse;
import GetMyWaitingInfo = ReservationRequest.GetMyWaitingInfo;

export interface IReservationRepository {
  getTodayReservations(): Promise<ApiResponse<GetReservations>>;

  getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfo>>;

  getMyWaitingInfo(
    request: GetMyWaitingInfo
  ): Promise<ApiResponse<GetWaitingInfo>>;

  createReservation(
    request: CreateReservationReq
  ): Promise<ApiResponse<CreateReservationRes>>;
}

@injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getTodayReservations(): Promise<ApiResponse<GetReservations>> {
    const response = await this.axiosInstance.instance.get('/reservations');
    return response.data;
  }

  async getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfo>> {
    const response = await this.axiosInstance.instance.get(
      '/lineEndWaitTime'
    );
    return response.data;
  }

  async getMyWaitingInfo(
    request: GetMyWaitingInfo
  ): Promise<ApiResponse<GetWaitingInfo>> {
    const response = await this.axiosInstance.instance.get(
      '/myWaitTime',
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
      '/reservation',
      request
    );
    return response.data;
  }
}
