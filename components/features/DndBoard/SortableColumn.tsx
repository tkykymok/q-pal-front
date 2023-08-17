'use client';

import React, { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardStatus } from '@/constant/CardStatus';

interface SortableColumnProps {
  status: CardStatus.Status;
  title: string;
  staffId?: number | null;
}

const SortableColumn: FC<SortableColumnProps> = ({
  status,
  title,
  staffId = null,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: staffId ? `${status}-${staffId}` : status });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`
        mx-3
        rounded-md
        bg-white
        shadow-xl
        border-4
        border-green-300
      `}
    >
      <div
        className={`
          p-5 
          flex 
          bg-in-progress
        `}
      >
        <div className="flex text-neutral-700 font-medium select-none">
          {title}
        </div>
      </div>
      <hr />
      <div className="min-h-20 py-2" />
    </div>
  );
};

export default SortableColumn;
