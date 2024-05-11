"use client";

import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/store/zustand";
import Link from "next/link";

export const CreateProject = () => {
  const { current } = usePortfolioStore();

  return (
    <div>
      <Button asChild>
        <Link href={`/portfolio/${current?.id}/projects/create`}>
          Create a new project!
        </Link>
      </Button>
    </div>
  );
};
