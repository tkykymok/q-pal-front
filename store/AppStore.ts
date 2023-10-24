import create, { SetState, GetState } from 'zustand';

type AppStore = {
  isLoading: boolean;
  setLoading: (loadingState: boolean) => void;
};

const useAppStore = create<AppStore>(
  (set: SetState<AppStore>, get: GetState<AppStore>) => ({
    isLoading: false,
    setLoading: (loadingState: boolean) => set({ isLoading: loadingState }),
  })
);

export default useAppStore;
