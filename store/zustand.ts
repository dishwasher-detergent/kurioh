"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Current {
  id: string;
  slug: string;
}

type PortfolioStore = {
  current: Current | null;
  update: (current: Current) => void;
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
