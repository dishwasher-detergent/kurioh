"use client";

import { usePortfolioStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main() {
  const [times, setTimes] = useState(0);
  const { current } = usePortfolioStore();
  const router = useRouter();

  useEffect(() => {
    if(times == 0 && !current) return;

    if (current) {
      router.push(current.id);
    } else {
      router.push("/portfolio/create");
    }
  }, [current]);
}
