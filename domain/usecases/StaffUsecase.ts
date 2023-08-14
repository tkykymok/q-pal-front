import { inject, injectable } from 'inversify';
import { Staff } from '@/domain/types/models/Staff';
import type { IStaffRepository } from '@/domain/repository/StaffRepository';

export interface IStaffUsecase {
  getStaffs(): Promise<Staff[]>;
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
}
