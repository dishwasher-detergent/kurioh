"use client";

import { useHydration } from "@/hooks/use-hydration";
import { usePortfolioStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
  const { current } = usePortfolioStore();
  const hydrated = useHydration();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (current) {
      router.push(`/portfolio/${current.id}`);
    } else {
      router.push("/portfolio/create");
    }
  }, [current, hydrated]);
}
