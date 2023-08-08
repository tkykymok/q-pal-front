// import { inject, injectable } from 'inversify';
// import { AxiosInstance } from '@/config/axios';
// import GetReservations = ReservationResponse.GetReservations;
// import GetWaitingInfo = ReservationResponse.GetWaitingInfo;
// import BaseResponse = CommonResponse.BaseResponse;
// import CreateReservation = ReservationRequest.CreateReservation;
//
// export interface IReservationDataSource {
//   getTodayReservations(): Promise<GetReservations>;
//
//   getLineEndWaitingInfo(): Promise<GetWaitingInfo>;
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
//   async getLineEndWaitingInfo(): Promise<GetWaitingInfo> {
//     const response = await this.axiosInstance.instance.get('/lineEndWaitingInfo');
//     return response.data;
//   }
//
//   async createReservation(request: CreateReservation): Promise<CommonResponse.BaseResponse> {
//     const response = await this.axiosInstance.instance.post('/reservation', request);
//     return response.data;
//   }
// }
