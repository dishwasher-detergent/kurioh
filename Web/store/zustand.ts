"use client";

import { auth_service } from "@/lib/appwrite";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface Current {
  id: string;
  title: string;
}

type PortfolioStore = {
  current: Current | null;
  update: (current: Current) => void;
  remove: () => void;
};

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const response = await auth_service.getPrefs();
    const item = response[name];
    return item || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const response = await auth_service.getPrefs();

    await auth_service.updatePrefs({
      ...response,
      [name]: value,
    });
  },
  removeItem: async (name: string): Promise<void> => {
    const response = await auth_service.getPrefs();

    delete response[name];

    await auth_service.updatePrefs({
      ...response,
    });
  },
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
      skipHydration: false,
      storage: createJSONStorage(() => storage),
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
