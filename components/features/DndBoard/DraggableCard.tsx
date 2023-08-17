'use client';

import React, { FC, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Timer from '@/components/Timer';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import PENDING = CardStatus.PENDING;

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

  return (
    <>
      {reservation?.status === PENDING && (
        <Timer holdStartDatetime={reservation.holdStartDatetime} />
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
