"use client";

import { portfolioIdAtom } from "@/atoms/portfolio";
import { Portfolio } from "@/interfaces/portfolio.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Usable, use, useEffect } from "react";

interface Params {
  portfolio: string;
}

interface Props {
  params: Usable<Params>;
}

export default async function PortfolioPage({ params }: Props) {
  const [portfolioId, setPortfolioId] = useAtom(portfolioIdAtom);
  const router = useRouter();
  const { portfolio: portfolioParam } = use(params);

  useEffect(() => {
    async function validatePortfolio() {
      try {
        const { database } = await createClient();
        await database.getDocument<Portfolio>(
          DATABASE_ID,
          PORTFOLIOS_COLLECTION_ID,
          portfolioParam,
        );

        setPortfolioId(portfolioParam);
      } catch {
        setPortfolioId(null);
        router.push("not-found");
      }
    }

    if (portfolioParam != portfolioId) {
      validatePortfolio();
    }
  }, []);

  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        Project Main Page
      </main>
    </>
  );
}
