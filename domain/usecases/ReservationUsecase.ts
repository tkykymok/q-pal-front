import { inject, injectable } from 'inversify';
import type { IReservationRepository } from '@/domain/repository/ReservationRepository';
import { Reservation, WaitingInfo } from '@/domain/types/models/Reservation';
import {
  CreateReservationReq,
  GetMyWaitingInfoReq,
  UpdateReservationReq
} from "@/domain/types/requests/ReservationRequest";
import {CreateReservationRes, UpdateReservationRes} from "@/domain/types/responses/ReservationResponse";

export interface IReservationUsecase {
  getTodayReservations(): Promise<Reservation[]>;

  getLineEndWaitingInfo(): Promise<WaitingInfo>;

  getMyWaitingInfo(request: GetMyWaitingInfoReq): Promise<WaitingInfo>;

  createReservation(
    request: CreateReservationReq
  ): Promise<CreateReservationRes>;

  updateReservation(
    request: UpdateReservationReq
  ): Promise<UpdateReservationRes>;
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

  async getMyWaitingInfo(request: GetMyWaitingInfoReq): Promise<WaitingInfo> {
    const response = await this.repository.getMyWaitingInfo(request);
    return response.data as WaitingInfo;
  }

  async createReservation(
    request: CreateReservationReq
  ): Promise<CreateReservationRes> {
    const response = await this.repository.createReservation(request);
    return response.data as CreateReservationRes;
  }

  async updateReservation(
    request: UpdateReservationReq
  ): Promise<UpdateReservationRes> {
    const response = await this.repository.updateReservation(request);
    return response.data as UpdateReservationRes;
  }
}
