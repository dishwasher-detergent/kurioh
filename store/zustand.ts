"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Current {
  id: string;
  title: string;
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

export interface Profile {
  id: string;
  name: string;
  email: string;
}

type ProfileStore = {
  profile: Profile | null;
  update: (profile: Profile) => void;
  remove: () => void;
};

export const useProfileStore = create(
  persist<ProfileStore>(
    (set) => ({
      profile: null,
      remove: () => set({ profile: null }),
      update: (x) => set({ profile: x }),
    }),
    {
      name: "profile-storage",
      skipHydration: true,
    },
  ),
);
