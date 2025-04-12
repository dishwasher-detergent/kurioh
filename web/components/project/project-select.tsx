"use client";

import { Check, ChevronsUpDown, LucideLoader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AddProject } from "@/components/project/create-project";
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
import { Project as ProjectInterface } from "@/interfaces/project.interface";
import { listProjectsByTeam } from "@/lib/db";
import { cn } from "@/lib/utils";

export function ProjectSelect() {
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);

  async function fetchProjects() {
    setLoading(true);

    const data = await listProjectsByTeam(teamId);

    if (!data.success) {
      toast.error(data.message);
    }

    if (data?.data) {
      setProjects(data.data.documents);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (teamId) {
      fetchProjects();
    }
  }, [teamId, projectId]);

  if (!teamId) return null;

  return (
    <>
      {projects.length == 0 && !loading ? (
        <div className="flex w-32">
          <AddProject
            teamId={teamId}
            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
          />
        </div>
      ) : null}
      {projects.length > 0 && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setOpen(!open)}
                size="sm"
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="text-muted-foreground max-w-48"
                disabled={loading}
              >
                <span className="truncate">
                  {projects.find((x) => x.$id == projectId)?.name ??
                    "Select Project..."}
                </span>
                {loading && (
                  <LucideLoader2 className="ml-2 size-4 animate-spin" />
                )}
                <ChevronsUpDown className="ml-2 size-4 flex-none" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-sm"
                  placeholder="Search project..."
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((projectItem) => (
                      <CommandItem
                        key={projectItem.$id}
                        value={projectItem.name}
                        onSelect={() => {
                          setOpen(false);
                        }}
                        className="cursor-pointer text-sm"
                        asChild
                      >
                        <Link
                          href={`/app/teams/${teamId}/projects/${projectItem.$id}`}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-none",
                              projectId == projectItem?.$id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="truncate">{projectItem.name}</span>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex border-t p-1 md:justify-start">
                <AddProject teamId={teamId} className="w-full" />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
