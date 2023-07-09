'use client';

import React, { FC, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {CardStatus} from '@/constant/CardStatus';

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
      className="
        m-3
        px-5
        py-2
        rounded-md
        bg-white
        shadow-xl
        border-2
        border-green-400
      "
    >
      <h2 className="p-3">
        {title}
      </h2>
      <hr />
      <div className="min-h-20 py-2" />
    </div>
  );
};

export default SortableColumn;
