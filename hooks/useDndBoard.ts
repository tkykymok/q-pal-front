import { useEffect, useMemo, useState } from 'react';
import {
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragStartEvent } from '@dnd-kit/core/dist/types/events';
import { arrayMove } from '@dnd-kit/sortable';
import { CardStatus, ColumnType } from '@/constant/CardStatus';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import container from '@/config/di';
import { IReservationUsecase } from '@/domain/usecases/ReservationUsecase';
import { Reservation } from '@/domain/types/models/Reservation';
import useSWR from 'swr';
import getCardStatus = CardStatus.getCardStatus;
import { isBrowser, isTablet } from 'react-device-detect';
import DONE = CardStatus.DONE;
import CANCELED = CardStatus.CANCELED;
import Status = CardStatus.Status;
import UpdateReservation = ReservationRequest.UpdateReservation;
import {IStaffUsecase} from '@/domain/usecases/StaffUsecase';
import {Staff} from '@/domain/types/models/Staff';

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);
const staffUsecase = container.get<IStaffUsecase>(
  'IStaffUsecase'
);

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

  const sensor = useSensor(isBrowser ? PointerSensor : TouchSensor);
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
      const statusGroup = map.get(getCardStatus(reservation.status)) || [];
      statusGroup.push(reservation);
      map.set(getCardStatus(reservation.status), statusGroup);
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
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const { type: activeType, id: activeId } = extractInfo(
      active.id.toString()
    );

    if (activeType === 'card' && over) {
      // For card dragging
      const { type: overType, id: overId } = extractInfo(over.id.toString());

      // キャンセルへは手動で移動不可
      if (overType === CANCELED && activeId) {
        return;
      }

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

      updateReservationStatus(
        activeId,
        CardStatus.getCardStatus(overType.toString())!,
        overId ? Number(overId) : null
      );
      setActiveCard(undefined);
    } else if (activeType === IN_PROGRESS && over) {
      // For column dragging
      const { id: overId } = extractInfo(over.id.toString());
      const oldIndex = columns.findIndex((col) => col.staffId === activeId);
      const newIndex = columns.findIndex((col) => col.staffId === overId);

      setColumns((columns) => {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        // Update the 'order' field of each staff in the staffs
        const newStaffList = staffs?.map((staff) => {
          const newOrder = newColumns.findIndex(
            (column) => column.staffId === staff.staffId
          );
          // If the staff is found in the columns, update its order
          if (newOrder !== -1) {
            return { ...staff, order: newOrder + 1 };
          }
          // If the staff is not found in the columns (not working), keep its original data
          return staff;
        });
        staffsMutate(newStaffList, false).then((r) => {});

        return newColumns;
      });
      setActiveCard(undefined);
      setShouldSwitchColumn(false);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = (beforeUpdate: Reservation) => {
    updateReservationStatus(
      beforeUpdate.reservationId,
      beforeUpdate.status!,
      beforeUpdate.staffId ? Number(beforeUpdate.staffId) : null
    );
    setIsModalOpen(false);
  };

  // 予約ステータス更新
  const updateReservationStatus = (
    reservationId: number | null,
    newStatus: Status,
    staffId: number | null = null,
    menuId: number | null = null
  ) => {
    // reservationIdがnullの場合、何もしない
    if (!reservationId) return;

    const request: UpdateReservation = {
      reservationId: reservationId,
      status: newStatus,
      staffId: staffId,
      menuId: menuId,
    };

    reservationUsecase.updateReservation(request).then(() => {
      // reservationsを更新
      const updatedReservations = reservations!.map((reservation) => {
        if (reservation.reservationId === reservationId) {
          return {
            ...reservation,
            status: newStatus,
            staffId: staffId || reservation.staffId,
          };
        }
        return reservation;
      });

      // mutateを使用してデータを更新
      reservationsMutate(updatedReservations, false).then((r) => {});
    });
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
