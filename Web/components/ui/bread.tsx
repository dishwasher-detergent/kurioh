"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PortfoliosSelect } from "@/components/ui/portfolios";
import { ProjectsSelect } from "@/components/ui/projects";
import { usePortfolioStore } from "@/store/zustand";
import { LucideBoxes } from "lucide-react";
import { useParams } from "next/navigation";

export const Bread = () => {
  const params = useParams();
  const { current } = usePortfolioStore();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/portfolio/${current?.id}`}>
              <LucideBoxes className="h-6 w-6 text-primary" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <PortfoliosSelect />
          </BreadcrumbItem>
          {params?.slug && (
            <>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <ProjectsSelect />
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
