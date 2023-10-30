import { inject, injectable } from 'inversify';
import { Staff } from '@/domain/types/models/Staff';
import type { IStaffRepository } from '@/domain/repository/StaffRepository';
import {CreateActiveStaffReq, RemoveActiveStaffReq, UpdateActiveStaffsReq} from "@/domain/types/requests/StaffRequest";

export interface IStaffUsecase {
  getStaffs(): Promise<Staff[]>;

  createActiveStaff(request: CreateActiveStaffReq): Promise<void>;

  updateActiveStaffs(request: UpdateActiveStaffsReq): Promise<void>;

  removeActiveStaff(request: RemoveActiveStaffReq): Promise<void>;
}

@injectable()
export class StaffUsecase implements IStaffUsecase {
  constructor(
    @inject('IStaffRepository') private repository: IStaffRepository
  ) {}

  async getStaffs(): Promise<Staff[]> {
    const response = await this.repository.getStaffs();
    return response.data as Staff[];
  }

  async createActiveStaff(
    request: CreateActiveStaffReq
  ): Promise<void> {
    await this.repository.createActiveStaff(request);
    return Promise.resolve(undefined);
  }

  async updateActiveStaffs(
    request: UpdateActiveStaffsReq
  ): Promise<void> {
    await this.repository.updateActiveStaffs(request);
    return Promise.resolve(undefined);
  }

  async removeActiveStaff(
    request: RemoveActiveStaffReq
  ): Promise<void> {
    try {
      await this.repository.removeActiveStaff(request);
      return Promise.resolve(undefined);
    } catch (e) {
      // 共通エラーでメッセージを設定するため、何もしない。
      return Promise.resolve(undefined);
    }
  }
}
