'use client';

import React, { FC } from 'react';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import WAITING = CardStatus.WAITING;
import PENDING = CardStatus.PENDING;
import DONE = CardStatus.DONE;
import Status = CardStatus.Status;
import CANCELED = CardStatus.CANCELED;
import { BsPersonCheckFill } from 'react-icons/bs';

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
  const getBackgroundColor = (status: Status, forOverlay: boolean) => {
    if (forOverlay) return 'bg-drag-child';
    switch (status) {
      case WAITING:
        return 'bg-waiting-child';
      case PENDING:
        return 'bg-pending-child';
      case IN_PROGRESS:
        return 'bg-in-progress-child';
      case DONE:
        return 'bg-done-child';
      case CANCELED:
        return 'bg-cancelled-child';
      default:
        return '';
    }
  };

  const opacityClass = !isDraggable && !forOverlay ? 'opacity-60' : '';
  const backgroundColor = getBackgroundColor(reservation.status, forOverlay);
  const rotationStyle = forOverlay ? { transform: 'rotate(3deg)' } : {};

  return (
    <div
      className={`p-1 rounded-md shadow-xl select-none ${opacityClass} ${backgroundColor}`}
      style={rotationStyle}
    >
      <div className="text-neutral-800 p-3">
        <div className="flex justify-between">
          <div className="flex items-center">
            #{reservation.reservationNumber}
            {reservation.arrivalFlag && reservation.status === WAITING && (
              <div className="ml-2">
                <BsPersonCheckFill color="green" size={20} />
              </div>
            )}
          </div>
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
