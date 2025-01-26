"use client";

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
import { Organization as OrganizationInterface } from "@/interfaces/organization.interface";
import { getOrganizations } from "@/lib/server/utils";
import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Organization() {
  const router = useRouter();
  const { organization, project } = useParams<{
    organization: string;
    project: string;
  }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [owner, setOwner] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState<OrganizationInterface[]>(
    [],
  );

  async function fetchOrganizations() {
    setLoading(true);

    const data = await getOrganizations();

    if (data?.errors) {
      toast.error(data?.errors.message);
    }

    if (data?.data) {
      setOrganizations(data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrganizations();
  }, [organization]);

  useEffect(() => {
    async function checkAuthorization() {
      setLoadingAuth(true);
      setOwner(false);
      // const { team } = await createClient();
      // const user = await getLoggedInUser();

      // if (user && organizationId) {
      //   const memberships = await team.listMemberships(organizationId.id, [
      //     Query.equal("userId", user.$id),
      //   ]);

      //   if (memberships.memberships[0].roles.includes("owner")) {
      //     setOwner(true);
      //   }
      // }
      setLoadingAuth(false);
    }

    checkAuthorization();
  }, []);

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
                {organization ? (
                  <Link
                    href={`/organization/${organization}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    {
                      organizations.find((org) => org.$id === organization)
                        ?.title
                    }
                  </Link>
                ) : (
                  <p className="px-2 text-xs font-semibold">
                    Select An Organization
                  </p>
                )}
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
                    {organizations.map((organizationItem) => (
                      <CommandItem
                        key={organizationItem.$id}
                        value={organizationItem.$id}
                        onSelect={(currentValue) => {
                          setOpen(false);
                          router.push(`/organization/${currentValue}`);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            organization === organizationItem.$id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {organizationItem.title}
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
