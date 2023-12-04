"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PortfolioStore = {
  current: string | null;
  update: (current: string) => void;
  remove: () => void;
};

export const usePortfolioStore = create(
  persist<PortfolioStore>(
    (set) => ({
      current: null,
      remove: () => set({ current: null }),
      update: (x) => set({ current: x }),
    }),
    {
      name: "porti-storage",
      skipHydration: true,
    },
  ),
);
