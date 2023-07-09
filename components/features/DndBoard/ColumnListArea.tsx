import React, { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface ColumnListAreaProps {
  id: string;
}

const ColumnListArea: FC<ColumnListAreaProps> = ({ id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      ColumnListArea area
    </div>
  );
};

export default ColumnListArea;
