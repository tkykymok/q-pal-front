'use client';

import React, { FC } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import WAITING = CardStatus.WAITING;
import PENDING = CardStatus.PENDING;
import DONE = CardStatus.DONE;

interface CardContextProps {
  reservation: Reservation;
  isDraggable: boolean;
  forOverlay?: boolean;
}

const CardContext: FC<CardContextProps> = ({
  reservation,
  isDraggable,
  forOverlay = false,
}) => {
  return (
    <div
      className={`
        p-1
        rounded-md
        shadow-xl
        ${forOverlay && 'bg-orange-200'}
        ${!isDraggable && !forOverlay ? 'opacity-60' : ''}
        ${reservation.status === WAITING && 'bg-blue-200'}
        ${reservation.status === PENDING && 'bg-gray-200'}
        ${reservation.status === IN_PROGRESS && 'bg-green-200'}
        ${reservation.status === DONE && 'bg-gray-200'}
      `}
      style={forOverlay ? { transform: 'rotate(3deg)' } : {}}
    >
      <div className="text-neutral-800 p-3">
        <div className="flex justify-between">
          <div>#{reservation.reservationNumber}</div>
          <div>{reservation.customerName}</div>
        </div>
        {(reservation.status === WAITING ||
          reservation.status === IN_PROGRESS) && (
          <>
            <hr className="bg-white my-1" />
            <div>{reservation.menuName}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardContext;
