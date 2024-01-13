"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Portfolios } from "@/interfaces/portfolios";
import { Projects } from "@/interfaces/projects";
import { database_service } from "@/lib/appwrite";
import { PORTFOLIO_COLLECTION_ID } from "@/lib/constants";
import { usePortfolioStore } from "@/store/zustand";
import { Query } from "appwrite";
import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./button";

export const ProjectsSelect = () => {
  const { current, update } = usePortfolioStore();
  const router = useRouter();
  const params = useParams();

  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPortfolios() {
      if (!current) return;

      setLoading(true);

      const res = await database_service.list<Portfolios>(
        PORTFOLIO_COLLECTION_ID,
        [Query.equal("$id", current?.id as string)],
      );

      const projects = res.documents[0].projects;

      console.log(params.slug);

      setProjects(projects);
      setLoading(false);
    }

    fetchPortfolios();
  }, [current, params]);

  return !loading ? (
    <Select
      onValueChange={(e) => {
        router.push(`/${current?.id}/projects/${e}`);
      }}
      value={params?.slug as string}
    >
      <SelectTrigger className="w-36 truncate bg-background">
        <SelectValue
          placeholder="Select a Project"
          defaultValue={params.slug}
        />
      </SelectTrigger>
      <SelectContent>
        {projects.map((item) => (
          <SelectItem key={item.$id} value={item.slug}>
            {item.title}
          </SelectItem>
        ))}
        <Button asChild>
          <Link
            href={`/${current?.id}/projects/create`}
            className="mt-2 w-full"
          >
            <LucidePlus className="mr-2 h-4 w-4" />
            Add
          </Link>
        </Button>
      </SelectContent>
    </Select>
  ) : (
    <Skeleton className="h-9 w-36" />
  );
};
