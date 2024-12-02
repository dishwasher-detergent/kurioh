"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { projectIdAtom } from "@/atoms/project";
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
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";
import { cn, createProject } from "@/lib/utils";
import { Query } from "appwrite";

import { useAtom, useAtomValue } from "jotai";
import { Check, ChevronsUpDown, LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Project() {
  const router = useRouter();

  const organizationId = useAtomValue(organizationIdAtom);
  const [projectId, setprojectId] = useAtom(projectIdAtom);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreateProject, setLoadingCreateProject] =
    useState<boolean>(false);

  async function fetchProjects() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<ProjectItem>(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      [Query.equal("organization_id", organizationId!.id)],
    );

    if (data.documents.length > 0) {
      setProjects(data.documents);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!organizationId) return;

    if (projects.length == 0) {
      fetchProjects();
    }
  }, [projects]);

  async function create() {
    setLoadingCreateProject(true);
    const data = await createProject(organizationId?.id);

    if (data) {
      setProjects((prev) => [...prev, data]);
      setprojectId({
        id: data.$id,
        title: data.title,
      });
      router.push(`${organizationId?.id}/${data.$id}`);
    }

    setLoadingCreateProject(false);
  }

  if (!organizationId) return null;

  return (
    <>
      {projects.length == 0 && !loading ? (
        <Button onClick={create} size="sm">
          {loadingCreateProject ? (
            <>
              <LucideLoader2 className="mr-2 size-4 animate-spin" />
              Creating Project
            </>
          ) : (
            <>
              <LucidePlus className="mr-2 size-4" />
              Create Project
            </>
          )}
        </Button>
      ) : null}
      {loading && <Skeleton className="h-8 min-w-32" />}
      {projects.length > 0 && !loading && (
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
                <span className="truncate">{projectId?.title}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-xs"
                  placeholder="Search project..."
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((project) => (
                      <CommandItem
                        key={project.$id}
                        value={project.$id}
                        onSelect={(currentValue) => {
                          setprojectId({
                            title: project.title,
                            id: currentValue,
                          });
                          setOpen(false);
                          router.push(`/${organizationId}/${project.$id}`);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            projectId?.id === project.$id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {project.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="border-t p-1 md:justify-start">
                <Button
                  onClick={create}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  New Project
                  {loadingCreateProject ? (
                    <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
                  ) : (
                    <LucidePlus className="ml-2 size-3.5" />
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
