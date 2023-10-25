import DndBoard from '@/components/features/DndBoard/DndBoard';
import MessageList from "@/components/MessageList";

const Board = () => {
  return (
    <div className="w-full overflow-hidden">
      <MessageList />
      <DndBoard />
    </div>
  );
};

export default Board;
