"use client";

import { usePortfolioStore } from "@/store/zustand";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default async function Main() {
  const { current } = usePortfolioStore();

  useEffect(() => {
    if (current) {
      redirect(current.id);
    } else {
      redirect("/portfolio/create");
    }
  }, []);
}
