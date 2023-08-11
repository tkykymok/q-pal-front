import { useEffect, useMemo, useState } from 'react';
import { StaffType } from '@/components/features/DndBoard/DndBoard';
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

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);

/**
 * 今日の予約一覧を取得する
 */
const fetchTodayReservations = async () => {
  return await reservationUsecase.getTodayReservations();
};

export const useDndBoard = () => {
  const [activeCard, setActiveCard] = useState<Reservation>();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldSwitchColumn, setShouldSwitchColumn] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [staffList, setStaffList] = useState<StaffType[]>([
    {
      staffId: 1,
      name: '山田',
      isWorking: true,
      order: 2,
    },
    {
      staffId: 2,
      name: '鈴木',
      isWorking: true,
      order: 1,
    },
    {
      staffId: 3,
      name: '坂本',
      isWorking: false,
      order: null,
    },
    {
      staffId: 4,
      name: '田中',
      isWorking: true,
      order: 3,
    },
    {
      staffId: 5,
      name: '小島',
      isWorking: false,
      order: null,
    },
    {
      staffId: 6,
      name: '後藤',
      isWorking: false,
      order: null,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforeUpdate, setBeforeUpdate] = useState<Reservation | null>(null);

  const sensor = useSensor(isBrowser ? PointerSensor : TouchSensor);
  const sensors = useSensors(sensor);

  const {
    data: reservations,
    mutate,
    error: reservationsError,
    isLoading: reservationsLoading,
  } = useSWR<Reservation[]>('reservations', fetchTodayReservations);

  useEffect(() => {
    const workingStaff = staffList
      .filter((staff) => staff.isWorking)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    setColumns(
      workingStaff.map((staff) => ({
        staffId: staff.staffId,
        status: CardStatus.IN_PROGRESS,
        title: staff.name,
      }))
    );
  }, [setColumns, staffList]);

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

      updateCardStatus(
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
        // Update the 'order' field of each staff in the staffList
        const newStaffList = staffList.map((staff) => {
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
        setStaffList(newStaffList);

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
    updateCardStatus(
      beforeUpdate.reservationId,
      CardStatus.getCardStatus(beforeUpdate.status)!,
      beforeUpdate.staffId ? Number(beforeUpdate.staffId) : null
    );
    setIsModalOpen(false);
  };

  const updateCardStatus = (
    reservationId: number | null,
    newStatus: CardStatus.Status,
    staffId: number | null = null
  ) => {
    // reservationIdがnullの場合、何もしない
    if (!reservationId) return;

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
    mutate(updatedReservations, false).then((r) => {});
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
    staffList,
    setStaffList,
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
