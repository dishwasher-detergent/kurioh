"use client";

import { Check, ChevronsUpDown, LucideLoader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CreateTeam } from "@/components/team/create-team";
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
import { TeamData } from "@/interfaces/team.interface";
import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { listTeams } from "@/lib/team";
import { cn } from "@/lib/utils";

export function TeamSelect() {
  const { teamId } = useParams<{
    teamId: string;
  }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [teams, setTeams] = useState<TeamData[]>([]);

  async function fetchTeams() {
    setLoading(true);

    const data = await listTeams();

    if (!data.success) {
      toast.error(data.message);
    }

    if (data?.data) {
      setTeams(data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTeams();
  }, [teamId]);

  if (loading) {
    return <Skeleton className="h-6 w-32" />;
  }

  if (teams.length == 0) {
    return (
      <div className="flex w-32">
        <CreateTeam />
      </div>
    );
  }

  return (
    <>
      {teams.length > 0 && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex max-w-32 items-center md:max-w-48">
                {teams.find((x) => x.$id === teamId)?.name ? (
                  <Link
                    href={`/app/teams/${teamId}`}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      }),
                      "flex-1 justify-between gap-2 overflow-hidden",
                    )}
                  >
                    {teams.find((x) => x.$id === teamId) &&
                      (teams.find((x) => x.$id === teamId)?.image ? (
                        <img
                          className="size-4 flex-none rounded-full object-fill"
                          src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${teams.find((x) => x.$id === teamId)?.image}/view?project=${PROJECT_ID}`}
                        />
                      ) : (
                        <div className="bg-foreground text-background grid size-6 flex-none place-items-center rounded-full object-fill text-xs">
                          <p>{teams.find((x) => x.$id == teamId)?.name[0]}</p>
                        </div>
                      ))}
                    <span className="hidden truncate md:inline">
                      {teams.find((x) => x.$id === teamId)?.name}
                    </span>
                  </Link>
                ) : (
                  <>
                    <p className="px-2 text-sm font-semibold">Select A Team</p>
                  </>
                )}
                {loading && (
                  <LucideLoader2 className="ml-2 size-4 animate-spin" />
                )}
                <Button
                  onClick={() => setOpen(!open)}
                  size="icon"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="text-muted-foreground size-8"
                >
                  <ChevronsUpDown className="size-4" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-sm"
                  placeholder="Search team..."
                />
                <CommandList>
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup>
                    {teams.map((teamItem) => (
                      <CommandItem
                        key={teamItem.$id}
                        value={teamItem.name}
                        onSelect={() => {
                          setOpen(false);
                        }}
                        className="cursor-pointer text-sm"
                        asChild
                      >
                        <Link href={`/app/teams/${teamItem.$id}`}>
                          {teamItem?.image ? (
                            <img
                              className="size-4 flex-none rounded-full object-fill"
                              src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${teamItem?.image}/view?project=${PROJECT_ID}`}
                            />
                          ) : (
                            <div className="bg-foreground text-background grid size-4 flex-none place-items-center rounded-full object-fill text-[.6rem]">
                              <p>{teamItem?.name[0]}</p>
                            </div>
                          )}
                          <span className="truncate">{teamItem.name}</span>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-none",
                              teamId === teamItem.$id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex flex-row justify-end gap-1 border-t p-1 md:justify-start">
                <CreateTeam className="w-full" />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
