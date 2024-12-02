"use client";

import { organizationIdAtom } from "@/atoms/organization";
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
import { Organization as OrganizationItem } from "@/interfaces/organization.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";
import { cn, createOrganization } from "@/lib/utils";

import { Query } from "appwrite";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown, LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Organization() {
  const router = useRouter();

  const [organizationId, setorganizationId] = useAtom(organizationIdAtom);
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreateOrganization, setLoadingCreateOrganization] =
    useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  async function fetchOrganizations() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<OrganizationItem>(
      DATABASE_ID,
      PORTFOLIOS_COLLECTION_ID,
    );

    if (data.documents.length > 0) {
      setOrganizations(data.documents);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (organizations.length == 0) {
      fetchOrganizations();
    }
  }, [organizations]);

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

  async function create() {
    setLoadingCreateOrganization(true);
    const data = await createOrganization();

    if (data) {
      setOrganizations((prev) => [...prev, data]);
      setorganizationId({
        title: data.title,
        id: data.$id,
      });
      router.push(data.$id);
    }

    setLoadingCreateOrganization(false);
  }

  return (
    <>
      {organizations.length == 0 && !loading ? (
        <Button onClick={create} size="sm">
          {loadingCreateOrganization ? (
            <>
              <LucideLoader2 className="mr-2 size-4 animate-spin" />
              Creating Organization
            </>
          ) : (
            <>
              <LucidePlus className="mr-2 size-4" />
              Create Organization
            </>
          )}
        </Button>
      ) : null}
      {loading && <Skeleton className="h-8 min-w-32" />}
      {organizations.length > 0 && !loading && (
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
                <span className="truncate">{organizationId?.title}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
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
                          setorganizationId({
                            id: currentValue,
                            title: organization.title,
                          });
                          setOpen(false);
                          router.push(organization.$id);
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
                <Button
                  onClick={create}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  New Org
                  {loadingCreateOrganization ? (
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
