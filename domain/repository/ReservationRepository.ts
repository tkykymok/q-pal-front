import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import { ApiResponse } from '@/domain/types/responses/CommonResponse';
import {
  CreateReservationRes,
  GetReservationsRes,
  GetWaitingInfoRes,
  UpdateReservationRes,
} from '@/domain/types/responses/ReservationResponse';
import {
  CreateReservationReq,
  GetMyWaitingInfoReq,
  UpdateReservationReq,
} from '@/domain/types/requests/ReservationRequest';

export interface IReservationRepository {
  getTodayReservations(): Promise<ApiResponse<GetReservationsRes>>;

  getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfoRes>>;

  getMyWaitingInfo(
    request: GetMyWaitingInfoReq
  ): Promise<ApiResponse<GetWaitingInfoRes>>;

  createReservation(
    request: CreateReservationReq
  ): Promise<ApiResponse<CreateReservationRes>>;

  updateReservation(
    request: UpdateReservationReq
  ): Promise<ApiResponse<UpdateReservationRes>>;
}

@injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getTodayReservations(): Promise<ApiResponse<GetReservationsRes>> {
    const response = await this.axiosInstance.instance.get('/reservations/today');
    return response.data;
  }

  async getLineEndWaitingInfo(): Promise<ApiResponse<GetWaitingInfoRes>> {
    const response = await this.axiosInstance.instance.get(
      '/reservations/line-end-wait-time'
    );
    return response.data;
  }

  async getMyWaitingInfo(
    request: GetMyWaitingInfoReq
  ): Promise<ApiResponse<GetWaitingInfoRes>> {
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
    request: UpdateReservationReq
  ): Promise<ApiResponse<UpdateReservationRes>> {
    const response = await this.axiosInstance.instance.put(
      '/update-reservation',
      request
    );
    return response.data;
  }
}
