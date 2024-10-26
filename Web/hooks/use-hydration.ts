"use client";

import { usePortfolioStore } from "@/store/zustand";
import { useEffect, useState } from "react";

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = usePortfolioStore.persist.onHydrate(() =>
      setHydrated(false),
    );

    const unsubFinishHydration = usePortfolioStore.persist.onFinishHydration(
      () => setHydrated(true),
    );

    setHydrated(usePortfolioStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
