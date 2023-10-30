import container from '@/config/di';
import useSWR from 'swr';
import { CardStatus } from '@/constant/CardStatus';
import { IMenuUsecase } from '@/domain/usecases/MenuUsecase';
import { Menu } from '@/domain/types/models/Menu';

export const useMenu = () => {
  const menuUsecase = container.get<IMenuUsecase>('IMenuUsecase');

  /**
   * メニュー一覧を取得する
   */
  const fetchMenus = async () => {
    return await menuUsecase.getMenus();
  };

  const { data: menus } = useSWR<Menu[]>('menus', fetchMenus);

  return {
    menus,
  };
};
