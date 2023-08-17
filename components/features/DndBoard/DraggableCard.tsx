'use client';

import React, { FC, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Timer from '@/components/Timer';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import PENDING = CardStatus.PENDING;
import container from '@/config/di';
import {IReservationUsecase} from '@/domain/usecases/ReservationUsecase';

const reservationUsecase = container.get<IReservationUsecase>(
  'IReservationUsecase'
);

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

  const handleOnTimesUp = () => {

  }


  return (
    <>
      {reservation?.status === PENDING && (
        <Timer holdStartDatetime={reservation.holdStartDatetime} onTimesUp={() => {}} />
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
