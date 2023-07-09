'use client';

import React, { FC, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableCard from '@/components/features/DndBoard/DraggableCard';
import CardContext from '@/components/features/DndBoard/CardContext';
import { CardStatus, CardType } from '@/constant/CardStatus';
import Status = CardStatus.Status;

interface ColumnProps {
  status: Status;
  title: string;
  staffId?: number | null;
  onClickHeader?: () => void;
  cardsList?: CardType[];
}

const DroppableColumn: FC<ColumnProps> = ({
  status,
  title,
  staffId = null,
  onClickHeader,
  cardsList = [],
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: staffId ? `${status}-${staffId}` : status,
  });

  const [renderStarted, setRenderStarted] = useState(false);

  // コンポーネントがマウントされたときにrenderStartedをtrueに変更します。
  // このuseEffectは初回レンダリングの後にのみ実行されます。
  useEffect(() => {
    setRenderStarted(true);
  }, []);

  const isDraggable = (card: CardType) => {
    if (status === CardStatus.WAITING) {
      return cardsList.findIndex((c) => c.customerId === card.customerId) === 0;
    } else if (status === CardStatus.DONE) {
      return false;
    }
    return true;
  };

  const getCard = (card: CardType) => (
    <div
      className={`
        m-3
        px-5
        w-full
      `}
      key={card.reservationNo}
    >
      <DraggableCard
        id={`card-${card.customerId}`}
        status={card.status}
        isDraggable={isDraggable(card)}
      >
        <CardContext card={card} isDraggable={isDraggable(card)} />
      </DraggableCard>
    </div>
  );

  const renderCards = (staffId: number | null | undefined) => {
    switch (status) {
      case CardStatus.IN_PROGRESS:
        return cardsList.map((card) => {
          if (card.staffId === staffId) {
            return getCard(card);
          }
          return null; // staffIdが一致しない場合にはnullを返す
        });
      default:
        return cardsList.map((card) => getCard(card));
    }
  };

  const getNumberOfCards = () => {
    switch (status) {
      case CardStatus.IN_PROGRESS:
        return cardsList.filter((card) => card.staffId === staffId).length;
      default:
        return cardsList.length;
    }
  };

  return (
    <div
      className={`
        mx-3
        rounded-md
        bg-white
        shadow-xl
        overflow-y-auto
        scrollbar-hide
        transition-all
        duration-500
        ease-in-out
        ${isOver ? 'bg-green-100' : ''}
        ${renderStarted ? 'opacity-100' : 'opacity-0'}
        ${status === CardStatus.WAITING && 'max-h-168'}
        ${status === CardStatus.PENDING && 'max-h-60'}
      `}
    >
      <div className="sticky top-0 bg-white z-10">
        <h2 className="p-5 flex justify-between" onClick={onClickHeader}>
          <div>{title}</div>
          <div>{getNumberOfCards()}</div>
        </h2>
        <hr />
      </div>
      <div
        ref={setNodeRef}
        className={`
          flex
          flex-wrap
          min-h-24
          py-2
        `}
      >
        <>{renderCards(staffId)}</>
      </div>
    </div>
  );
};

export default DroppableColumn;
