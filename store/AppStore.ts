import create, { SetState, GetState } from 'zustand';
import { CardStatus } from '@/constant/CardStatus';
import Status = CardStatus.Status;
import PENDING = CardStatus.PENDING;
import CANCELED = CardStatus.CANCELED;

type AppStore = {
  isLoading: boolean;
  setLoading: (loadingState: boolean) => void;
  showPendingColumn: boolean;
  showCancelColumn: boolean;
  setShowColumn: (status: Status) => void;
};

const useAppStore = create<AppStore>(
  (set: SetState<AppStore>, get: GetState<AppStore>) => ({
    isLoading: false,
    setLoading: (loadingState: boolean) => set({ isLoading: loadingState }),
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

export default useAppStore;
