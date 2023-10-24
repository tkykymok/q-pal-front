'use client';

import DndBoard from '@/components/features/DndBoard/DndBoard';
import Toast from '@/components/Toast';
import messageStore from '@/store/MessageStore';

const Board = () => {
  const { type, messages } = messageStore();

  return (
    <div className="w-full overflow-hidden">
      {type &&
        messages &&
        messages.map((msg, index) => (
          <Toast key={index} content={msg} type={type} />
        ))}
      <DndBoard />
    </div>
  );
};

export default Board;
