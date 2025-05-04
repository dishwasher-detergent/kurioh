"use client";

import { Check, ChevronsUpDown, LucideLoader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Query } from "node-appwrite";
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
import { DyanmicPopover } from "@/components/ui/dynamic-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Project as ProjectInterface } from "@/interfaces/project.interface";
import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
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

    const data = await listProjectsByTeam(teamId, [
      Query.orderAsc("ordinal"),
      Query.limit(100),
      Query.select(["$id", "name", "images", "userId", "teamId"]),
    ]);

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
  }, [teamId]);

  if (loading) {
    return <Skeleton className="h-6 w-32" />;
  }

  if (!teamId) return null;

  if (projects.length == 0) {
    return (
      <div className="flex w-32">
        <AddProject
          teamId={teamId}
          className="text-foreground hover:bg-accent hover:text-accent-foreground bg-card"
        />
      </div>
    );
  }

  return (
    <>
      {projects.length > 0 && (
        <div className="flex flex-col gap-1 md:flex-row">
          <DyanmicPopover
            title="Select Project"
            open={open}
            setOpen={setOpen}
            button={
              <Button
                onClick={() => setOpen(!open)}
                size="sm"
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="text-muted-foreground max-w-48 justify-between gap-2"
                disabled={loading}
              >
                <span className="inline-flex items-center gap-2 overflow-hidden">
                  {projects.find((x) => x.$id == projectId) &&
                    (projects.find((x) => x.$id == projectId)?.images[0] ? (
                      <img
                        className="size-6 flex-none rounded-full object-fill"
                        src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${projects.find((x) => x.$id == projectId)?.images[0]}/view?project=${PROJECT_ID}`}
                      />
                    ) : (
                      <div className="bg-foreground text-background grid size-6 flex-none place-items-center rounded-full object-fill text-xs">
                        <p>
                          {projects.find((x) => x.$id == projectId)?.name[0]}
                        </p>
                      </div>
                    ))}
                  <span className="truncate">
                    {projects.find((x) => x.$id == projectId)?.name ??
                      "Select Project"}
                  </span>
                  {loading && (
                    <LucideLoader2 className="ml-2 size-4 animate-spin" />
                  )}
                </span>
                <ChevronsUpDown className="ml-2 size-4 flex-none" />
              </Button>
            }
          >
            <Command className="bg-background">
              <CommandInput
                className="bg-background h-8 text-base md:text-sm"
                placeholder="Search projects..."
              />
              <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                  {projects.map((projectItem) => (
                    <CommandItem
                      key={projectItem.$id}
                      value={`${projectItem.name}-${projectItem.$id}`}
                      onSelect={() => {
                        setOpen(false);
                      }}
                      className="cursor-pointer text-sm"
                      asChild
                    >
                      <Link
                        href={`/app/teams/${teamId}/projects/${projectItem.$id}`}
                      >
                        {projectItem?.images[0] ? (
                          <img
                            className="size-4 flex-none rounded-full object-fill"
                            src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${projectItem?.images[0]}/view?project=${PROJECT_ID}`}
                          />
                        ) : (
                          <div className="bg-foreground text-background grid size-4 flex-none place-items-center rounded-full object-fill text-[.6rem]">
                            <p>{projectItem?.name[0]}</p>
                          </div>
                        )}
                        <span className="truncate">{projectItem.name}</span>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 flex-none",
                            projectId == projectItem?.$id
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
            <div className="flex border-t p-1 md:justify-start">
              <AddProject teamId={teamId} className="w-full" />
            </div>
          </DyanmicPopover>
        </div>
      )}
    </>
  );
}
