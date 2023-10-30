import { inject, injectable } from 'inversify';
import type { IMenuRepository } from '@/domain/repository/MenuRepository';
import { Menu } from '@/domain/types/models/Menu';

export interface IMenuUsecase {
  getMenus(): Promise<Menu[]>;
}

@injectable()
export class MenuUsecase implements IMenuUsecase {
  constructor(@inject('IMenuRepository') private repository: IMenuRepository) {}

  async getMenus(): Promise<Menu[]> {
    const response = await this.repository.getMenus();
    return response.data as Menu[];
  }
}
