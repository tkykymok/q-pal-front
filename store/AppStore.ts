import create, { SetState, GetState } from 'zustand';

// Define a state type
type AppStore = {
  isLoading: boolean;
  setLoading: (loadingState: boolean) => void;
};

// Define your store
const useAppStore = create<AppStore>((set: SetState<AppStore>, get: GetState<AppStore>) => ({
  isLoading: false,
  setLoading: (loadingState: boolean) => set({ isLoading: loadingState }),
}));

export default useAppStore;
