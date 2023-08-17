'use client';

import React, { FC, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Timer from '@/components/Timer';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import { useReservation } from '@/hooks/useReservation';
import PENDING = CardStatus.PENDING;
import CANCELED = CardStatus.CANCELED;
import {mutate} from 'swr';

interface CardProps {
  reservation?: Reservation;
  id: string;
  children: ReactNode;
  isDraggable: boolean;
}

const DraggableCard: FC<CardProps> = ({
  id,
  reservation,
  children,
  isDraggable,
}) => {
  const { attributes, listeners, setNodeRef, active } = useDraggable({
    id,
    disabled: !isDraggable,
  });
  
  const { updateReservationStatus } = useReservation();

  /**
   * 保留時間切れ時に自動キャンセル
   */
  const handleOnTimesUp = async () => {
    if (!reservation) return;
    await updateReservationStatus(reservation.reservationId, CANCELED, reservation.status)
    await mutate('reservations');
  }

  return (
    <>
      {reservation?.status === PENDING && (
        <Timer holdStartDatetime={reservation.holdStartDatetime} onTimesUp={handleOnTimesUp} />
      )}
      <div
        ref={setNodeRef}
        className={`
        ${active?.id === id ? 'opacity-20' : ''}
      `}
        {...listeners}
        {...attributes}
      >
        {children}
      </div>
    </>
  );
};

export default DraggableCard;
