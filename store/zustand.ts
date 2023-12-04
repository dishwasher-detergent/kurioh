import { create } from "zustand";

type PortfolioStore = {
  current: string | null;
  update: (current: string) => void;
  remove: () => void;
};

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  current: null,
  remove: () => set({ current: null }),
  update: (x) => set({ current: x }),
}));
