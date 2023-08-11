'use client';

import React, { FC, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Timer from '@/components/Timer';
import { CardStatus } from '@/constant/CardStatus';

interface CardProps {
  id: string;
  status?: CardStatus.Status;
  children: ReactNode;
  isDraggable: boolean;
}

const DraggableCard: FC<CardProps> = ({
  id,
  status,
  children,
  isDraggable,
}) => {
  const { attributes, listeners, setNodeRef, active } = useDraggable({
    id,
    disabled: !isDraggable,
  });

  return (
    <>
      {status === CardStatus.PENDING && <Timer />}
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
