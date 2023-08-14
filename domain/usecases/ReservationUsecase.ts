import { inject, injectable } from 'inversify';
import type { IReservationRepository } from '@/domain/repository/ReservationRepository';
import CreateReservationReq = ReservationRequest.CreateReservation;
import CreateReservationRes = ReservationResponse.CreateReservation;
import { Reservation, WaitingInfo } from '@/domain/types/models/Reservation';
import GetMyWaitingInfo = ReservationRequest.GetMyWaitingInfo;
import UpdateReservation = ReservationRequest.UpdateReservation;

export interface IReservationUsecase {
  getTodayReservations(): Promise<Reservation[]>;

  getLineEndWaitingInfo(): Promise<WaitingInfo>;

  getMyWaitingInfo(request: GetMyWaitingInfo): Promise<WaitingInfo>;

  createReservation(
    request: CreateReservationReq
  ): Promise<CreateReservationRes>;

  updateReservation(
    request: UpdateReservation
  ): Promise<void>;
}

@injectable()
export class ReservationUsecase implements IReservationUsecase {
  constructor(
    @inject('IReservationRepository') private repository: IReservationRepository
  ) {}

  async getTodayReservations(): Promise<Reservation[]> {
    const response = await this.repository.getTodayReservations();
    return response.data as Reservation[];
  }

  async getLineEndWaitingInfo(): Promise<WaitingInfo> {
    const response = await this.repository.getLineEndWaitingInfo();
    return response.data as WaitingInfo;
  }

  async getMyWaitingInfo(request: GetMyWaitingInfo): Promise<WaitingInfo> {
    const response = await this.repository.getMyWaitingInfo(request);
    return response.data as WaitingInfo;
  }

  async createReservation(
    request: CreateReservationReq
  ): Promise<CreateReservationRes> {
    const response = await this.repository.createReservation(request);
    return response.data as CreateReservationRes;
  }

  async updateReservation(request: UpdateReservation): Promise<void> {
    await this.repository.updateReservation(request);
    return Promise.resolve(undefined);
  }



}
