'use client';

import { FC } from 'react';
import { CardStatus, CardType } from '@/constant/CardStatus';

interface CardContextProps {
  card: CardType;
  isDraggable: boolean;
  forOverlay?: boolean;
}

const CardContext: FC<CardContextProps> = ({ card, isDraggable, forOverlay = false }) => {
  return (
    <div
      className={`
        p-5
        rounded-md
        shadow-xl
        ${forOverlay && 'bg-orange-200'}
        ${!isDraggable && !forOverlay ? 'opacity-60' : ''}
        ${card.status === CardStatus.WAITING && 'bg-blue-300'}
        ${card.status === CardStatus.PENDING && 'bg-gray-300'}
        ${card.status === CardStatus.IN_PROGRESS && 'bg-green-300'}
        ${card.status === CardStatus.DONE && 'bg-gray-400'}
      `}
      style={forOverlay ? { transform: "rotate(3deg)" } : {}}
    >
      #{card.reservationNo} : {card.name} / {card.menu}
    </div>
  );
};

export default CardContext;
