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
import useBoardStore from '@/store/BoardStore';

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
  const showPendingColumn = useBoardStore((state) => state.showPendingColumn);
  const showCancelColumn = useBoardStore((state) => state.showCancelColumn);
  const setShowColumn = useBoardStore((state) => state.setShowColumn);

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
        w-full
      `}
      key={card.reservationId}
    >
      <DraggableCard
        id={`card-${card.reservationId}`}
        reservation={card}
        isDraggable={isDraggable(card)}
      >
        <CardContext reservation={card} isDraggable={isDraggable(card)} />
      </DraggableCard>
    </div>
  );

  const renderCards = () => {
    return reservations.map((card) => getCard(card));
  };

  const collapsibleStatuses = [PENDING, CANCELED];

  // Header
  const statusColors = {
    [WAITING]: 'bg-waiting',
    [PENDING]: 'bg-pending',
    [IN_PROGRESS]: 'bg-in-progress',
    [DONE]: 'bg-done',
    [CANCELED]: 'bg-cancelled',
  };
  const getBackgroundColor = (status: Status) => {
    return statusColors[status] || '';
  };
  const backgroundColor = getBackgroundColor(status);
  const HeaderContent = () => (
    <div className="sticky top-0 bg-white text-neutral-700 font-medium select-none z-10">
      <div
        className={`p-5 flex justify-between ${backgroundColor}`}
        onClick={onClickHeader}
      >
        <div className="flex">
          <div>{title}</div>
          {collapsibleStatuses.includes(status) && (
            <span className="flex transition group-open:rotate-180 group-open:items-end">
              <svg fill="none" height="24" stroke="currentColor" width="24">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          )}
        </div>
        <div className="flex text-lg">{getNumberOfCards()}</div>
      </div>
      <hr />
    </div>
  );

  // カードの合計数を取得する
  const getNumberOfCards = () => {
    return reservations.length;
  };

  // Content
  const CardContent = () => (
    <div className="flex flex-wrap min-h-24 py-2 pr-5">{renderCards()}</div>
  );

  // 開閉可能Content
  const CollapsibleContent = () => (
    <details
      className="group cursor-pointer"
      open={isCollapsibleContentOpen()}
      onClick={() => setShowColumn(status)}
    >
      <summary className="list-none">
        <HeaderContent />
      </summary>
      {isCollapsibleContentOpen() && <CardContent />}
    </details>
  );

  const isCollapsibleContentOpen = () => {
    switch (status) {
      case PENDING:
        return showPendingColumn;
      case CANCELED:
        return showCancelColumn;
      default:
        return true;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        mx-3
        rounded-md
        bg-white
        shadow-xl
        overflow-y-auto
        transition-all
        duration-300
        ${renderStarted ? 'opacity-100' : 'opacity-0'}
        ${status === WAITING && ''}
        ${status === DONE && ''}
        ${status === PENDING && ''}
        ${status === CANCELED && ''}
        ${
          isOver &&
          (activeCard?.status !== status || activeCard.staffId !== staffId) &&
          'scale-105'
        }
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
