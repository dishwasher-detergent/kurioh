"use client";

import { usePortfolioStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
  const { current, update } = usePortfolioStore();
  const router = useRouter();

  useEffect(() => {
    if (current) {
      router.push(current.id);
    } else {
      router.push("/portfolio/create");
    }
  }, [current]);
}
