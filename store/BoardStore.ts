import create, { SetState, GetState } from 'zustand';
import { CardStatus } from '@/constant/CardStatus';
import Status = CardStatus.Status;
import PENDING = CardStatus.PENDING;
import CANCELED = CardStatus.CANCELED;

type BoardStore = {
  showPendingColumn: boolean;
  showCancelColumn: boolean;
  setShowColumn: (status: Status) => void;
};

const useBoardStore = create<BoardStore>(
  (set: SetState<BoardStore>, get: GetState<BoardStore>) => ({
    showPendingColumn: false,
    showCancelColumn: false,
    setShowColumn: (status: Status) => {
      switch (status) {
        case PENDING:
          set((prev) => ({ showPendingColumn: !prev.showPendingColumn }));
          break;
        case CANCELED:
          set((prev) => ({ showCancelColumn: !prev.showCancelColumn }));
          break;
        default:
          break;
      }
    },
  })
);

export default useBoardStore;
