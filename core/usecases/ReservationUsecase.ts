import { inject, injectable } from 'inversify';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitTime = ReservationResponse.GetWaitTime;
import type { IReservationRepository } from '@/core/repository/ReservationRepository';
import BaseResponse = CommonResponse.BaseResponse;
import CreateReservation = ReservationRequest.CreateReservation;

export interface IReservationUsecase {
  getTodayReservations(): Promise<GetReservations>;

  getLineEndWaitTime(): Promise<GetWaitTime>;

  createReservation(request: CreateReservation) : Promise<BaseResponse>
}

@injectable()
export class ReservationUsecase implements IReservationUsecase {
  constructor(
    @inject('IReservationRepository') private repository: IReservationRepository
  ) {}

  getTodayReservations(): Promise<GetReservations> {
    return this.repository.getTodayReservations();
  }

  getLineEndWaitTime(): Promise<GetWaitTime> {
    return this.repository.getLineEndWaitTime();
  }

  createReservation(request: CreateReservation): Promise<CommonResponse.BaseResponse> {
    return this.repository.createReservation(request);
  }
}
