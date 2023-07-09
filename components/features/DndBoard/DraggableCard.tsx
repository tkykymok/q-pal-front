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
    <div
      ref={setNodeRef}
      className={`
        ${active?.id === id ? 'opacity-20' : ''}
      `}
      {...listeners}
      {...attributes}
    >
      {status === CardStatus.PENDING && <Timer />}
      {children}
    </div>
  );
};

export default DraggableCard;
