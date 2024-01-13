"use client";

import { PortfoliosSelect } from "@/components/ui/portfolios";
import { ProjectsSelect } from "@/components/ui/projects";
import { LucideBoxes } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const BreadCrumb = () => {
  const params = useParams();

  return (
    <div>
      <ul className="flex flex-row items-center gap-2 text-sm">
        <Link href="/">
          <LucideBoxes className="h-6 w-6" />
        </Link>
        <p>/</p>
        <PortfoliosSelect />
        {params?.slug && (
          <>
            <p>/</p>
            <ProjectsSelect />
          </>
        )}
      </ul>
    </div>
  );
};
