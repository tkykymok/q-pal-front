'use client';

import React, { FC, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  status: string;
  title: string;
  children: ReactNode
}

const DraggableSortableCard: FC<CardProps> = ({ status, title, children }) => {
  const { attributes: draggableAttributes, listeners: draggableListeners, setNodeRef, transform, active } = useDraggable({ id: status });
  const { attributes: sortableAttributes, listeners: sortableListeners, transform: sortableTransform, transition } = useSortable({ id: status });

  // Merge attributes and listeners
  const mergedAttributes = { ...draggableAttributes, ...sortableAttributes };
  const mergedListeners = { ...draggableListeners, ...sortableListeners };

  // Decide which transform to apply
  const appliedTransform = active ? transform : sortableTransform;

  const style = {
    transform: CSS.Transform.toString(appliedTransform),
    transition,
  };

  return (

    <div
      ref={setNodeRef}
      {...mergedListeners}
      {...mergedAttributes}
      style={style}
      className="w-full p-5 rounded-md  bg-white shadow-xl"
    >
      <h2 className="p-3">{title}</h2>
      <hr />
      <div
        className="h-full max-h-72 overflow-y-auto scrollbar-hide py-4"
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableSortableCard;
