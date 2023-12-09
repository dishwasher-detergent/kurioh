"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Portfolios } from "@/interfaces/portfolios";
import { PORTFOLIO_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { usePortfolioStore } from "@/store/zustand";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

export const PortfoliosSelect = () => {
  const { current, update } = usePortfolioStore();
  const router = useRouter();
  const params = useParams();

  const [portfolios, setPortfolios] = useState<Portfolios[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPortfolios() {
      setLoading(true);
      const res = await database_service.list<Portfolios>(
        PORTFOLIO_COLLECTION_ID,
      );

      setPortfolios(res.documents);
      setLoading(false);
    }

    fetchPortfolios();
  }, [current]);

  useEffect(() => {
    usePortfolioStore.persist.rehydrate();
  }, []);

  return !loading ? (
    <Select
      onValueChange={(e) => {
        const data = JSON.parse(e);

        update(data);
        router.push(`/${data.slug}`);
      }}
      value={`{"slug": "${current?.slug}", "id": "${current?.id}"}`}
    >
      <SelectTrigger className="w-full truncate">
        <SelectValue placeholder="Portfolio" defaultValue={params.port_slug} />
      </SelectTrigger>
      <SelectContent>
        {portfolios.map((item) => (
          <SelectItem
            key={item.$id}
            value={`{"slug": "${item.slug}", "id": "${item.$id}"}`}
          >
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <Skeleton className="h-8 w-full" />
  );
};
