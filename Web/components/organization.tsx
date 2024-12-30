"use client";

import { organizationIdAtom, organizationsAtom } from "@/atoms/organization";
import { projectIdAtom } from "@/atoms/project";
import { CreateOrg } from "@/components/create-organization";
import { Share } from "@/components/share";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Organization as OrganizationItem } from "@/interfaces/organization.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, ORGANIZATION_COLLECTION_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Query } from "appwrite";
import { useAtom, useSetAtom } from "jotai";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Organization() {
  const router = useRouter();

  const setProjectId = useSetAtom(projectIdAtom);
  const [organizationId, setorganizationId] = useAtom(organizationIdAtom);
  const [organizations, setOrganizations] = useAtom(organizationsAtom);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [owner, setOwner] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  async function fetchOrganizations() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<OrganizationItem>(
      DATABASE_ID,
      ORGANIZATION_COLLECTION_ID,
    );

    setOrganizations(data.documents);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    async function checkAuthorization() {
      setLoadingAuth(true);
      setOwner(false);
      const { team } = await createClient();
      const user = await getLoggedInUser();

      if (user && organizationId) {
        const memberships = await team.listMemberships(organizationId.id, [
          Query.equal("userId", user.$id),
        ]);

        if (memberships.memberships[0].roles.includes("owner")) {
          setOwner(true);
        }
      }
      setLoadingAuth(false);
    }

    checkAuthorization();
  }, [organizationId]);

  return (
    <>
      {organizations.length == 0 && !loading ? (
        <div className="flex w-32">
          <CreateOrg />
        </div>
      ) : null}
      {loading && <Skeleton className="h-8 min-w-32" />}
      {organizations.length > 0 && !loading && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex items-center">
                <Link
                  href={`/${organizationId?.id}`}
                  onClick={() => setProjectId(null)}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  {organizationId?.title}
                </Link>
                <Button
                  onClick={() => setOpen(!open)}
                  size="icon"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="size-8 text-muted-foreground"
                >
                  <ChevronsUpDown className="size-4" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-xs"
                  placeholder="Search organization..."
                />
                <CommandList>
                  <CommandEmpty>No organization found.</CommandEmpty>
                  <CommandGroup>
                    {organizations.map((organization) => (
                      <CommandItem
                        key={organization.$id}
                        value={organization.$id}
                        onSelect={(currentValue) => {
                          setProjectId(null);
                          setorganizationId({
                            id: currentValue,
                            title: organization.title,
                          });
                          setOpen(false);
                          router.push(`/${currentValue}`);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            organizationId?.id === organization.$id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {organization.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex flex-row justify-end gap-1 border-t p-1 md:justify-start">
                <CreateOrg />
                {!loadingAuth && <>{owner && <Share />}</>}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
