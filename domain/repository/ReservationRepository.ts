import { inject, injectable } from 'inversify';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitTime = ReservationResponse.GetWaitTime;
import CreateReservationReq = ReservationRequest.CreateReservation;
import CreateReservationRes = ReservationResponse.CreateReservation;
import {AxiosInstance} from '@/config/axios';

export interface IReservationRepository {
  getTodayReservations(): Promise<GetReservations>;

  getLineEndWaitTime(): Promise<GetWaitTime>;

  createReservation(request: CreateReservationReq): Promise<CreateReservationRes>
}

@injectable()
export class ReservationRepository implements IReservationRepository {

  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getTodayReservations(): Promise<GetReservations> {
    const response = await this.axiosInstance.instance.get('/reservations', {
      params: {}
    } );
    return response.data;
  }

  async getLineEndWaitTime(): Promise<GetWaitTime> {
    const response = await this.axiosInstance.instance.get('/lineEndWaitTime');
    return response.data;
  }

  async createReservation(request: CreateReservationReq): Promise<CreateReservationRes> {
    const response = await this.axiosInstance.instance.post('/reservation', request);
    return response.data;
  }
}
