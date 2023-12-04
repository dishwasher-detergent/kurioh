"use client";

import { Button } from "@/components/ui/button";
import { PortfoliosSelect } from "@/components/ui/portfolios";
import { Profile } from "@/components/ui/profile";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { usePortfolioStore } from "@/store/zustand";
import {
  LucideBookImage,
  LucideBoxes,
  LucideFolderOpen,
  LucidePenLine,
  LucidePlus,
} from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  const { current } = usePortfolioStore();

  return (
    <aside className="flex w-60 flex-col border-r shadow">
      <div className="flex h-16 w-full flex-none flex-row justify-center px-5">
        <h1 className="flex flex-row items-center gap-2 text-lg font-bold text-primary">
          <LucideBoxes className="h-6 w-6" />
          Porti
        </h1>
      </div>
      <ul className="flex w-full flex-1 flex-col gap-2 overflow-y-auto p-2">
        <li>
          <PortfoliosSelect />
        </li>
        {current && (
          <>
            <li className="flex w-full flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current}/portfolio`}>
                  <LucideFolderOpen className="h-4 w-4" />
                  Portfolio
                </Link>
              </Button>
            </li>
            <li className="flex w-full flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current}/projects`}>
                  <LucideBookImage className="h-4 w-4" />
                  Projects
                </Link>
              </Button>
              <Button asChild size="icon" variant="secondary">
                <Link href={`/${current}/projects/create`}>
                  <LucidePlus className="h-4 w-4" />
                </Link>
              </Button>
            </li>
            <li className="flex w-full flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current}/articles`}>
                  <LucidePenLine className="h-4 w-4" />
                  Articles
                </Link>
              </Button>
              <Button asChild size="icon" variant="secondary">
                <Link href={`/${current}/articles/create`}>
                  <LucidePlus className="h-4 w-4" />
                </Link>
              </Button>
            </li>
          </>
        )}
      </ul>
      <div className="border-t p-2">
        <ModeToggle />
      </div>
      <div className="border-t p-2">
        <Profile />
      </div>
    </aside>
  );
};
