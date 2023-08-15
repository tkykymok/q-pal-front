'use client';

import React, { FC, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableCard from '@/components/features/DndBoard/DraggableCard';
import CardContext from '@/components/features/DndBoard/CardContext';
import { CardStatus } from '@/constant/CardStatus';
import { Reservation } from '@/domain/types/models/Reservation';
import Status = CardStatus.Status;
import PENDING = CardStatus.PENDING;
import IN_PROGRESS = CardStatus.IN_PROGRESS;
import DONE = CardStatus.DONE;
import WAITING = CardStatus.WAITING;
import CANCELED = CardStatus.CANCELED;

interface ColumnProps {
  status: Status;
  title: string;
  staffId?: number | null;
  onClickHeader?: () => void;
  reservations?: Reservation[];
  activeCard?: Reservation;
}

const DroppableColumn: FC<ColumnProps> = ({
  status,
  title,
  staffId = null,
  onClickHeader,
  reservations = [],
  activeCard,
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

  const isDraggable = (card: Reservation) => {
    if (status === WAITING) {
      return (
        reservations.findIndex(
          (c) => c.reservationId === card.reservationId
        ) === 0
      );
    } else if (status === DONE) {
      return false;
    }
    return true;
  };

  const getCard = (card: Reservation) => (
    <div
      className={`
        m-3
        px-5
        w-full
      `}
      key={card.reservationId}
    >
      <DraggableCard
        id={`card-${card.reservationId}`}
        status={card.status}
        isDraggable={isDraggable(card)}
      >
        <CardContext reservation={card} isDraggable={isDraggable(card)} />
      </DraggableCard>
    </div>
  );

  const renderCards = (staffId: number | null | undefined) => {
    switch (status) {
      case IN_PROGRESS:
        return reservations.map((card) => {
          if (card.staffId === staffId) {
            return getCard(card);
          }
          return null; // staffIdが一致しない場合にはnullを返す
        });
      default:
        return reservations.map((card) => getCard(card));
    }
  };

  // カードの合計数を取得する
  const getNumberOfCards = () => {
    switch (status) {
      case IN_PROGRESS:
        return reservations.filter((card) => card.staffId === staffId).length;
      default:
        return reservations.length;
    }
  };

  const collapsibleStatuses = [CANCELED];

  // Header
  const HeaderContent = () => (
    <div className="sticky top-0 bg-white z-10">
      <div
        className={`
          p-5 
          flex 
          justify-between
          ${status === WAITING && 'bg-blue-400'}
          ${status === PENDING && 'bg-neutral-300'}
          ${status === IN_PROGRESS && 'bg-green-400'}
          ${status === DONE && 'bg-gray-400'}
          ${status === CANCELED && 'bg-red-400'}
          ${isOver ? 'bg-amber-100' : ''}
        `}
        onClick={onClickHeader}
      >
        <div className="flex">
          <div className="text-neutral-700 font-bold">{title}</div>
          {collapsibleStatuses.includes(status) && (
            <span className="transition group-open:rotate-180 cursor-pointer">
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          )}
        </div>
        <div className="flex">{getNumberOfCards()}</div>
      </div>
      <hr />
    </div>
  );

  // Content
  const CardContent = () => (
    <div ref={setNodeRef} className="flex flex-wrap min-h-24 py-2">
      {renderCards(staffId)}
    </div>
  );

  // 開閉可能Content
  const CollapsibleContent = () => (
    <details className="group">
      <summary className="list-none">
        <HeaderContent />
      </summary>
      <CardContent />
    </details>
  );

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
        ${renderStarted ? 'opacity-100' : 'opacity-0'}
        ${status === WAITING && 'max-h-168'}
        ${status === DONE && 'max-h-168'}
        ${status === PENDING && 'max-h-60'}
      `}
    >
      {collapsibleStatuses.includes(status) ? (
        <CollapsibleContent />
      ) : (
        <>
          <HeaderContent />
          <CardContent />
        </>
      )}
    </div>
  );
};

export default DroppableColumn;
