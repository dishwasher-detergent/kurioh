"use client";

import { PortfoliosSelect } from "@/components/ui/portfolios";
import { ProjectsSelect } from "@/components/ui/projects";
import { LucideBoxes } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "./button";

export const BreadCrumb = () => {
  const params = useParams();

  return (
    <div>
      <ul className="flex flex-row items-center gap-2 text-sm">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <LucideBoxes className="h-6 w-6 text-primary" />
          </Link>
        </Button>
        <p className="font-bold text-slate-600 dark:text-slate-100">/</p>
        <PortfoliosSelect />
        {params?.slug && (
          <>
            <p className="font-bold text-slate-600 dark:text-slate-100">/</p>
            <ProjectsSelect />
          </>
        )}
      </ul>
    </div>
  );
};
