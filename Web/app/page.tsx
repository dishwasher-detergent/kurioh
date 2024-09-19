"use client";

import { usePortfolioStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main() {
  const { current, update } = usePortfolioStore();
  const router = useRouter();
  const [init, setInit] = useState(true);

  useEffect(() => {
    if(!current && init) {
      setInit(false);
      return;
    }

    if (current) {
      router.push(current.id);
    } else {
      router.push("/portfolio/create");
    }
  }, [current]);
}
