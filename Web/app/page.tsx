"use client";

import { portfolioIdAtom } from "@/atoms/portfolio";
import { Button } from "@/components/ui/button";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";
import { createPortfolio } from "@/lib/utils";

import { useAtom } from "jotai";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [portfolioId, setportfolioId] = useAtom(portfolioIdAtom);
  const [loadingCreatePortfolio, setLoadingCreatePortfolio] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function getportfolios() {
      setLoading(true);
      const { database } = await createClient();
      const user = await getLoggedInUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (portfolioId) {
        router.push(portfolioId);
        return;
      }

      const data = await database.listDocuments(
        DATABASE_ID,
        PORTFOLIOS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)],
      );

      if (data.documents.length > 0) {
        setportfolioId(data.documents[0].$id);
        router.replace(data.documents[0].$id);
      }

      setLoading(false);
    }

    getportfolios();
  }, [portfolioId]);

  async function create() {
    setLoadingCreatePortfolio(true);
    const data = await createPortfolio();

    if (data) {
      setportfolioId(data.$id);
      router.push(data.$id);
    }

    setLoadingCreatePortfolio(false);
  }

  return (
    <main className="grid min-h-dvh w-full place-items-center">
      {loading && (
        <p className="flex flex-row items-center gap-2">
          <LucideLoader2 className="size-4 animate-spin" />
          Checking for existing portfolios
        </p>
      )}
      {!loading && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">
            Looks like you don&apos;t have any orgnaizations created yet.
          </h1>
          <p>Lets get started!</p>
          <Button onClick={create}>
            {loadingCreatePortfolio ? (
              <>
                <LucideLoader2 className="mr-2 size-4 animate-spin" />
                Creating Portfolio
              </>
            ) : (
              <>
                <LucidePlus className="mr-2 size-4" />
                Create Portfolio
              </>
            )}
          </Button>
        </div>
      )}
    </main>
  );
}
