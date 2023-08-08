import { Reservation, WaitingInfo } from '@/domain/types/models/Reservation';
import { FC } from 'react';

interface ReservationCardProps {
  reservation: Reservation;
  waitingInfo?: WaitingInfo;
  backgroundColor?: 'bg-green-100' | 'bg-blue-100' | 'bg-gray-100';
}

const ReservationCard: FC<ReservationCardProps> = ({
  reservation,
  waitingInfo,
  backgroundColor = 'bg-gray-100',
}) => {
  return (
    <div
      className={`
        flex
        justify-center 
        items-center
        w-14
        h-14
        rounded-md
        text-2xl
        ${
          waitingInfo?.reservationNumber === reservation.reservationNumber
            ? `bg-yellow-100`
            : backgroundColor
        }  
      `}
    >
      {reservation.reservationNumber}
    </div>
  );
};

export default ReservationCard;
