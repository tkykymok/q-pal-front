import { inject, injectable } from 'inversify';
import GetReservations = ReservationResponse.GetReservations;
import GetWaitTime = ReservationResponse.GetWaitTime;
import type { IReservationRepository } from '@/domain/repository/ReservationRepository';
import BaseResponse = CommonResponse.BaseResponse;
import CreateReservationReq = ReservationRequest.CreateReservation;
import CreateReservationRes = ReservationResponse.CreateReservation;

export interface IReservationUsecase {
  getTodayReservations(): Promise<GetReservations>;

  getLineEndWaitTime(): Promise<GetWaitTime>;

  createReservation(request: CreateReservationReq) : Promise<CreateReservationRes>
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

  createReservation(request: CreateReservationReq): Promise<CreateReservationRes> {
    return this.repository.createReservation(request);
  }
}
