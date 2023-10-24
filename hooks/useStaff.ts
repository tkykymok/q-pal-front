import container from '@/config/di';
import { IStaffUsecase } from '@/domain/usecases/StaffUsecase';
import useSWR, { mutate } from 'swr';
import { Staff } from '@/domain/types/models/Staff';
import { useEffect, useMemo, useState } from 'react';
import { Reservation } from '@/domain/types/models/Reservation';
import { CardStatus } from '@/constant/CardStatus';
import Status = CardStatus.Status;
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import UpdateActiveStaffs = StaffRequest.UpdateActiveStaffs;
import UpdateActiveStaffsData = StaffRequest.UpdateActiveStaffsData;
import {ColumnType} from '@/domain/types/models/ColumnType';

export const useStaff = (reservationsMap: Map<Status, Reservation[]>) => {
  const [staffUsecase, setStaffUsecase] = useState<IStaffUsecase>();
  useEffect(() => {
    const usecase = container.get<IStaffUsecase>('IStaffUsecase');
    setStaffUsecase(usecase);
  }, []);

  /**
   * スタッフ一覧を取得する
   */
  const fetchStaffs = async () => {
    if (!staffUsecase) return [] as Staff[]; // staffUsecase がまだセットされていない場合は空の配列を返す
    return await staffUsecase.getStaffs();
  };

  const {
    data: staffs,
  } = useSWR<Staff[]>(staffUsecase ? 'staffs' : null, fetchStaffs);

  // 接客中スタッフID一覧
  const servingStaffIdList = useMemo(() => {
    if (!reservationsMap.get(IN_PROGRESS)) {
      return [] as number[];
    } else {
      return reservationsMap
        .get(IN_PROGRESS)!
        .filter((reservation) => reservation.staffId !== null)
        .map((reservation) => reservation.staffId);
    }
  }, [reservationsMap]);

  // activeスタッフの並び順を更新する
  const updateActiveStaffs = async (newColumns: ColumnType[]) => {
    //
    const newActiveStaffList = staffs!
      .filter((staff) => staff.activeFlag) // activeスタッフに絞り込む
      .map((staff) => {
        const newOrder = newColumns.findIndex(
          (column) => column.staffId === staff.staffId
        );
        if (newOrder !== -1) {
          return { ...staff, order: newOrder + 1 };
        }
        return staff;
      });

    const request: UpdateActiveStaffs = {
      data: [],
    };
    newActiveStaffList.forEach((staff) => {
      const tempData: UpdateActiveStaffsData = {
        staffId: staff.staffId,
        order: staff.order!,
      };
      request.data.push(tempData);
    });

    try {
      await staffUsecase!.updateActiveStaffs(request);
      await mutate('staffs');
    } catch (error) {
      await mutate('staffs');
    }
  };

  return {
    staffs,
    servingStaffIdList,
    updateActiveStaffs,
  };
};
