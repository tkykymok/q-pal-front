// import { inject, injectable } from 'inversify';
// import { AxiosInstance } from '@/config/axios';
// import GetReservations = ReservationResponse.GetReservations;
// import GetWaitTime = ReservationResponse.GetWaitTime;
// import BaseResponse = CommonResponse.BaseResponse;
// import CreateReservation = ReservationRequest.CreateReservation;
//
// export interface IReservationDataSource {
//   getTodayReservations(): Promise<GetReservations>;
//
//   getLineEndWaitTime(): Promise<GetWaitTime>;
//
//   createReservation(request: CreateReservation) : Promise<BaseResponse>
// }
//
// @injectable()
// export class ReservationDataSource implements IReservationDataSource {
//   constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}
//
//   async getTodayReservations(): Promise<GetReservations> {
//     const response = await this.axiosInstance.instance.get('/reservations');
//     return response.data;
//   }
//
//   async getLineEndWaitTime(): Promise<GetWaitTime> {
//     const response = await this.axiosInstance.instance.get('/lineEndWaitTime');
//     return response.data;
//   }
//
//   async createReservation(request: CreateReservation): Promise<CommonResponse.BaseResponse> {
//     const response = await this.axiosInstance.instance.post('/reservation', request);
//     return response.data;
//   }
// }
