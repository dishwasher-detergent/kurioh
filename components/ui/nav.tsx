"use client";

import { BreadCrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Profile } from "@/components/ui/profile";
import { usePortfolioStore } from "@/store/zustand";
import { LucideLoader2 } from "lucide-react";
import Link from "next/link";

export const Nav = () => {
  const { current } = usePortfolioStore();

  return (
    <nav className="flex w-full flex-none flex-col flex-nowrap items-center gap-4 border-b bg-background px-2 pb-2 pt-4 md:px-4">
      <ul className="flex w-full flex-row flex-nowrap justify-between gap-4 pl-2">
        <li className="flex items-center">
          <BreadCrumb />
        </li>
        <li className="flex items-center">
          <Profile />
        </li>
      </ul>
      <ul className="flex w-full flex-row">
        {current ? (
          <>
            <li className="flex flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current.id}`}>Portfolio</Link>
              </Button>
            </li>
            <li className="flex flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current.id}/projects`}>Projects</Link>
              </Button>
            </li>
            <li className="flex flex-row gap-2">
              <Button
                asChild
                variant="ghost"
                className="flex flex-1 flex-row justify-start gap-4"
              >
                <Link href={`/${current.id}/experience`}>Experience</Link>
              </Button>
            </li>
          </>
        ) : (
          <div className="grid place-items-center">
            <LucideLoader2 className="animate-spin" />
          </div>
        )}
      </ul>
    </nav>
  );
};
