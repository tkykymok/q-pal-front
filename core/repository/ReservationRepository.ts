import { inject, injectable } from 'inversify';
import type { IReservationDataSource } from '@/core/datasource/ReservationDataSource';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitTime = ReservationResponse.GetWaitTime;
import BaseResponse = CommonResponse.BaseResponse;
import CreateReservation = ReservationRequest.CreateReservation;

export interface IReservationRepository {
  getTodayReservations(): Promise<GetReservations>;

  getLineEndWaitTime(): Promise<GetWaitTime>;

  createReservation(request: CreateReservation): Promise<BaseResponse>
}

@injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @inject('IReservationDataSource') private datasource: IReservationDataSource
  ) {}

  getTodayReservations(): Promise<GetReservations> {
    return this.datasource.getTodayReservations();
  }

  getLineEndWaitTime(): Promise<GetWaitTime> {
    return this.datasource.getLineEndWaitTime();
  }

  createReservation(request: CreateReservation): Promise<CommonResponse.BaseResponse> {
    return this.datasource.createReservation(request);
  }
}
