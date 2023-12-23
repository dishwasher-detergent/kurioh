"use client";

import { Button } from "@/components/ui/button";
import { PortfoliosSelect } from "@/components/ui/portfolios";
import { Profile } from "@/components/ui/profile";
import { usePortfolioStore } from "@/store/zustand";
import {
  LucideBookImage,
  LucideBoxes,
  LucideFolderOpen,
  LucideLoader2,
  LucidePlus,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const Sidebar = () => {
  const { current } = usePortfolioStore();

  return (
    <aside className="flex w-60 flex-col border-r bg-background">
      <div className="flex w-full flex-none flex-row justify-start p-5">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 text-lg font-bold text-primary"
        >
          <LucideBoxes className="h-6 w-6" />
          Porti
        </Link>
      </div>
      <ul className="flex w-full flex-1 flex-col gap-2 overflow-y-auto py-2">
        <li>
          <p className="px-5 text-xs font-semibold text-slate-700 dark:text-slate-100">
            Portfolio Selection
          </p>
        </li>
        <li className="flex w-full flex-row gap-2 px-2">
          <PortfoliosSelect />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link href={`/portfolio/create`} className="flex-none">
                    <LucidePlus className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="capitalize">Create a portfolio.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        {current ? (
          <>
            <li>
              <p className="px-5 pt-5 text-xs font-semibold text-slate-700 dark:text-slate-100">
                Main Menu
              </p>
            </li>
            <li className="flex w-full flex-row gap-2 px-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current.id}`}>
                  <LucideFolderOpen className="h-4 w-4" />
                  Portfolio
                </Link>
              </Button>
            </li>
            <li className="flex w-full flex-row gap-2 px-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current.id}/projects`}>
                  <LucideBookImage className="h-4 w-4" />
                  Projects
                </Link>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild size="icon" variant="outline">
                      <Link
                        href={`/${current.id}/projects/create`}
                        className="flex-none"
                      >
                        <LucidePlus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="capitalize">Create a project.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </>
        ) : (
          <div className="grid w-full place-items-center">
            <LucideLoader2 className="animate-spin" />
          </div>
        )}
      </ul>
      <div className="border-t p-2">
        <Profile />
      </div>
    </aside>
  );
};
