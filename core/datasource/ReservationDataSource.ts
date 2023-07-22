import { inject, injectable } from 'inversify';
import { AxiosInstance } from '@/config/axios';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitTime = ReservationResponse.GetWaitTime;

export interface IReservationDataSource {
  getTodayReservations(): Promise<GetReservations>;

  getLineEndWaitTime(): Promise<GetWaitTime>;
}

@injectable()
export class ReservationDataSource implements IReservationDataSource {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getTodayReservations(): Promise<GetReservations> {
    const response = await this.axiosInstance.instance('/reservations');
    return response.data;
  }

  async getLineEndWaitTime(): Promise<GetWaitTime> {
    const response = await this.axiosInstance.instance('/lineEndWaitTime');
    return response.data;
  }
}
