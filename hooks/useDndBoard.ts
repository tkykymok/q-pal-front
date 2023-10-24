import { useEffect, useState } from 'react';
import {
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragStartEvent } from '@dnd-kit/core/dist/types/events';
import { arrayMove } from '@dnd-kit/sortable';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import { isBrowser } from 'react-device-detect';
import { useReservation } from '@/hooks/useReservation';
import { useStaff } from '@/hooks/useStaff';
import Status = CardStatus.Status;
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import DONE = CardStatus.DONE;
import {ColumnType} from '@/domain/types/models/ColumnType';

export const useDndBoard = () => {
  const [activeCard, setActiveCard] = useState<Reservation>();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldSwitchColumn, setShouldSwitchColumn] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beforeUpdate, setBeforeUpdate] = useState<Reservation | null>(null);

  // 予約カスタムHook
  const { reservations, reservationsMap, updateReservationStatus } =
    useReservation();
  // スタッフカスタムHook
  const { staffs, servingStaffIdList, updateActiveStaffs } =
    useStaff(reservationsMap);

  const activationOptions = {
    activationConstraint: {
      delay: isBrowser ? 0 : 0, // タブレットの場合、ドラッグ時の遅延を設定 TODO 遅延設定不要？
      tolerance: 0,
    },
  };
  const sensor = useSensor(
    isBrowser ? PointerSensor : TouchSensor,
    activationOptions
  );
  const sensors = useSensors(sensor);

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

      // activeスタッフの並び順を更新する
      await updateActiveStaffs(newColumns);

      setActiveCard(undefined);
      setShouldSwitchColumn(false);
    }
  };

  /**
   * 案内済みモーダル確認
   */
  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  /**
   * 案内済みモーダルキャンセル
   */
  const handleCancel = async (beforeUpdate: Reservation) => {
    await updateReservationStatus(
      beforeUpdate.reservationId,
      beforeUpdate.status!,
      null,
      beforeUpdate.staffId ? Number(beforeUpdate.staffId) : null
    );
    setIsModalOpen(false);
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
    // staffsMutate,
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
