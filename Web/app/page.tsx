"use client";

import { usePortfolioStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main() {
  const [init, setInit] = useState(true);
  const { current } = usePortfolioStore();
  const router = useRouter();

  useEffect(() => {
    console.log(current, init);

    if(init && !current) {
      setInit(false)
      return
    };

    if (current) {
      router.push(current.id);
    } else {
      router.push("/portfolio/create");
    }
  }, [current]);
}
