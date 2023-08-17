import { useEffect, useMemo, useState } from 'react';
import {
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import useSWR, { mutate } from 'swr';
import container from '@/config/di';
import { DragStartEvent } from '@dnd-kit/core/dist/types/events';
import { arrayMove } from '@dnd-kit/sortable';
import { CardStatus, ColumnType } from '@/constant/CardStatus';
import { IReservationUsecase } from '@/domain/usecases/ReservationUsecase';
import { Reservation } from '@/domain/types/models/Reservation';
import { isBrowser } from 'react-device-detect';
import { IStaffUsecase } from '@/domain/usecases/StaffUsecase';
import { Staff } from '@/domain/types/models/Staff';
import Status = CardStatus.Status;
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import DONE = CardStatus.DONE;
import CANCELED = CardStatus.CANCELED;
import UpdateReservation = ReservationRequest.UpdateReservation;
import UpdateActiveStaffs = StaffRequest.UpdateActiveStaffs;
import UpdateActiveStaffsData = StaffRequest.UpdateActiveStaffsData;

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);
const staffUsecase = container.get<IStaffUsecase>('IStaffUsecase');

/**
 * 今日の予約一覧を取得する
 */
const fetchTodayReservations = async () => {
  return await reservationUsecase.getTodayReservations();
};

/**
 * スタッフ一覧を取得する
 */
const fetchStaffs = async () => {
  return await staffUsecase.getStaffs();
};

export const useDndBoard = () => {
  const [activeCard, setActiveCard] = useState<Reservation>();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldSwitchColumn, setShouldSwitchColumn] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforeUpdate, setBeforeUpdate] = useState<Reservation | null>(null);

  const activationOptions = {
    activationConstraint: {
      delay: isBrowser ? 0 : 100,
      tolerance: 0
    }
  };

  const sensor = useSensor(isBrowser ? PointerSensor : TouchSensor, activationOptions);
  const sensors = useSensors(sensor);

  const {
    data: reservations,
    mutate: reservationsMutate,
    error: reservationsError,
    isLoading: reservationsLoading,
  } = useSWR<Reservation[]>('reservations', fetchTodayReservations);

  const {
    data: staffs,
    mutate: staffsMutate,
    error: staffsError,
    isLoading: staffsLoading,
  } = useSWR<Staff[]>('staffs', fetchStaffs);

  useEffect(() => {
    if (staffs) {
      const workingStaff = staffs
        .filter((staff) => staff.activeFlag)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setColumns(
        workingStaff.map((staff) => ({
          staffId: staff.staffId,
          status: CardStatus.IN_PROGRESS,
          title: staff.name,
        }))
      );
    }
  }, [setColumns, staffs]);

  // ステータス毎予約一覧
  const reservationsMap = useMemo(() => {
    if (!reservations) {
      return new Map<CardStatus.Status, Reservation[]>();
    }
    // 並び替えたカードをステータスによってMapに格納します。
    const cardMap = reservations.reduce((map, reservation) => {
      const statusGroup = map.get(reservation.status) || [];
      statusGroup.push(reservation);
      map.set(reservation.status, statusGroup);
      return map;
    }, new Map<CardStatus.Status, Reservation[]>());

    // Mapの各エントリに格納された配列を並べ替えます。
    cardMap.forEach((cardArray, status) => {
      cardMap.set(
        status,
        cardArray.sort((a, b) => {
          if (status === DONE) {
            return b.reservationId - a.reservationId;
          }
          return a.reservationId - b.reservationId;
        })
      );
    });
    return cardMap;
  }, [reservations]);

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

  /**
   * ドラッグ開始
   * @param active
   */
  const handleDragStart = ({ active }: DragStartEvent) => {
    const { type: activeType, id: activeId } = extractInfo(
      active.id.toString()
    );

    if (activeType === 'card') {
      setActiveCard(
        reservations?.find((card) => card.reservationId === activeId)
      );
    }
  };

  /**
   * ドラッグ終了
   * @param active
   * @param over
   */
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const { type: activeType, id: activeId } = extractInfo(
      active.id.toString()
    );

    if (activeType === 'card' && over) {
      // For card dragging
      const { type: overType, id: overId } = extractInfo(over.id.toString());

      // // キャンセルへは手動で移動不可
      // if (overType === CANCELED && activeId) {
      //   return;
      // }

      // 案内済みへは案内中からのみ移動可能
      if (overType === DONE && activeId) {
        if (activeCard?.status !== IN_PROGRESS) {
          return;
        }
        setBeforeUpdate(activeCard);

        setTimeout(() => {
          setIsModalOpen(true);
        }, 300);
      }

      await updateReservationStatus(
        activeId,
        overType.toString() as Status,
        activeCard!.status,
        overId ? Number(overId) : null
      );
      setActiveCard(undefined);
    } else if (activeType === IN_PROGRESS && over) {
      // For column dragging
      const { id: overId } = extractInfo(over.id.toString());
      const oldIndex = columns.findIndex((col) => col.staffId === activeId);
      const newIndex = columns.findIndex((col) => col.staffId === overId);
      const newColumns = arrayMove(columns, oldIndex, newIndex);

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

      // activeスタッフの並び順を更新する
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

      staffUsecase
        .updateActiveStaffs(request)
        .then(() => mutate('staffs').then());

      setActiveCard(undefined);
      setShouldSwitchColumn(false);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = async (beforeUpdate: Reservation) => {
    await updateReservationStatus(
      beforeUpdate.reservationId,
      beforeUpdate.status!,
      null,
      beforeUpdate.staffId ? Number(beforeUpdate.staffId) : null
    );
    setIsModalOpen(false);
  };

  // 予約ステータス更新
  const updateReservationStatus = async (
    reservationId: number | null,
    newStatus: Status,
    oldStatus: Status | null,
    staffId: number | null = null,
    menuId: number | null = null
  ) => {
    // reservationIdがnullの場合、何もしない
    if (!reservationId) return;
    // ステータスに変更がないかつスタッフIDが指定されてない場合、何もしない
    if (newStatus === oldStatus && !staffId) return;

    const request: UpdateReservation = {
      reservationId: reservationId,
      status: newStatus,
      staffId: staffId,
      menuId: menuId,
    };

    try {
      const data = await reservationUsecase.updateReservation(request)
      const updatedReservations: Reservation[] = reservations!.map((reservation) => {
        if (reservation.reservationId === data.reservationId) {
          return {
            ...reservation,
            status: data.status,
            staffId: data.staffId,
            holdStartDatetime: data.holdStartDatetime,
            serviceStartDatetime: data.serviceStartDatetime,
            serviceEndDatetime: data.serviceEndDatetime
          } as Reservation;
        }
        return reservation;
      });
      // mutateを使用してデータを更新
      await reservationsMutate(updatedReservations, false);
    } catch (error) {
      // エラーの場合予約一覧を再検索する
      await mutate('reservations');
    }
  };

  const extractInfo = (str: string) => {
    const parts = str.split('-');
    const type = parts[0];
    const id = parts.length < 2 ? null : parseInt(parts[1]);

    return {
      type: type,
      id: id,
    };
  };

  return {
    activeCard,
    setActiveCard,
    isMounted,
    setIsMounted,
    shouldSwitchColumn,
    setShouldSwitchColumn,
    isModalOpen,
    beforeUpdate,
    setIsModalOpen,
    staffs,
    staffsMutate,
    columns,
    setColumns,
    reservationsMap,
    servingStaffIdList,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleConfirm,
    handleCancel,
  };
};
