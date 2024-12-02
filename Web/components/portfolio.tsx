"use client";

import { portfolioIdAtom } from "@/atoms/portfolio";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Portfolio as PortfolioItem } from "@/interfaces/portfolio.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";
import { cn, createPortfolio } from "@/lib/utils";

import { Query } from "appwrite";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown, LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Portfolio() {
  const router = useRouter();

  const [portfolioId, setportfolioId] = useAtom(portfolioIdAtom);
  const [open, setOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreatePortfolio, setLoadingCreatePortfolio] =
    useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  async function fetchPortfolios() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<PortfolioItem>(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
    );

    if (data.documents.length > 0) {
      setPortfolios(data.documents);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (portfolios.length == 0) {
      fetchPortfolios();
    }
  }, [portfolios]);

  useEffect(() => {
    async function checkAuthorization() {
      setLoadingAuth(true);
      setOwner(false);
      const { team } = await createClient();
      const user = await getLoggedInUser();

      if (user && portfolioId) {
        const memberships = await team.listMemberships(portfolioId, [
          Query.equal("userId", user.$id),
        ]);

        if (memberships.memberships[0].roles.includes("owner")) {
          setOwner(true);
        }
      }
      setLoadingAuth(false);
    }

    checkAuthorization();
  }, [portfolioId]);

  async function create() {
    setLoadingCreatePortfolio(true);
    const data = await createPortfolio();

    if (data) {
      setPortfolios((prev) => [...prev, data]);
      setportfolioId(data.$id);
      router.push(data.$id);
    }

    setLoadingCreatePortfolio(false);
  }

  return (
    <>
      {portfolios.length == 0 && !loading ? (
        <Button onClick={create} size="sm">
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
      ) : null}
      {loading && <Skeleton className="h-8 min-w-32" />}
      {portfolios.length > 0 && !loading && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="min-w-32 justify-between truncate font-normal text-muted-foreground md:w-auto"
              >
                <span className="truncate">{portfolioId}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-xs"
                  placeholder="Search portfolio..."
                />
                <CommandList>
                  <CommandEmpty>No portfolio found.</CommandEmpty>
                  <CommandGroup>
                    {portfolios.map((portfolio) => (
                      <CommandItem
                        key={portfolio.$id}
                        value={portfolio.$id}
                        onSelect={(currentValue) => {
                          setportfolioId(currentValue);
                          setOpen(false);
                          router.push(portfolio.$id);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            portfolioId === portfolio.$id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {portfolio.$id}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex flex-row justify-end gap-1 border-t p-1 md:justify-start">
                <Button
                  onClick={create}
                  variant="outline"
                  size="sm"
                  className="flex-none"
                >
                  New
                  {loadingCreatePortfolio ? (
                    <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
                  ) : (
                    <LucidePlus className="ml-2 size-3.5" />
                  )}
                </Button>
                {!loadingAuth && <>{owner && <Share />}</>}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
