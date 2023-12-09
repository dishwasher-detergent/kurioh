"use client";

import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/store/zustand";
import { LucideGhost } from "lucide-react";
import Link from "next/link";

export const ProjectEmpty = () => {
  const { current } = usePortfolioStore();

  return (
    <div className="space-y-4 rounded-lg border bg-slate-100 p-4 dark:bg-slate-800">
      <p className="flex flex-row items-center text-sm font-semibold text-slate-500 dark:text-slate-300">
        <LucideGhost className="mr-2 h-4 w-4" />
        No Projects!
      </p>
      <Button asChild>
        <Link href={`/${current?.slug}/projects/create`}>Create one here!</Link>
      </Button>
    </div>
  );
};
